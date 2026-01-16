import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createConnection } from 'mysql2/promise';
import consola from 'consola';
import { SignJWT } from 'jose';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ESMODULE 读取环境变量建议使用绝对路径
config({ path: path.resolve(__dirname, '../.env') })
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const JWT_SECRET = new TextEncoder().encode(process.env.VITE_JWT_SECRET || 'your-secret-key-at-least-32-characters-long-123456');

/**
 * 数据库连接函数
 */
async function getDbConnection() {
  const databaseUrl = process.env.MYSQL_URL;
  if (!databaseUrl) {
    consola.warn('⚠️ MYSQL_URL 未定义，将使用模拟数据运行');
    return null;
  }
  try {
    const connection = await createConnection(databaseUrl);

    const DB_NAME = 'react_cicd_demo';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    await connection.query(`USE ${DB_NAME}`);

    return connection;
  } catch (err) {
    consola.error('❌ 数据库连接失败:', err.message);
    return null;
  }
}

/**
 * 生成 JWT Token
 */
async function generateToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(JWT_SECRET);
}

/**
 * 登录验证接口
 */
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const connection = await getDbConnection();
  if (!connection) {
    return res.status(500).json({ success: false, message: '数据库连接失败' });
  }

  try {
    const [rows] = await connection.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    const user = rows[0];

    if (user) {
      const token = await generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });

      consola.success(`👤 用户登录成功: ${email}`);
      res.json({ success: true, token, user: { name: user.name, email: user.email, role: user.role } });
    } else {
      consola.warn(`🚫 登录失败尝试: ${email}`);
      res.status(401).json({ success: false, message: '邮箱或密码错误' });
    }
  } catch (err) {
    consola.error('❌ 登录查询失败:', err.message);
    res.status(500).json({ success: false, message: '登录失败' });
  } finally {
    await connection.end();
  }
});

/**
 * OAuth2 回调处理接口 (后端交换 Token)
 */
app.post('/api/oauth/callback', async (req, res) => {
  const { code, provider } = req.body;

  if (!code || !provider) {
    return res.status(400).json({ message: '缺失必要参数' });
  }

  try {
    let userData = {};

    if (provider === 'github') {
      // 1. 换取 GitHub Access Token
      const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code
      }, {
        headers: { Accept: 'application/json' }
      });

      const accessToken = tokenResponse.data.access_token;
      if (!accessToken) {
        throw new Error(`GitHub 授权失败: ${tokenResponse.data.error_description || tokenResponse.data.error || 'Unknown error'}`);
      }

      // 2. 获取 GitHub 用户信息
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      // GitHub 可能不返回公开邮箱，需要单独获取
      let email = userResponse.data.email;
      if (!email) {
        try {
          const emailsResponse = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          const primaryEmail = emailsResponse.data.find(e => e.primary && e.verified);
          email = primaryEmail ? primaryEmail.email : `${userResponse.data.login}@github.com`;
        } catch (e) {
          email = `${userResponse.data.login}@github.com`;
        }
      }

      userData = {
        name: userResponse.data.name || userResponse.data.login,
        email: email,
        role: 'admin',
        avatar: userResponse.data.avatar_url
      };
    } else if (provider === 'gitlab') {
      // 1. 换取 GitLab Access Token
      const origin = req.headers.origin || 'http://localhost:5173';
      const redirectUri = origin + '/react-cicd-demo/oauth/callback';
      
      consola.info(`🔄 GitLab 回调使用 Redirect URI: ${redirectUri}`);

      const tokenResponse = await axios.post('https://gitlab.com/oauth/token', {
        client_id: process.env.GITLAB_CLIENT_ID,
        client_secret: process.env.GITLAB_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      }, {
        headers: { Accept: 'application/json' }
      });

      const accessToken = tokenResponse.data.access_token;
      if (!accessToken) {
        throw new Error(`GitLab 授权失败: ${tokenResponse.data.error_description || tokenResponse.data.error || 'Unknown error'}`);
      }

      // 2. 获取 GitLab 用户信息
      const userResponse = await axios.get('https://gitlab.com/api/v4/user', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      userData = {
        name: userResponse.data.name || userResponse.data.username,
        email: userResponse.data.email,
        role: 'admin',
        avatar: userResponse.data.avatar_url
      };
    }

    // 3. 数据库持久化：查询或创建用户
    const connection = await getDbConnection();
    if (connection) {
      try {
        const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [userData.email]);
        if (existing.length === 0) {
          await connection.query(
            'INSERT INTO users (name, email, role, avatar, provider) VALUES (?, ?, ?, ?, ?)',
            [userData.name, userData.email, userData.role, userData.avatar, provider]
          );
          consola.success(`🆕 数据库：已为三方登录创建新用户: ${userData.email}`);
        } else {
          userData.role = existing[0].role; // 使用数据库中的角色
          consola.info(`🔄 数据库：已找到现有三方登录用户: ${userData.email}`);
        }
      } catch (dbErr) {
        consola.error('❌ 数据库：同步三方登录用户失败:', dbErr.message);
      } finally {
        await connection.end();
      }
    }

    // 4. 生成应用内 JWT
    const token = await generateToken(userData);

    consola.success(`🔗 三方登录成功: ${userData.name} (${provider})`);
    res.json({ success: true, token, user: userData });
  } catch (err) {
    consola.error(`❌ OAuth 交换失败:`, err.response?.data || err.message);
    res.status(500).json({ 
      message: '三方登录失败', 
      error: err.message,
      details: err.response?.data 
    });
  }
});


app.listen(PORT, () => {
  consola.success(`✅ 后端服务运行在: http://localhost:${PORT}`);
});
import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createConnection } from 'mysql2/promise';
import consola from 'consola';
import { SignJWT, jwtVerify } from 'jose';
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

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-at-least-32-characters');

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
      if (!accessToken) throw new Error('GitHub 授权失败');

      // 2. 获取 GitHub 用户信息
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      userData = {
        name: userResponse.data.name || userResponse.data.login,
        email: userResponse.data.email,
        role: 'admin', // 默认分配 admin 角色
        avatar: userResponse.data.avatar_url
      };
    } else if (provider === 'gitlab') {
      const token = await axios.post('https://gitlab.example.com/oauth/authorize', {
        
      })
      // GitLab 授权码交换逻辑 (占位，实际可参考 GitHub 实现)
      userData = { 
        name: 'GitLab User', 
        email: 'gitlab@demo.com', 
        role: 'user', 
        avatar: 'https://gitlab.com/gitlab.png' 
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
    consola.error(`❌ OAuth 交换失败:`, err.message);
    res.status(500).json({ message: '三方登录失败', error: err.message });
  }
});

/**
 * 身份验证中间件
 */
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: '令牌无效或已过期' });
  }
}

/**
 * 初始化数据库表结构
 */
async function initDatabase(connection) {
  if (!connection) return;
  
  try {
    // 1. 创建用户表
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        avatar VARCHAR(500),
        provider VARCHAR(50) DEFAULT 'local',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await connection.query(createUsersTable);
    consola.success('📊 数据库：用户表 (users) 初始化成功/已存在');

    // 2. 检查是否需要插入初始管理员
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM users');
    if (rows[0].count === 0) {
      const insertAdmin = `
        INSERT INTO users (name, email, password, role, provider) 
        VALUES (?, ?, ?, ?, ?)
      `;
      await connection.query(insertAdmin, ['Admin User', 'admin@123.com', '123456', 'admin', 'local']);
      consola.success('👤 数据库：已创建初始管理员账号');
    }
  } catch (err) {
    consola.error('❌ 数据库：表初始化失败:', err.message);
  }
}

async function Main() {
  const connection = await getDbConnection();
  if (connection) {
    await initDatabase(connection);
    // 使用完后关闭连接（生产环境建议使用连接池）
    await connection.end();
  }
  consola.success('🚀 后端系统已准备就绪');
}

// 启动后端服务
app.listen(PORT, () => {
  consola.success(`✅ 后端服务运行在: http://localhost:${PORT}`);
});
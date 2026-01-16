import { config } from 'dotenv';
import express,{ type Request, type Response } from 'express';
import cors from 'cors';
import { createConnection, type Connection } from 'mysql2/promise';
import consola from 'consola';
import { SignJWT } from 'jose';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import * as trpcExpress from '@trpc/server/adapters/express';
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ESMODULE 读取环境变量建议使用绝对路径
config({ path: path.resolve(__dirname, '../.env') })
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const JWT_SECRET = new TextEncoder().encode(process.env.VITE_JWT_SECRET || 'your-secret-key-at-least-32-characters-long-123456');

interface UserData {
  id?: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  provider?: string;
}

/**
 * 数据库连接函数
 */
async function getDbConnection(): Promise<Connection | null> {
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
  } catch (err: any) {
    consola.error('❌ 数据库连接失败:', err.message);
    return null;
  }
}

/**
 * 生成 JWT Token
 */
async function generateToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(JWT_SECRET);
}

// 1. 创建 tRPC 上下文类型
interface Context {
  req: Request;
  res: Response;
}

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions): Context => ({ req, res });

const t = initTRPC.context<Context>().create();

const appRouter = t.router({
  // 1. 本地登录
  localLogin: t.procedure
    .input(z.object({
      email: z.email(),
      password: z.string()
    }))
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const connection = await getDbConnection();
      if (!connection) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '数据库连接失败',
        });
      }
      try {
        const [rows] = await connection.query(
          'SELECT * FROM users WHERE email = ? AND password = ?',
          [email, password]
        ) as any[];

        const user = rows[0] as UserData | undefined;

        if (user) {
          const token = await generateToken({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          });

          consola.success(`👤 用户登录成功: ${email}`);
          return {
            success: true,
            token,
            user: { name: user.name, email: user.email, role: user.role }
          };
        } else {
          consola.warn(`🚫 登录失败尝试: ${email}`);
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: '邮箱或密码错误',
          });
        }
      } catch (err: any) {
        if (err instanceof TRPCError) throw err;
        consola.error('❌ 登录查询失败:', err.message);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '登录失败',
        });
      } finally {
        await connection.end();
      }
    }),

  // 2. OAuth 登录
  oauthLogin: t.procedure
    .input(z.object({
      code: z.string(),
      provider: z.enum(['github', 'gitlab'])
    }))
    .mutation(async ({ input, ctx }) => {
      const { code, provider } = input;
      let userData: UserData = { name: '', email: '', role: 'admin' };

      try {
        if (provider === 'github') {
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

          const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });

          let email = userResponse.data.email;
          if (!email) {
            try {
              const emailsResponse = await axios.get('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${accessToken}` }
              });
              const primaryEmail = emailsResponse.data.find((e: any) => e.primary && e.verified);
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
          const origin = ctx.req.headers.origin || 'http://localhost:5173';
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

        const connection = await getDbConnection();
        if (connection) {
          try {
            const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [userData.email]) as any[];
            if (existing.length === 0) {
              await connection.query(
                'INSERT INTO users (name, email, role, avatar, provider) VALUES (?, ?, ?, ?, ?)',
                [userData.name, userData.email, userData.role, userData.avatar, provider]
              );
              consola.success(`🆕 数据库：已为三方登录创建新用户: ${userData.email}`);
            } else {
              userData.role = existing[0].role;
              consola.info(`🔄 数据库：已找到现有三方登录用户: ${userData.email}`);
            }
          } finally {
            await connection.end();
          }
        }

        const token = await generateToken(userData);
        consola.success(`🔗 三方登录成功: ${userData.name} (${provider})`);
        
        return { success: true, token, user: userData };
      } catch (err: any) {
        consola.error(`❌ OAuth 交换失败:`, err.response?.data || err.message);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '三方登录失败',
          cause: err
        });
      }
    }),
});

// 使用 tRPC 中间件
app.use('/trpc', trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext
}));

app.listen(PORT, () => {
  consola.success(`✅ 后端服务运行在: http://localhost:${PORT}`);
});

export type AppRouter = typeof appRouter;
import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createConnection } from 'mysql2/promise';
import consola from 'consola';
// ESMODULE 读取环境变量必须指定.env路径
config({ path: '../.env' })
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

async function getDbConnection() {
  const databaseUrl = process.env.MYSQL_URL;
  if (!databaseUrl) {
    throw new Error('MYSQL_URL environment variable is not defined');
  }
  const connection = await createConnection(databaseUrl);
  return connection;
}

async function Main() {
  try {
    await getDbConnection();
    consola.success('✅ 后端：数据库连接成功！');
  } catch (error) {
    consola.error('❌ 后端：数据库连接失败', error.message);
  }
}

// 启动后端服务
app.listen(PORT, () => {
  consola.success(`✅ 后端服务启动成功：http://localhost:${PORT}`);
  Main()
});
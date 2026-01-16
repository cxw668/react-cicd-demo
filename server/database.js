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

async function Main() {
  const connection = await getDbConnection();
  if (connection) {
    await initDatabase(connection);
    // 使用完后关闭连接（生产环境建议使用连接池）
    await connection.end();
  }
  consola.success('🚀 后端系统已准备就绪');
}
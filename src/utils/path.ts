/**
 * 获取 Vite 配置的 Base URL
 * 默认为 '/'，在开发环境或生产环境下会自动读取 import.meta.env.BASE_URL
 */
export const BASE_URL = import.meta.env.BASE_URL || '/';

/**
 * 格式化 API 路径，自动注入 Base URL
 * @param path 原始路径 (如 '/api/user')
 * @returns 注入后的路径 (如 '/react-cicd-demo/api/user')
 */
export const withBase = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  return `${cleanBase}${cleanPath}`;
};

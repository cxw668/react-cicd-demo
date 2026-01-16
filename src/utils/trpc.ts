import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../server/index'; // 导入后端导出的 AppRouter 类型

// 1. 创建 tRPC 的 React 实例
export const trpc = createTRPCReact<AppRouter>();
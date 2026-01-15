import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'

import { withBase } from '@/utils/path'

/**
 * 计数器 store
 * create 函数创建一个 store，参数是一个计数器类型，返回值是 store 的状态与更新函数
 */
type CounterStore = {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  incrementByAmount: (amount: number) => void
}

export const useCounterStore = create<CounterStore>((set) => ({
  count: 1,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  incrementByAmount: (amount: number) => set((state) => ({ count: state.count + amount })),
}))

export interface User {
  name: string
  email: string
}

type UserStore = {
  user: User | null
  loading: boolean
  error: string | null
  fetchUser: () => Promise<void>
  setUser: (user: User | null) => void
}

/**
 * Dashboard 用户状态管理 - 条件渲染部分
 */
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  error: null,
  /**
   * 设置用户信息（同步）
   * @param user 用户信息，传 null 可清空
   */
  setUser: (user) => set({ user }),
  /**
   * 异步获取用户信息，内部自动处理 loading 与错误状态
   */
  fetchUser: async () => {
    // 开始获取时，清空之前的状态，防止 UI 重叠
    set({ loading: true, error: null, user: null })
    try {
      const response = await fetch(withBase('/api/user'))
      if (!response.ok) throw new Error('Failed to fetch user')
      const user = await response.json()
      set({ user, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },
}))

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

let mockTodos: Todo[] = [
  { id: '1', text: 'Learn React Query Basics', completed: true, createdAt: Date.now() },
  { id: '2', text: 'Master useQuery', completed: true, createdAt: Date.now() },
  { id: '3', text: 'Understand useMutation', completed: false, createdAt: Date.now() },
]

/**
 * Todo 业务接口封装
 */
export const Todo_api = {
  /**
   * 获取待办事项列表
   */
  fetchTodos: async (): Promise<Todo[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    if (!localStorage.getItem('todos')) {
      localStorage.setItem('todos', JSON.stringify([...mockTodos]))
    }
    return JSON.parse(localStorage.getItem('todos') || '[]') as Todo[]
  },
  /**
   * 添加新待办事项
   */
  addTodo: async (text: string): Promise<Todo> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const currentTodos = JSON.parse(localStorage.getItem('todos') || '[]') as Todo[]
    const newTodo = { id: nanoid(), text, completed: false, createdAt: Date.now() }
    const updatedTodos = [...currentTodos, newTodo]
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
    return newTodo
  },
  /**
   * 切换待办事项完成状态
   */
  toggleTodo: async (id: string): Promise<Todo> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const currentTodos = JSON.parse(localStorage.getItem('todos') || '[]') as Todo[]
    const todoIndex = currentTodos.findIndex(t => t.id === id)
    if (todoIndex === -1) throw new Error('Todo not found')
    currentTodos[todoIndex].createdAt = Date.now()
    currentTodos[todoIndex].completed = !currentTodos[todoIndex].completed
    localStorage.setItem('todos', JSON.stringify(currentTodos))
    return currentTodos[todoIndex]
  },
  /**
   * 删除待办事项
   */
  deleteTodo: async (id: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const currentTodos = JSON.parse(localStorage.getItem('todos') || '[]') as Todo[]
    const updatedTodos = currentTodos.filter(t => t.id !== id)
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
    return id
  }
}

type TodoStore = {
  todos: Todo[]
  loading: boolean
  error: string | null
  fetchTodos: () => Promise<void>
  addTodo: (text: string) => Promise<Todo>
  toggleTodo: (id: string) => Promise<Todo>
  deleteTodo: (id: string) => Promise<string>
}

/**
 * Todo 状态管理 Store
 */
export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  loading: false,
  error: null,
  fetchTodos: async () => {
    set({ loading: true, error: null })
    try {
      const todos = await Todo_api.fetchTodos()
      set({ todos, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },
  addTodo: async (text: string) => {
    set({ loading: true, error: null })
    try {
      const todo = await Todo_api.addTodo(text)
      set((state) => ({ todos: [...state.todos, todo], loading: false }))
      return todo
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
      throw err
    }
  },
  toggleTodo: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const todo = await Todo_api.toggleTodo(id)
      set((state) => ({ todos: state.todos.map(t => t.id === id ? todo : t), loading: false }))
      return todo
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
      throw err
    }
  },
  deleteTodo: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const deletedId = await Todo_api.deleteTodo(id)
      set((state) => ({ todos: state.todos.filter(t => t.id !== deletedId), loading: false }))
      return deletedId
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
      throw err
    }
  }
}))

/**
 * 用户表单状态管理 - Hooks Form
 */
export const mockCountriesOptions =
  ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'Japan', 'China', 'Brazil', 'India']

/**
 * 国家到国籍的映射常量
 */
export const COUNTRY_TO_NATION = {
  USA: 'American',
  Canada: 'Canadian',
  UK: 'British',
  Australia: 'Australian',
  Germany: 'German',
  France: 'French',
  Japan: 'Japanese',
  China: 'Chinese',
  Brazil: 'Brazilian',
  India: 'Indian'
} as const;

type Country = keyof typeof COUNTRY_TO_NATION;
type Nation = (typeof COUNTRY_TO_NATION)[Country];

/**
 * 用户表单基础数据结构
 */
export type UserForm = {
  id: string
  name: string
  email: string
  age: number
  birthdate?: string
  avatar?: string
  gender: 'male' | 'female' | 'other'
  country: Country
}

/**
 * 用户表单计算/派生字段
 */
export interface UserFormComputed {
  nation: Nation
  isMinor: boolean
  requiresApproval: boolean
  backgroundCheckRequired: boolean
}

/**
 * 用户表单操作上下文
 */
export type UserFormContext = {
  mode: 'create' | 'edit' | 'view' | 'audit'
  role: 'admin' | 'guest'
}

/**
 * 业务联动计算函数：根据表单基础数据计算派生状态
 * @param user 部分用户表单数据
 * @returns 计算后的派生字段对象
 */
export const computeUserFields = (user: Partial<UserForm>): UserFormComputed => {
  const country = user.country || 'USA';
  const age = user.age || 0;
  const isMinor = age < 18;
  const nation = COUNTRY_TO_NATION[country as Country] || 'American';
  
  // 业务逻辑联动规则：
  // 1. 未成年人 (isMinor) 自动标记需要审批 (requiresApproval)
  // 2. 特定国家 (如 Japan, India) 的用户无论年龄均需要审批
  const requiresApproval = isMinor || ['Japan', 'India'].includes(country);
  
  // 3. 成年人 (!isMinor) 且来自特定国家 (如 USA, UK, Canada) 需要进行背景调查 (backgroundCheckRequired)
  const backgroundCheckRequired = !isMinor && ['USA', 'UK', 'Canada'].includes(country);

  return {
    nation,
    isMinor,
    requiresApproval,
    backgroundCheckRequired
  };
};

/**
 * 用户表单 Store 类型定义
 */
type UserFormStore = {
  users: UserForm[]
  loading: boolean
  error: string | null
  context: UserFormContext // 当前操作上下文
  fetchUsers: () => Promise<void>
  addUser: (user: Omit<UserForm, 'id'>) => Promise<void>
  updateUser: (user: UserForm) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  setContext: (context: Partial<UserFormContext>) => void // 更新上下文
}

/**
 * 用户表单状态管理 Store (对接 MSW Mock 接口)
 */
export const useUserFormStore = create<UserFormStore>()(
  persist(
    (set) => ({
      users: [],
      loading: false,
      error: null,
      context: { mode: 'create', role: 'guest' },
      
      /**
       * 异步获取所有用户列表 (从 MSW Mock 接口获取)
       */
      fetchUsers: async () => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(withBase('/api/users'))
          if (!response.ok) throw new Error('Failed to fetch users')
          const users = await response.json()
          set({ users, loading: false })
        } catch (err) {
          set({ error: (err as Error).message, loading: false })
        }
      },

      /**
       * 新增用户 (调用 MSW POST 接口)
       * @param user 不含 ID 的用户信息
       */
      addUser: async (user: Omit<UserForm, 'id'>) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(withBase('/api/users'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
          })
          if (!response.ok) throw new Error('Failed to add user')
          const newUser = await response.json()
          set((state) => ({
            users: [...state.users, newUser],
            loading: false,
          }))
        } catch (err) {
          set({ error: (err as Error).message, loading: false })
          throw err
        }
      },

      /**
       * 更新用户信息 (调用 MSW PUT 接口)
       * @param user 包含 ID 的完整用户信息
       */
      updateUser: async (user: UserForm) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(withBase(`/api/users/${user.id}`), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
          })
          if (!response.ok) throw new Error('Failed to update user')
          set((state) => ({
            users: state.users.map(u => u.id === user.id ? user : u),
            loading: false
          }))
        } catch (err) {
          set({ error: (err as Error).message, loading: false })
          throw err
        }
      },

      /**
       * 删除用户 (调用 MSW DELETE 接口)
       * @param id 用户唯一标识
       */
      deleteUser: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(withBase(`/api/users/${id}`), {
            method: 'DELETE'
          })
          if (!response.ok) throw new Error('Failed to delete user')
          set((state) => ({
            users: state.users.filter(u => u.id !== id),
            loading: false
          }))
        } catch (err) {
          set({ error: (err as Error).message, loading: false })
          throw err
        }
      },

      /**
       * 更新表单操作上下文 (如角色、模式)
       * @param newContext 部分上下文信息
       */
      setContext: (newContext) => {
        set((state) => ({
          context: { ...state.context, ...newContext }
        }))
      }
    }),
    {
      name: 'userForm-storage'
    }
  )
)

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  note: string;
}

export const tasksData: DailyTask[] = [
  {
    id: '1',
    title: 'Day 1 —— 核心架构与异步状态',
    description: 'Zustand, TanStack Query, i18n 基础',
    note: `### 1. Zustand 状态管理
- **核心概念**：使用 \`create\` 函数定义原子化 Store，解耦逻辑与视图。
- **性能优化**：引入 \`useShallow\` 进行浅比较，确保只有关心的状态变化时才触发组件重绘。
- **状态更新**：掌握 \`set\` 函数的函数式更新（基于 prev state）与直接合并模式。

### 2. TanStack Query (React Query)
- **数据获取**：使用 \`useQuery\` 封装 API 请求，自动处理 \`isLoading\`、\`error\` 及数据缓存。
- **数据同步**：通过 \`queryClient.invalidateQueries\` 实现数据操作后的自动静默刷新。

### 3. i18n 国际化方案
- **技术栈**：\`react-i18next\` + \`i18next-http-backend\` (动态加载) + \`i18next-browser-languagedetector\` (自动检测)。
- **配置要点**：
  - \`backend.loadPath\`：定义多语言 JSON 文件的动态加载路径。
  - \`fallbackLng\`：配置回退语言，提升系统鲁棒性。
  - \`detection\`：设置语言检测优先级（如 LocalStorage > Navigator）。

### 4. 仪表盘基础 (Dashboard)
- 实现了基础的 \`UserProfile\` 组件，包含加载骨架屏逻辑与异步数据获取演示。`
  },
  {
    id: '2',
    title: 'Day 2 —— 认证授权与交互增强',
    description: 'JWT Auth, Hook Form, 乐观更新',
    note: `### 1. JWT 认证安全 (Auth)
- **技术选型**：使用轻量级 \`jose\` 库处理客户端加密。
- **流程实现**：
  - **登录逻辑**：校验凭据后生成 JWT 令牌并存入 \`localStorage\`。
  - **路由保护**：在 \`App.tsx\` 顶层进行令牌校验，未授权请求自动重定向至 \`LoginPage\`。
  - **工具类封装**：封装 \`verifyToken\` 函数，确保每个受保护路由的安全性。

### 2. React Hook Form 进阶
- **表单控制**：使用 \`useForm\` 替代受控组件，大幅减少渲染次数。
- **MUI 集成**：通过 \`Controller\` 组件完美适配 MUI 的 \`TextField\`、\`Select\` 等受控 UI 组件。

### 3. TanStack Query 乐观更新 (Optimistic Updates)
- **交互升级**：在 \`OptimizedTanStack.tsx\` 中实现“先更新 UI，后同步后端”。
- **错误处理**：通过 \`onMutate\` 保存快照，在 \`onError\` 中实现 UI 状态自动回滚，确保数据最终一致性。

### 4. UI/UX 增强
- **MUI 深度集成**：引入 \`Drawer\` (抽屉导航)、\`Dialog\` (弹窗详情) 和 \`Menu\` (快速任务切换)。
- **Markdown 支持**：集成 \`react-markdown\`，支持任务笔记的富文本展示。`
  },
]

type TasksDataStore = {
  tasks: DailyTask[],
  loading: boolean,
  error: string | null,
  fetchTasks: () => Promise<void>,
  addTask: (task: Omit<DailyTask, 'id'>) => Promise<void>,
  deleteTask: (id: string) => Promise<void>,
  updateTask: (task: DailyTask) => Promise<void>
}
export const useTasksDataStore = create<TasksDataStore>()(
  persist(
    (set) => ({
      tasks: tasksData, // 初始使用硬编码数据
      loading: false,
      error: null,
      fetchTasks: async () => {
        // 由于使用了 persist，数据会自动从 localStorage 加载
        // 这里可以作为手动刷新的逻辑，或者保持为空
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        set({ loading: false });
      },
      addTask: async (task: Omit<DailyTask, 'id'>) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        const newTask = { ...task, id: nanoid() };
        set((state) => ({
          tasks: [...state.tasks, newTask],
          loading: false
        }));
      },
      deleteTask: async (id: string) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        set((state) => ({
          tasks: state.tasks.filter(t => t.id !== id),
          loading: false
        }));
      },
      updateTask: async (task: DailyTask) => {
        set({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        set((state) => ({
          tasks: state.tasks.map(t => t.id === task.id ? task : t),
          loading: false
        }));
      }
    }),
    {
      name: 'daily-tasks-storage', // localStorage 中的 key
    }
  )
)
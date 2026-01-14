import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import consola from 'consola'

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
      await new Promise((resolve) => setTimeout(resolve, 500))
      const random = Math.random()
      if (random < 0.3) {
        throw new Error('failed to load user data')
      }
      set({ user: { name: 'Jack', email: '123@qq.com' }, loading: false })
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

export const Todo_api = {
  fetchTodos: async (): Promise<Todo[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    if (!localStorage.getItem('todos')) {
      localStorage.setItem('todos', JSON.stringify([...mockTodos]))
    }
    return JSON.parse(localStorage.getItem('todos') || '[]') as Todo[]
  },
  addTodo: async (text: string): Promise<Todo> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const currentTodos = JSON.parse(localStorage.getItem('todos') || '[]') as Todo[]
    const newTodo = { id: nanoid(), text, completed: false, createdAt: Date.now() }
    const updatedTodos = [...currentTodos, newTodo]
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
    return newTodo
  },
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
export const mockNationsOptions =
  ['American', 'Canadian', 'British', 'Australian', 'German', 'French', 'Japanese', 'Chinese', 'Brazilian', 'Indian']
export type UserForm = {
  id: string
  name: string
  email: string
  age: number
  birthdate?: string
  avatar?: string
  gender: 'male' | 'female' | 'other'
  countries: 'USA' | 'Canada' | 'UK' | 'Australia' | 'Germany' | 'France' | 'Japan' | 'China' | 'Brazil' | 'India'
  nations: 'American' | 'Canadian' | 'British' | 'Australian' | 'German' | 'French' | 'Japanese' | 'Chinese' | 'Brazilian' | 'Indian'
}
// 创建 10 条模拟用户数据
let mockUserData: UserForm[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', age: 28, gender: 'female', countries: 'USA', nations: 'American' },
  { id: '2', name: 'Bob', email: 'bob@example.com', age: 34, gender: 'male', countries: 'Canada', nations: 'Canadian' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com', age: 22, gender: 'male', countries: 'UK', nations: 'British' },
  { id: '4', name: 'Diana', email: 'diana@example.com', age: 30, gender: 'female', countries: 'Australia', nations: 'Australian' },
  { id: '5', name: 'Ethan', email: 'ethan@example.com', age: 26, gender: 'male', countries: 'Germany', nations: 'German' },
  { id: '6', name: 'Fiona', email: 'fiona@example.com', age: 29, gender: 'female', countries: 'France', nations: 'French' },
  { id: '7', name: 'George', email: 'george@example.com', age: 31, gender: 'male', countries: 'Japan', nations: 'Japanese' },
  { id: '8', name: 'Hannah', email: 'hannah@example.com', age: 25, gender: 'female', countries: 'China', nations: 'Chinese' },
  { id: '9', name: 'Ian', email: 'ian@example.com', age: 27, gender: 'male', countries: 'Brazil', nations: 'Brazilian' },
  { id: '10', name: 'Julia', email: 'julia@example.com', age: 33, gender: 'female', countries: 'India', nations: 'Indian' },
]

export const api_UserForm = {
  getUser: async (): Promise<UserForm[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(mockUserData))
    }
    mockUserData = JSON.parse(localStorage.getItem('users') || '[]') as UserForm[]
    return [...mockUserData]
  },
  addUser: async (user: Omit<UserForm, 'id'>): Promise<UserForm> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newUser = { ...user, id: nanoid() }
    mockUserData = [...mockUserData, newUser]
    localStorage.setItem('users', JSON.stringify(mockUserData))
    return newUser
  },
  deleteUser: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    mockUserData = mockUserData.filter(u => u.id !== id)
    localStorage.setItem('users', JSON.stringify(mockUserData))
  },
  updateUser: async (user: UserForm): Promise<UserForm> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    mockUserData = mockUserData.map(u => u.id === user.id ? user : u)
    localStorage.setItem('users', JSON.stringify(mockUserData))
    return user
  }
}

type UserFormStore = {
  users: UserForm[]
  loading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
  addUser: (user: Omit<UserForm, 'id'>) => Promise<void> //0mit 省略 id 字段
  updateUser: (user: UserForm) => Promise<void>
  deleteUser: (id: string) => Promise<void>
}

export const useUserFormStore = create<UserFormStore>((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      const users = await api_UserForm.getUser()
      set({ users, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },
  addUser: async (user) => {
    set({ loading: true, error: null })
    try {
      const newUser = await api_UserForm.addUser(user)
      set((state) => ({ users: [...state.users, newUser], loading: false }))
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },
  updateUser: async (user) => {
    set({ loading: true, error: null })
    try {
      const updatedUser = await api_UserForm.updateUser(user)
      set((state) => ({
        users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
        loading: false,
      }))
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },
  deleteUser: async (id) => {
    set({ loading: true, error: null })
    try {
      await api_UserForm.deleteUser(id)
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        loading: false,
      }))
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },
}))

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
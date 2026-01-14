import { create } from 'zustand'
import { nanoid } from 'nanoid'

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

export const useCounterStore = create<CounterStore>((set)=>({
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
  { id: '1', text: 'Learn React Query Basics', completed: true, createdAt: Date.now()},
  { id: '2', text: 'Master useQuery', completed: true, createdAt: Date.now()},
  { id: '3', text: 'Understand useMutation', completed: false, createdAt: Date.now()},
]

export const Todo_api = {
  fetchTodos: async (): Promise<Todo[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    if(!localStorage.getItem('todos')) {
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
  ['USA' , 'Canada' , 'UK' , 'Australia' , 'Germany' , 'France' , 'Japan' , 'China' , 'Brazil' , 'India']
export const mockNationsOptions = 
  ['American' , 'Canadian' , 'British' , 'Australian' , 'German' , 'French' , 'Japanese' , 'Chinese' , 'Brazilian' , 'Indian']
export type UserForm = {
  id: string
  name:string
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
    if(!localStorage.getItem('users')){
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
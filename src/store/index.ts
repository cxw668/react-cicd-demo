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
import { create } from 'zustand'

type CounterStore = {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  incrementByAmount: (amount: number) => void
}
/**
 * 计数器 store
 * create 函数创建一个 store，参数是一个计数器类型，返回值是 store 的状态与更新函数
 */
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
    set({ loading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
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
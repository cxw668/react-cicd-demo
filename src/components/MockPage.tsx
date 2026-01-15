import { useEffect, useState } from "react"
import { withBase } from '@/utils/path'
// import { useMountEffect } from "@/hooks/useMountEffect"
interface User { name: string }
export default function MockPage() {
  const [user, setUser] = useState<User | null>(null)

  /**
   * 自定义Hooks处理严格模式下会发起两次网络请求的问题
   * 两次请求过程： 挂载 → 执行 useEffect → 立即模拟「卸载」→ 再次模拟「挂载」→ 再次执行 useEffect
   */
  // useMountEffect(() => {
  //   fetch(withBase('/api/user'))
  //     .then(res => res.json())
  //     .then(data => setUser(data))
  // })
  useEffect(() => {
    fetch(withBase('/api/user'))
      .then(res => res.json())
      .then(data => setUser(data))
  }, [])


  return <div>Hello {user && user?.name}</div>;
}
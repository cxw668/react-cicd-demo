import { useEffect, useRef } from 'react'

export const useMountEffect = (callback: () => void) => {
  const isExecuted = useRef(false)

  useEffect(() => {
    if (!isExecuted.current) {
      callback() // 只执行一次回调
      isExecuted.current = true // 执行后上锁
    }
  }, [callback])
}
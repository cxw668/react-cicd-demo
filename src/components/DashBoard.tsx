import { useEffect, useState } from "react";

// 1. useState
function Counter() {
  const [count, setCount] = useState(0)
  const handleCountAdd = () => {
    setCount(prev => prev + 1)
  }
  const handleCountSubstract = () => {
    setCount(prev => prev > 0 ? prev - 1 : prev = 0)
  }
  const handleCountReset = () => {
    setCount(0)
  }
  return (
    <div className="text-blue-500">
      <h2 className="text-lg text-gray-900 mb-6 text-center">1. Counter</h2>
      <div className="text-center mb-8">
        <div className="inline-block px-8 py-4 bg-gray-50 rounded-2xl border-2 border-gray-200">
          <span className="text-6xl font-bold text-gray-800">{count}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={handleCountSubstract}
          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
        >
          −
        </button>

        <button
          onClick={handleCountReset}
          className="px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium"
        >
          Reset
        </button>

        <button
          onClick={handleCountAdd}
          className="px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium"
        >
          +
        </button>
      </div>
    </div>
  )
}

// 2. useEffect
function Clock() {
  const [time, setTime] = useState<Date | null>(null)
  useEffect(() => {
    setTime(new Date())

    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])
  return (
    <div className="w-full">
      <h2 className="text-lg text-gray-900 my-6 text-center">2. Clock</h2>

      <div className="flex items-center justify-center gap-4 mb-4">
        {/* 小时 */}
        <div className="relative">
          <div className="w-20 h-20 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-shadow-lg">
            <span className="text-4xl font-bold text-white">
              {time?.getHours().toString().padStart(2, '0')}
            </span>
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-500 font-medium">HOURS</span>
          </div>
        </div>

        {/* 分隔符 */}
        <div className="text-3xl font-bold text-gray-300 mb-6">:</div>

        {/* 分钟 */}
        <div className="relative">
          <div className="w-20 h-20 bg-linear-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-shadow-lg">
            <span className="text-4xl font-bold text-white">
              {time?.getMinutes().toString().padStart(2, '0')}
            </span>
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-500 font-medium">MINUTES</span>
          </div>
        </div>

        {/* 分隔符 */}
        <div className="text-3xl font-bold text-gray-300 mb-6">:</div>

        {/* 秒 */}
        <div className="relative">
          <div className="w-20 h-20 bg-linear-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center text-shadow-lg">
            <span className="text-4xl font-bold text-white">
              {time?.getSeconds().toString().padStart(2, '0')}
            </span>
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-500 font-medium">SECONDS</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 3. props & component composition
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'Sean'
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  style?: React.CSSProperties
  className?: string
}

function Button({ variant = 'primary', children, onClick, disabled = false, type = 'button', style, className }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={style}
    >
      {children}
    </button>
  )
}

function ButtonShowcase() {
  return (
    <div className="w-full max-w-sm">
      <h2 className="text-lg text-gray-900 my-6 text-center">3. ButtonShowcase</h2>
      {/* variant */}
      <h3 className="text-xl font-semibold text-blue-500 my-4">Button Variants</h3>
      <div className="grid grid-cols-4">
        <Button variant="primary" onClick={() => alert('primary')}>
          primary
        </Button>
        <Button disabled variant="secondary" onClick={() => alert('secondary')}>
          secondary
        </Button>
        <Button variant="destructive" onClick={() => alert('destructive')}>
          destructive
        </Button>
        <Button variant="Sean" onClick={() => alert('Sean')}>
          Sean
        </Button>
      </div>
    </div>
  )
}
export function DashBoard() {

  return (
    <div className="w-full max-w-sm">
      {/* 1.Counter */}
      <Counter />

      {/* 2.Clock*/}
      <Clock />

      <ButtonShowcase />
    </div>
  )
}
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

interface User {
  name: string
  email: string
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [randomNumber, setRandomNumber] = useState<number | null>(null)

  const fetchUser = () => {
    setLoading(true)
    setError(null)
    setUser(null)
    setRandomNumber(null)

    setTimeout(() => {
      const random = Math.random()
      setRandomNumber(random)
      console.log('random number:', random)

      random < 0.3 ? setError('failed to load user data') : setUser({ name: 'Jack', email: '123@qq.com' })
      setLoading(false)
    }, 300)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <div className="w-full max-h-svh">
      <h2 className="text-lg text-center text-gray-400 font-bold my-6">4. User Profile</h2>
      <span>Conditional rander</span>

      {loading && (
        <div className="text-center p-8">
          <div className="">Loading user data</div>
        </div>
      )}

      {error && (
        <div className="error">
          <div className="text-red-500">{error}</div>
          {randomNumber && (
            <div className="text-sm text-pink-500">
              Random Number: <strong>{randomNumber.toFixed(3)}</strong>
            </div>
          )}
          <Button onClick={fetchUser} variant="primary">Reset User</Button>
        </div>
      )}

      {user && (
        <div className="user">
          <h3 className="text-lg font-bold">User Profile</h3>
          <div className="text-2xl text-orange-400">name: {user.name}</div>
          <div className="text-2xl text-orange-400">email: {user.email}</div>

          <div className="random">
            {randomNumber && (
              <div className="text-center text-2xl">
                Random Number: <strong>{randomNumber.toFixed(3)}</strong>
                <div className="text-green-500"> (≥ 0.3 = Success)</div>
              </div>
            )}
          </div>

          <Button onClick={fetchUser} variant="secondary">Reset User</Button>
        </div>
      )}
    </div>
  )
}

interface Todo {
  text: string
  completed: boolean
  id: number
}
function TodoList() {

  const [todos, setTodos] = useState<Todo[] | null>([
    { id: 1, text: 'Learn React useState', completed: true },
    { id: 2, text: 'Master useEffect', completed: true },
    { id: 3, text: 'Understand props', completed: false },
    { id: 4, text: 'Practice conditional rendering', completed: false },
    { id: 5, text: 'Build awesome apps', completed: false },
  ])
  const toggle = (id: number) => {
    setTodos(prev => prev ? prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ) : null)
  }
  return (
    <div className="w-full">
      <h2 className="text-lg text-center font-bold text-amber-500 my-6 border-b pb-2">5. TodoList</h2>
      {todos && (
        <ul>
          {todos.map(todo => (
            <div 
              key={todo.id}
              className={`flex items-center justify-between p-3 rounded-xl border ${
                todo.completed 
                  ? 'bg-green-50 border-green-200 opacity-75' 
                  : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              <li className={`flex-1 text-gray-700 ${todo.completed ? 'line-through text-gray-400' : 'font-medium'}`}>
                <span className="mr-2 text-gray-300 font-bold">{todo.id}.</span>
                {todo.text}
              </li>
              <Button 
                onClick={() => toggle(todo.id)} 
                variant={todo.completed ? 'secondary' : 'primary'}
                className="text-xs py-1 px-3"
              >
                {todo.completed ? 'Undo' : 'Done'}
              </Button>
            </div>
          ))}
        </ul>
      )}
    </div>
  )
}
export function DashBoard() {
  return (
    <div className="w-full max-w-sm">
      <Counter />

      <Clock />

      <ButtonShowcase />

      <UserProfile />

      <TodoList />
    </div>
  )
}
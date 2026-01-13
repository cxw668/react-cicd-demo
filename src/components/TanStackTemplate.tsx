import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import { Todo_api } from '../store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
    },
  },
})
/**
 * TanStack Query (React Query) 待办事项管理模板
 * 
 * 基础功能：
 * 1. 异步数据管理：集成 GitHub API 获取仓库信息及 LocalStorage 持久化 Todo 列表。
 * 2. 实时同步：利用共享 Query Key (['todos']) 确保多个组件间数据自动刷新。
 * 3. 状态交互：包含完整的 Todo CRUD 操作、加载状态处理及错误恢复机制。
 * 
 * 性能瓶颈：
 * 1. 存储延迟：依赖同步的 LocalStorage API，在数据量较大时频繁读写可能导致主线程阻塞。
 * 2. 交互反馈：目前采用“先请求后刷新”模式，未实现“乐观更新”，在复杂网络或慢速存储下有明显操作延迟。
 * 3. 缓存粒度：invalidateQueries 会触发数据全量重取，对于高频细微修改（如勾选完成）性能开销较高。
 */
export default function TanStackTemplate() {

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen grid grid-cols-2 gap-20 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className='github-info'>
            <Example />
          </div>
          <div className="todos-list">
            <NewestTodoCard />
            <TodoList />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}

function NewestTodoCard() {
  const { data: todos, isLoading, isFetching, error, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: Todo_api.fetchTodos
  })

  if (isLoading) return (
    <div className="h-32 bg-gray-100 animate-pulse rounded-xl shadow-sm"></div>
  )

  if (isError) return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
      <h3 className="font-bold mb-2">Error loading newest todo</h3>
      <p className="text-sm">{(error as Error).message}</p>
    </div>
  )

  // Sort by createdAt to find the truly newest one
  const newestTodo = Array.isArray(todos) && todos.length > 0
    ? [...todos].sort((a, b) => b.createdAt - a.createdAt)[0]
    : null

  return (
    <div className={`bg-linear-to-br from-indigo-500 to-purple-600 shadow-xl rounded-2xl p-6 text-white transform transition-all hover:scale-[1.02] relative overflow-hidden ${isFetching ? 'ring-2 ring-indigo-300 ring-offset-2' : ''}`}>
      {/* Sync indicator */}
      {isFetching && (
        <div className="absolute top-0 right-0 p-2">
          <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold flex items-center tracking-wide">
          <span className="bg-white/20 p-1.5 rounded-lg mr-2 backdrop-blur-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
          Latest Task
        </h3>
        {newestTodo && (
          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md backdrop-blur-md ${newestTodo.completed ? 'bg-green-400/30 text-green-100' : 'bg-yellow-400/30 text-yellow-100'
            }`}>
            {newestTodo.completed ? 'Done' : 'In Progress'}
          </span>
        )}
      </div>

      {newestTodo ? (
        <div className="space-y-3">
          <p className="text-2xl font-semibold leading-tight drop-shadow-sm">
            {newestTodo.text}
          </p>
          <div className="flex items-center text-indigo-100 text-sm font-medium">
            <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Just added to your list
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-indigo-100 font-medium">Your list is empty.</p>
          <p className="text-xs text-indigo-200 mt-1">Add a task below to see it featured here!</p>
        </div>
      )}
    </div>
  )
}

function Example() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/cxw668/react-cicd-demo').then((res) =>
        res.json(),
      ),
  })

  if (isPending) return (
    <div className="flex justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  )

  if (error) return (
    <div className="p-4 bg-red-50 text-red-700 rounded-lg">
      Error: {error.message}
    </div>
  )

  return (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center space-y-4">
      <div className="user-avatar w-24 h-24 relative">
        <img className="w-full h-full rounded-full border-4 border-blue-100 shadow-sm" src={data.owner.avatar_url} alt={data.owner.login} />
        <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-400 border-2 border-white rounded-full"></div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold text-gray-900">{data.owner.login}</div>
        <div className="text-sm text-gray-500">GitHub ID: {data.owner.id}</div>
      </div>
    </div>
  )
}

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'Sean'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  loading?: boolean
}

function Button({ variant = 'primary', children, onClick, disabled = false, type = 'button', className, loading }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${className || ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  )
}

function TodoList() {
  const [newTodoText, setNewTodoText] = useState('')
  const queryClient = useQueryClient()

  // 1. Fetching data
  const { data: todos, isLoading, isError, error } = useQuery({
    queryKey: ['todos'],
    queryFn: Todo_api.fetchTodos
  })

  // 2. Mutations
  const addMutation = useMutation({
    mutationFn: Todo_api.addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setNewTodoText('')
    }
  })

  const toggleMutation = useMutation({
    mutationFn: Todo_api.toggleTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: Todo_api.deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodoText.trim()) {
      addMutation.mutate(newTodoText.trim())
    }
  }

  if (isError) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
      <h3 className="font-bold mb-2 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Error loading todos
      </h3>
      <p className="text-sm">{(error as Error).message}</p>
      <button
        onClick={() => queryClient.invalidateQueries({ queryKey: ['todos'] })}
        className="mt-4 text-sm font-semibold underline hover:text-red-800"
      >
        Try again
      </button>
    </div>
  )

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </span>
        TanStack TodoList
      </h2>

      {/* Add Todo Form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          disabled={addMutation.isPending}
        />
        <Button
          variant="Sean"
          type="submit"
          loading={addMutation.isPending}
          disabled={!newTodoText.trim()}
        >
          Add
        </Button>
      </form>

      {/* Todo List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <ul className="space-y-3">
            {Array.isArray(todos) && todos.map(todo => (
              <li
                key={todo.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${todo.completed
                  ? 'bg-gray-50 border-gray-100 opacity-60'
                  : 'bg-white border-gray-200 shadow-sm hover:border-blue-200'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleMutation.mutate(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${todo.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-blue-500'
                      }`}
                  >
                    {todo.completed && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span className={`text-gray-700 font-medium ${todo.completed ? 'line-through' : ''}`}>
                    {todo.text}
                  </span>
                </div>
                <Button
                  onClick={() => deleteMutation.mutate(todo.id)}
                  variant="destructive"
                  className="px-2 py-1 text-xs"
                  loading={deleteMutation.isPending && deleteMutation.variables === todo.id}
                >
                  Delete
                </Button>
              </li>
            ))}
            {Array.isArray(todos) && todos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No todos yet. Add one above!
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

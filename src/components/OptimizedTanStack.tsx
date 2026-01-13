import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import { Todo_api, type Todo } from '../store'
import { nanoid } from 'nanoid'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
    },
  },
})

/**
 * Optimized TanStack Query 待办事项管理页面
 * 
 * 优化点：
 * 1. 乐观更新 (Optimistic Updates)：在请求完成前立即更新 UI，提供零延迟交互体验。
 * 2. 错误回滚：如果异步操作失败，自动将 UI 状态回滚到修改前的正确状态。
 * 3. 缓存一致性 (Cache Consistency)：
 *    - 挑战：乐观更新虽然快，但它只是前端的“预测”。如果后端逻辑（如数据库触发器、多端同步）修改了数据，前端预测就会与真实后端数据不一致。
 *    - 解决：在 Mutation 结束时 (onSettled)，调用 invalidateQueries。这会标记缓存为“失效”并触发后台静默重取。
 *    - 意义：它保证了 UI 的最终结果一定是以后端权威数据为准的，实现了“前端预测响应快”与“后端权威数据准”的平衡。
 * 4. 局部状态同步：NewestTodoCard 现在能更敏锐地捕捉到缓存中的临时乐观数据。
 */
export default function OptimizedTanStack() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
            <span className="text-blue-700 font-medium">Performance Optimized Mode</span>
            <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold animate-pulse">Fast</span>
          </div>
          <Example />
          <hr className="border-gray-200" />
          <NewestTodoCard />
          <TodoList />
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
      <h3 className="font-bold mb-2 text-sm">Error loading latest</h3>
      <p className="text-xs">{(error as Error).message}</p>
    </div>
  )

  const newestTodo = Array.isArray(todos) && todos.length > 0 
    ? [...todos].sort((a, b) => b.createdAt - a.createdAt)[0] 
    : null

  return (
    <div className={`bg-linear-to-br from-blue-600 to-indigo-700 shadow-xl rounded-2xl p-6 text-white transform transition-all hover:scale-[1.02] relative overflow-hidden ${isFetching ? 'ring-2 ring-blue-300 ring-offset-2' : ''}`}>
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
          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md backdrop-blur-md ${
            newestTodo.completed ? 'bg-green-400/30 text-green-100' : 'bg-yellow-400/30 text-yellow-100'
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
          <div className="flex items-center text-blue-100 text-sm font-medium">
            <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Optimized UI sync
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-blue-100">
          <p className="font-medium">No tasks found.</p>
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
    <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
      Error: {error.message}
    </div>
  )

  return (
    <div className="bg-white shadow-sm rounded-xl p-4 flex flex-col items-center space-y-3 border border-gray-100">
      <div className="user-avatar w-16 h-16 relative">
        <img className="w-full h-full rounded-full border-2 border-blue-50 shadow-sm" src={data.owner.avatar_url} alt={data.owner.login} />
        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
      </div>
      <div className="text-center">
        <div className="text-md font-bold text-gray-900">{data.owner.login}</div>
        <div className="text-[10px] text-gray-400 font-mono">{data.full_name}</div>
      </div>
    </div>
  )
}

function Button({ variant = 'primary', children, onClick, disabled = false, type = 'button', className, loading }: any) {
  return (
    <button
      className={`btn btn-${variant} ${className || ''} flex items-center justify-center`}
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

  const { data: todos, isLoading, isError, error } = useQuery({
    queryKey: ['todos'],
    queryFn: Todo_api.fetchTodos
  })

  // --- 优化点 1: 乐观更新添加操作 ---
  const addMutation = useMutation({
    mutationFn: Todo_api.addTodo,
    onMutate: async (text) => {
      // 取消正在进行的查询，避免覆盖乐观更新
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      
      // 保存旧数据快照
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])
      
      // 构造乐观数据
      const optimisticTodo: Todo = {
        id: `temp-${nanoid()}`,
        text,
        completed: false,
        createdAt: Date.now()
      }
      
      // 立即更新缓存
      queryClient.setQueryData<Todo[]>(['todos'], (old) => [...(old || []), optimisticTodo])
      
      // 返回上下文对象以供回滚
      return { previousTodos }
    },
    onError: (err, newTodo, context) => {
      // 发生错误时回滚
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
    onSettled: () => {
      // 无论成功还是失败，都使查询失效以同步最终状态。
      // 这是维护缓存一致性的关键：它会强迫 TanStack Query 去后台重新拉取权威的后端数据，
      // 覆盖前端刚才“预测”生成的乐观状态，确保最终显示的 ID 和内容与服务器完全一致。
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onSuccess: () => {
      setNewTodoText('')
    }
  })

  // --- 优化点 2: 乐观更新切换操作 ---
  const toggleMutation = useMutation({
    mutationFn: Todo_api.toggleTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])
      
      queryClient.setQueryData<Todo[]>(['todos'], (old) => 
        old?.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo)
      )
      
      return { previousTodos }
    },
    onError: (err, id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })

  // --- 优化点 3: 乐观更新删除操作 ---
  const deleteMutation = useMutation({
    mutationFn: Todo_api.deleteTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])
      
      queryClient.setQueryData<Todo[]>(['todos'], (old) => 
        old?.filter(todo => todo.id !== id)
      )
      
      return { previousTodos }
    },
    onError: (err, id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
    onSettled: () => {
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
      <h3 className="font-bold mb-2 flex items-center">Error</h3>
      <p className="text-sm">{(error as Error).message}</p>
    </div>
  )

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center">
        <span className="bg-blue-600 text-white p-2 rounded-lg mr-3 shadow-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </span>
        Optimized Todos
      </h2>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Optimistic add..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <Button 
          variant="Sean"
          type="submit" 
          disabled={!newTodoText.trim()}
        >
          Add
        </Button>
      </form>

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-50 animate-pulse rounded-lg"></div>)}
          </div>
        ) : (
          <ul className="space-y-2">
            {todos?.map(todo => (
              <li
                key={todo.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  todo.completed ? 'bg-gray-50/50 border-gray-100 opacity-60' : 'bg-white border-gray-100 shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleMutation.mutate(todo.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      todo.completed ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'
                    }`}
                  >
                    {todo.completed && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                  </button>
                  <span className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {todo.text}
                    {todo.id.toString().startsWith('temp-') && <span className="ml-2 text-[8px] text-blue-400 italic">Saving...</span>}
                  </span>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(todo.id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

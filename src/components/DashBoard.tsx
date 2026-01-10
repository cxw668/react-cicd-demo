import { useEffect, useState, useCallback, useMemo } from "react";

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
    <div className="w-full max-w-sm mx-auto">
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
     

      <div className="flex justify-center items-center">
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
              className={`flex items-center justify-between p-3 rounded-xl border ${todo.completed
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

interface SubmittedFormData {
  id: number; // Unique identifier for each submission
  name: string;
  email: string;
  message: string;
  submittedAt: string; // Timestamp when form was submitted
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedDataList, setSubmittedDataList] = useState<SubmittedFormData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextId, setNextId] = useState(1); // Counter for generating unique IDs

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Show loading state during submission
    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      // Create new submission with unique ID
      const newSubmission: SubmittedFormData = {
        id: nextId,
        ...formData,
        submittedAt: new Date().toLocaleString()
      };

      // Add to the list of submissions (newest first)
      setSubmittedDataList(prev => [newSubmission, ...prev]);
      setNextId(prev => prev + 1);

      // Clear form data and reset states
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setIsSubmitting(false);
    }, 1500);
  }, [formData, nextId]);

  // Delete specific submission by ID
  const handleDeleteSubmission = useCallback((id: number) => {
    setSubmittedDataList(prev => prev.filter(submission => submission.id !== id));
  }, []);

  // Delete all submissions
  const handleDeleteAll = useCallback(() => {
    setSubmittedDataList([]);
  }, []);

  // Calculate submission statistics using useMemo for performance
  const submissionStats = useMemo(() => {
    return {
      total: submittedDataList.length,
      uniqueEmails: new Set(submittedDataList.map(s => s.email)).size,
      avgMessageLength: submittedDataList.length > 0
        ? Math.round(submittedDataList.reduce((sum, s) => sum + s.message.length, 0) / submittedDataList.length)
        : 0
    };
  }, [submittedDataList]);

  return (
    <div className="w-full">
      <h3 className="text-lg text-center text-sky-400 font-bold my-6">
        6. Contact Form
        <span className="pattern-badge">Forms</span>
      </h3>
      <p className="text-sm mb-4 text-sky-400">
        Controlled components with validation and multiple data persistence
      </p>

      {/* Side-by-side layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left side - Form */}
        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>
            📝 Submit Message
          </h4>

          {isSubmitting && (
            <div className="mb-4 p-3 rounded text-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <div className="status-loading">📤 Sending...</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4 border border-blue-200 ">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="input"
                disabled={isSubmitting}
              />
              {errors.name && <div className="error">{errors.name}</div>}
            </div>

            <div className="mb-4 border border-blue-200">
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className="input"
                disabled={isSubmitting}
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>

            <div className="mb-4 border border-blue-200">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                className="textarea"
                disabled={isSubmitting}
              />
              {errors.message && <div className="error">{errors.message}</div>}
            </div>

            <Button variant="Sean" type="submit" disabled={isSubmitting} onClick={()=>{}}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>

        {/* Right side - Submitted Data Display */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              📋 Message History
            </h4>
            {submittedDataList.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleDeleteAll}
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontWeight: '500'
                }}
              >
                🗑️ Clear All
              </Button>
            )}
          </div>

          {/* Modern Statistics Cards */}
          {submittedDataList.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 rounded-xl" style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                  {submissionStats.total}
                </div>
                <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Total Messages
                </div>
              </div>
              <div className="text-center p-3 rounded-xl" style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <div className="text-2xl font-bold" style={{ color: '#10b981' }}>
                  {submissionStats.uniqueEmails}
                </div>
                <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Unique Senders
                </div>
              </div>
              <div className="text-center p-3 rounded-xl" style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
                  {submissionStats.avgMessageLength}
                </div>
                <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Avg Length
                </div>
              </div>
            </div>
          )}

          {submittedDataList.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--muted-foreground) transparent'
            }}>
              {submittedDataList.map((submission, index) => (
                <div
                  key={submission.id}
                  className="group relative p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  {/* Modern message header with gradient badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: index === 0
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {submission.id}
                      </div>
                      {index === 0 && (
                        <div
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            color: '#22c55e',
                            border: '1px solid rgba(34, 197, 94, 0.2)'
                          }}
                        >
                          ✨ Latest
                        </div>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteSubmission(submission.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444'
                      }}
                    >
                      ✕
                    </Button>
                  </div>

                  {/* Enhanced submission data with better typography */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                          👤 SENDER
                        </span>
                      </div>
                      <div
                        className="text-sm font-medium px-3 py-2 rounded-lg"
                        style={{
                          background: 'var(--muted)',
                          color: 'var(--foreground)'
                        }}
                      >
                        {submission.name}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                          📧 EMAIL
                        </span>
                      </div>
                      <div
                        className="text-sm font-mono px-3 py-2 rounded-lg"
                        style={{
                          background: 'var(--muted)',
                          color: 'var(--foreground)',
                          fontSize: '12px'
                        }}
                      >
                        {submission.email}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                          💬 MESSAGE
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            background: 'rgba(99, 102, 241, 0.1)',
                            color: '#6366f1'
                          }}
                        >
                          {submission.message.length} chars
                        </span>
                      </div>
                      <div
                        className="text-sm leading-relaxed px-3 py-2 rounded-lg"
                        style={{
                          background: 'var(--muted)',
                          color: 'var(--foreground)',
                          lineHeight: '1.5'
                        }}
                      >
                        {submission.message}
                      </div>
                    </div>

                    {/* Modern timestamp with icon */}
                    <div
                      className="flex items-center gap-2 pt-3 mt-3"
                      style={{
                        borderTop: '1px solid var(--border)'
                      }}
                    >
                      <span className="text-xs">🕒</span>
                      <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                        {submission.submittedAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 rounded-2xl" style={{
              background: 'linear-gradient(135deg, var(--muted) 0%, rgba(255,255,255,0.1) 100%)',
              border: '2px dashed var(--border)'
            }}>
              {/* Modern empty state */}
              <div className="mb-4">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    border: '2px solid rgba(99, 102, 241, 0.2)'
                  }}
                >
                  <span className="text-2xl">📭</span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                No Messages Yet
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Submit your first message using the form<br />
                to see it beautifully displayed here!
              </p>
              <div
                className="inline-block mt-4 px-4 py-2 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: '#6366f1',
                  border: '1px solid rgba(99, 102, 241, 0.2)'
                }}
              >
                ✨ Ready for your first message
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DashBoard() {
  return (
    <div className="w-full">
      <Counter />

      <Clock />

      <ButtonShowcase />

      <UserProfile />

      <TodoList />

      <ContactForm />
    </div>
  )
}
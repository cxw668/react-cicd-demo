import { useEffect, useState, createContext, useCallback, useContext, useMemo } from "react";
import { useCounterStore, useUserStore } from "../store";
import { useShallow } from "zustand/react/shallow";
import { useNavigate } from "react-router-dom";
import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LanguageIcon from '@mui/icons-material/Language';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { ViewStream } from "@mui/icons-material";
/**
 * @title React base 
 * @description A dashboard component that showcases the use of useState, useEffect, useMemo, useCallback, useContext
 * zustand - useShallow
 * @returns Dashboard component
 */
// 1. useState
/**
 * @title Counter
 * @description A counter component that showcases the use of useState, useEffect, useMemo, useCallback, useContext
 * @returns Counter component
 */
function Counter() {
  /**
   * @title useShallow
   * @description 使用 useShallow 的原因：默认情况下，Zustand 使用严格引用相等（===）来判断状态是否变化。
   * 当我们返回一个“新对象”时，即使内部字段没变，每次都会触发组件重渲染。
   * useShallow 会对返回的对象做浅比较（shallow equal），只有真正变化的字段才会让组件重新渲染，
   * 从而避免不必要的重渲染，提升性能。
   * @param state - Zustand store 的完整状态
   * @returns 组件真正关心的那部分状态（浅比较后）
   */
  const { count, increment, decrement, reset } = useCounterStore(
    useShallow((state) => ({
      count: state.count,
      increment: state.increment,
      decrement: state.decrement,
      reset: state.reset,
    }))
  )
  return (
    <div className="text-blue-500">
      <div className="text-center mb-8">
        <div className="inline-block px-8 py-4 bg-gray-50 rounded-2xl border-2 border-gray-200">
          <span className="text-6xl font-bold text-gray-800">{count}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={decrement}
          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
        >
          −
        </button>

        <button
          onClick={reset}
          className="px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium"
        >
          Reset
        </button>

        <button
          onClick={increment}
          className="px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium"
        >
          +
        </button>
      </div>
    </div>
  )
}

/**
 * @title Clock
 * @description A clock component that showcases the use of useState, useEffect, useMemo, useCallback, useContext
 * @returns Clock component
 */
// 2. useEffect
function Clock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    setTime(new Date())

    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const hours = time?.getHours();
  const minutes = time?.getMinutes();
  const seconds = time?.getSeconds();

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-4">
        {/* 小时 */}
        <div className="relative">
          <div className="w-20 h-20 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-shadow-lg">
            <span className="text-4xl font-bold text-white">
              {hours.toString().padStart(2, '0')}
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
              {minutes.toString().padStart(2, '0')}
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
              {seconds.toString().padStart(2, '0')}
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
/**
 * @title UserProfile
 * @description A component that displays user profile information.
 * @returns UserProfile component
 */

function UserProfile() {
  const { user, loading, error, fetchUser } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      loading: state.loading,
      error: state.error,
      fetchUser: state.fetchUser,
    }))
  );
  const [randomNumber, setRandomNumber] = useState<number | null>(0);

  const handleFetchUser = async () => {
    const random = Math.random();
    setRandomNumber(random);
    await fetchUser();
  };

  useEffect(() => {
    handleFetchUser();
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="text-2xl">👤</span>
        <h2 className="text-xl font-bold text-gray-800">User Profile</h2>
        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full font-semibold uppercase tracking-wider">API Hook</span>
      </div>

      <div className="flex justify-center items-center min-h-[200px] bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        {loading && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-gray-500 font-medium">Loading user data...</div>
          </div>
        )}

        {!loading && !user && error && (
          <div className="flex flex-col items-center gap-4 p-6 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-xl">⚠️</div>
            <div className="text-red-500 font-semibold">{error}</div>
            {randomNumber && (
              <div className="text-sm px-3 py-1 bg-pink-50 text-pink-500 rounded-lg border border-pink-100">
                Roll: <strong>{randomNumber.toFixed(3)}</strong> (Needs ≥ 0.3)
              </div>
            )}
            <Button onClick={handleFetchUser} variant="primary" className="mt-2">
              Try Again
            </Button>
          </div>
        )}

        {!loading && user && (
          <div className="w-full p-6 flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 bg-linear-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{user.name}</div>
              <div className="text-gray-500 font-medium">{user.email}</div>
            </div>

            <div className="w-full py-3 px-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              {randomNumber && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-gray-400 font-medium">Random Check:</span>
                  <span className="font-bold text-gray-700">{randomNumber.toFixed(3)}</span>
                  <span className="text-green-500 text-xs font-bold">✓ Success</span>
                </div>
              )}
            </div>

            <Button onClick={handleFetchUser} variant="secondary" className="w-full sm:w-auto">
              Refresh Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface Todo {
  text: string
  completed: boolean
  id: number
}
/**
 * @title TodoList
 * @description A component that allows users to add, view, and manage a list of todos.
 * @returns TodoList component
 */
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📝</span>
          <h2 className="text-xl font-bold text-gray-800">Todo List</h2>
        </div>
        <span className="px-3 py-1 bg-amber-100 text-amber-600 text-xs rounded-full font-bold uppercase tracking-wide">useState</span>
      </div>

      {todos && (
        <div className="space-y-3">
          {todos.map(todo => (
            <div
              key={todo.id}
              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${todo.completed
                ? 'bg-gray-50 border-gray-100 opacity-60'
                : 'bg-white border-amber-100 shadow-sm hover:shadow-md hover:border-amber-200'
                }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${todo.completed ? 'bg-green-500 border-green-500 text-white' : 'border-amber-200 text-amber-400'
                  }`}>
                  {todo.completed ? '✓' : todo.id}
                </div>
                <li className={`list-none text-sm md:text-base ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700 font-semibold'}`}>
                  {todo.text}
                </li>
              </div>
              <Button
                onClick={() => toggle(todo.id)}
                variant={todo.completed ? 'secondary' : 'primary'}
                className={`text-xs py-1.5 px-4 rounded-full transition-all ${!todo.completed && 'bg-amber-500 hover:bg-amber-600 border-none text-white shadow-sm'
                  }`}
              >
                {todo.completed ? 'Undo' : 'Complete'}
              </Button>
            </div>
          ))}
        </div>
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

            <Button variant="Sean" type="submit" disabled={isSubmitting} onClick={() => { }}>
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
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

function ThemeToggle() {
  const context = useContext(ThemeContext)
  if (!context) return null

  const { theme, toggleTheme } = context

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-emerald-100">
          {theme === 'light' ? '☀️' : '🌙'}
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-800">Theme Engine</h3>
          <p className="text-sm text-gray-500 font-medium">
            Active: <span className="text-emerald-600 uppercase tracking-wider">{theme}</span>
          </p>
        </div>

        <div className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-2">
          <p className="text-xs text-gray-400 leading-relaxed">
            Using <span className="font-bold">useContext</span> + <span className="font-bold">localStorage</span> for global state persistence.
          </p>
        </div>

        <Button
          onClick={toggleTheme}
          variant={theme === 'light' ? 'primary' : 'Sean'}
          className="w-full mt-2 py-6 rounded-2xl font-bold text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {theme === 'light' ? '🌙 Switch to Dark' : '☀️ Switch to Light'}
        </Button>
      </div>
    </div>
  )
}

/**
 * @title NotesWidget
 * @description A widget that allows users to add, view, and manage notes.
 * @returns NotesWidget component
 */
function NotesWidget() {
  const [notes, setNotes] = useState(() => localStorage.getItem('tutorial-notes')?.split(',') || [])
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    localStorage.setItem('tutorial-notes', notes.join(','))
  }, [notes])
  const noteStats = useMemo(() => {
    console.log('📊 Calculating note statistics...'); // You'll only see this when notes change
    return {
      total: notes.length,
      long: notes.filter(note => note.length > 10).length,
      avgLength: notes.length > 0 ? Math.round(notes.reduce((sum, note) => sum + note.length, 0) / notes.length) : 0
    };
  }, [notes]);

  const addNote = useCallback(() => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
    }
  }, [notes, newNote, setNotes]);

  const clearNotes = useCallback(() => {
    setNotes([]);
  }, [setNotes]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl shadow-sm">📚</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">Smart Notes</h3>
            <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest">Custom Hooks Persistence</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 text-center">
            <div className="text-sm font-bold text-gray-700">{noteStats.total}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">Total</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-linear-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-indigo-500">📏</div>
          <div>
            <div className="text-lg font-bold text-indigo-900">{noteStats.avgLength}</div>
            <div className="text-xs text-indigo-400 font-medium">Avg Characters</div>
          </div>
        </div>
        <div className="p-4 bg-linear-to-br from-purple-50 to-white rounded-2xl border border-purple-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-purple-500">📝</div>
          <div>
            <div className="text-lg font-bold text-purple-900">{noteStats.long}</div>
            <div className="text-xs text-purple-400 font-medium">Long Notes (&gt;10)</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
        <div className="flex gap-3 mb-6">
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Type your brilliant idea here..."
            className="flex-1 bg-white border-none rounded-2xl px-5 py-3 shadow-sm focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm font-medium"
            onKeyUp={(e) => e.key === 'Enter' && addNote()}
          />
          <Button
            onClick={addNote}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 font-bold shadow-lg shadow-indigo-100 transition-all"
          >
            Capture
          </Button>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
              <div className="text-4xl grayscale opacity-20">✍️</div>
              <p className="text-sm text-gray-400 font-medium italic">
                Your creative space is empty.<br />Start by adding a note above!
              </p>
            </div>
          ) : (
            notes.map((note, index) => (
              <div
                key={index}
                className="group p-4 bg-white rounded-2xl border border-gray-50 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 bg-indigo-400 rounded-full group-hover:scale-150 transition-transform"></span>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">{note}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {notes.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={clearNotes}
              className="text-xs font-bold text-red-400 hover:text-red-500 hover:underline transition-colors uppercase tracking-widest"
            >
              🗑️ Wipe All Notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TanstackDiv() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm mb-8">
      <div className="flex items-center justify-between">
        <h3 className="text-indigo-900 font-bold flex items-center">
          <span className="mr-2 text-xl">🚀</span>
          TanStack Query Comparison
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/tanstack')}
          className="flex flex-col items-center p-3 bg-white hover:bg-red-50 border border-red-100 rounded-xl transition-all group"
        >
          <span className="text-xs font-bold text-red-400 mb-1 group-hover:scale-110 transition-transform">Standard</span>
          <span className="text-[10px] text-gray-500">Normal Sync</span>
        </button>
        <button
          onClick={() => navigate('/tanstack-optimized')}
          className="flex flex-col items-center p-3 bg-white hover:bg-green-50 border border-green-100 rounded-xl transition-all group shadow-sm hover:shadow-md"
        >
          <span className="text-xs font-bold text-green-500 mb-1 group-hover:scale-110 transition-transform">Optimized</span>
          <span className="text-[10px] text-gray-500">Zero Latency</span>
        </button>
      </div>
    </div>
  )
}

function I18nDiv() {
  const navigate = useNavigate()
  return (
    <div className="w-full max-w-md mx-auto p-2 hover:cursor-pointer hover:bg-indigo-50" onClick={() => navigate('/thanksgiving')} title="I18n - Thanksgiving">
      <h3 className="text-indigo-900 font-bold flex items-center">
        <span className="mr-2 text-xl">🌍</span>
        点击进入i18n - thanksgiving 页面
      </h3>
    </div>
  )
}
/**
 * @title Dashboard
 * @description A dashboard component that showcases the use of useState, useEffect, useMemo, useCallback, useContext
 * @returns Dashboard component
 */
function DashBoard() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    navigate("/login");
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <div className="p-4 bg-linear-to-r from-orange-300 to-pink-400 text-white font-bold text-xl">
        Navigation
      </div>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/')}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/tanstack')}>
            <ListItemIcon>
              <RocketLaunchIcon />
            </ListItemIcon>
            <ListItemText primary="TanStack Standard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/tanstack-optimized')}>
            <ListItemIcon>
              <RocketLaunchIcon sx={{ color: '#10b981' }} />
            </ListItemIcon>
            <ListItemText primary="TanStack Optimized" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/thanksgiving')}>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText primary="I18n Thanksgiving" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/user-form')}>
            <ListItemIcon>
              <SupervisedUserCircleIcon/>
            </ListItemIcon>
            <ListItemText primary="User Form" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/treeView')}>
            <ListItemIcon>
              <ViewStream />
            </ListItemIcon>
            <ListItemText primary="Tree View" />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid #eee' }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider>
      <div className="w-full p-6 space-y-8 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className='header flex flex-col md:flex-row gap-6 w-full'>
          <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={toggleDrawer(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-orange-600 font-bold"
              >
                <MenuIcon />
                <span>Router</span>
              </button>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-500 text-xs rounded-full font-bold">MUI Drawer</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-500 text-xs rounded-full font-bold">React Router</span>
              </div>
            </div>

            <Drawer open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Welcome to Dashboard</h2>
              <p className="text-gray-500">Explore our components and features through the navigation drawer.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <I18nDiv />
                <TanstackDiv />
              </div>
            </div>
          </div>
          <div className="md:w-80 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
            <Counter />
          </div>
        </div>

        {/* Main Section - Clock & Button Showcase */}
        <div className="main bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="main-header max-w-sm mx-auto mb-8">
            <Clock />
          </div>
          <div className="main-content">
            <ButtonShowcase />
          </div>
        </div>

        {/* Grid Section for Content Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Profile Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <UserProfile />
          </div>

          {/* Todo List Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <TodoList />
          </div>
        </div>

        {/* Full Width Contact Form */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <ContactForm />
        </div>

        {/* Bottom Section - Theme & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
          <div className="md:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <ThemeToggle />
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <NotesWidget />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
export default DashBoard
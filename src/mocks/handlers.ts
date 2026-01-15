import { http, HttpResponse } from 'msw'
import { withBase } from '@/utils/path'

let mockUsers = [
  { id: '1', name: 'Alice', email: 'alice@example.com', age: 28, gender: 'female', country: 'USA' },
  { id: '2', name: 'Bob', email: 'bob@example.com', age: 34, gender: 'male', country: 'Canada' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com', age: 22, gender: 'male', country: 'UK' },
  { id: '4', name: 'Diana', email: 'diana@example.com', age: 30, gender: 'female', country: 'Australia' },
  { id: '5', name: 'Ethan', email: 'ethan@example.com', age: 26, gender: 'male', country: 'Germany' },
  { id: '6', name: 'Fiona', email: 'fiona@example.com', age: 29, gender: 'female', country: 'France' },
  { id: '7', name: 'George', email: 'george@example.com', age: 31, gender: 'male', country: 'Japan' },
  { id: '8', name: 'Hannah', email: 'hannah@example.com', age: 25, gender: 'female', country: 'China' },
  { id: '9', name: 'Ian', email: 'ian@example.com', age: 27, gender: 'male', country: 'Brazil' },
  { id: '10', name: 'Julia', email: 'julia@example.com', age: 33, gender: 'female', country: 'India' },
]

export const handlers = [
  /**
   * 获取用户列表接口
   * GET /api/users
   */
  http.get(withBase('/api/users'), () => {
    return HttpResponse.json(mockUsers)
  }),

  /**
   * 新增用户接口
   * POST /api/users
   */
  http.post(withBase('/api/users'), async ({ request }) => {
    const newUser = (await request.json()) as any
    const userWithId = { ...newUser, id: Math.random().toString(36).substr(2, 9) }
    mockUsers.push(userWithId)
    return HttpResponse.json(userWithId, { status: 201 })
  }),

  /**
   * 更新用户接口
   * PUT /api/users/:id
   */
  http.put(withBase('/api/users/:id'), async ({ params, request }) => {
    const { id } = params
    const updatedData = (await request.json()) as any
    mockUsers = mockUsers.map(u => u.id === id ? { ...u, ...updatedData } : u)
    return HttpResponse.json(updatedData)
  }),

  /**
   * 删除用户接口
   * DELETE /api/users/:id
   */
  http.delete(withBase('/api/users/:id'), ({ params }) => {
    const { id } = params
    mockUsers = mockUsers.filter(u => u.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),

  /**
   * 获取当前登录用户信息
   * GET /api/user
   */
  http.get(withBase('/api/user'), () => {
    return HttpResponse.json({
      name: 'MSW Mock User',
      email: 'mock@example.com',
      role: 'admin'
    })
  }),
];
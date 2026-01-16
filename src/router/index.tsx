import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import LoginPage from '../components/LoginPage'
import OauthCallback from '@/components/OauthCallback'

// 懒加载组件
const DashBoard = React.lazy(() => import('../components/DashBoard'))
const ChristmasTemplate = React.lazy(() => import('../components/ChristmasTemplate'))
const ThanksGiving = React.lazy(() => import('../components/ThanksGiving'))
const TanStackTemplate = React.lazy(() => import('../components/TanStackTemplate'))
const OptimizedTanStack = React.lazy(() => import('../components/OptimizedTanStack'))
const UserForm = React.lazy(() => import('../components/UserForm/UserForm'))
const TreeView = React.lazy(() => import('@/components/TreeView'))
const MockPage = React.lazy(() => import('@/components/MockPage'))

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/oauth/callback',
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <OauthCallback/>
      </React.Suspense>
    )
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <DashBoard />
          </React.Suspense>
        ),
      },
      {
        path: 'christmas',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <ChristmasTemplate />
          </React.Suspense>
        ),
      },
      {
        path: 'thanksgiving',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <ThanksGiving />
          </React.Suspense>
        ),
      },
      {
        path: 'tanstack',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <TanStackTemplate />
          </React.Suspense>
        ),
      },
      {
        path: 'tanstack-optimized',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <OptimizedTanStack />
          </React.Suspense>
        ),
      },
      {
        path: 'user-form',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <UserForm />
          </React.Suspense>
        ),
      },
      {
        path: 'treeView',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <TreeView />
          </React.Suspense>
        )
      },
      {
        path: 'mockPage',
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <MockPage />
          </React.Suspense>
        )
      }
    ]
  },
], 
/**
 * 项目在vite配置了baseUrl为 /react-cicd-demo/
 * 所以这里需要配置basename为 /react-cicd-demo/，否则/根路径无法匹配到当前项目
 */
{
  basename: import.meta.env.BASE_URL
})

export default router
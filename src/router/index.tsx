import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import DashBoard from '../components/DashBoard'
import ChristmasTemplate from '../components/ChristmasTemplate'
import ThanksGiving from '../components/ThanksGiving'
import TanStackTemplate from '../components/TanStackTemplate'
import OptimizedTanStack from '../components/OptimizedTanStack'
import UserForm from '../components/UserForm/UserForm'
import TreeView from '@/components/TreeView'
import LoginPage from '../components/LoginPage'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <DashBoard />,
      },
      {
        path: 'christmas',
        element: <ChristmasTemplate />,
      },
      {
        path: 'thanksgiving',
        element: <ThanksGiving />,
      },
      {
        path: 'tanstack',
        element: <TanStackTemplate />,
      },
      {
        path: 'tanstack-optimized',
        element: <OptimizedTanStack />,
      },
      {
        path: 'user-form',
        element: <UserForm />,
      },
      {
        path: 'treeView',
        element: <TreeView />
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

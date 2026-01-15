// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './utils/i18'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { worker } from './mocks/browser'
import { withBase } from './utils/path'
import { ErrorBoundary } from './components/ErrorBoundary'

// if (import.meta.env.DEV) {
//   worker.start({
//     /**
//      * 对请求做「白名单判断」，匹配 github 则放行，其他则警告
//      */
//     onUnhandledRequest: (request) => {
//       const targetGithubUrl = 'https://api.github.com/repos/cxw668/react-cicd-demo';
//       if (request.url === targetGithubUrl) {
//         return 'bypass';
//       }
//       return 'warn'
//     },
//     serviceWorker: {
//       url: withBase('/mockServiceWorker.js')
//     }
//   }).catch((err) => {
//     console.error('[MSW] 启动失败:', err);
//   });
// }

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  </ErrorBoundary>
)

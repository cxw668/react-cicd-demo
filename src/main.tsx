import { createRoot } from 'react-dom/client'
import './index.css'
import './utils/i18'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { worker } from './mocks/browser'
// import { withBase } from './utils/path'
import { ErrorBoundary } from './components/ErrorBoundary'
import { trpc } from './utils/trpc'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { useState } from 'react'

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

function Root() {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: import.meta.env.DEV 
            ? 'http://localhost:3001/trpc' 
            : 'https://cxw668.github.io/react-cicd-demo/trpc',
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <RouterProvider router={router} />
        </LocalizationProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <Root />
  </ErrorBoundary>
)

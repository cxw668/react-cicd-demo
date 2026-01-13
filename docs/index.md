1. zustand:
   - 创建store（create）： 使用`create`函数来创建一个store。
   - 使用`useShallow`优化重新渲染： 当组件只关心`store`中部分状态，且这些状态是对象或数组时，使用`useShallow`可以避免在状态对象内部属性变化时重新渲染，除非引用发生变化。
   - set函数： 在`store`中，`set`函数用于更新状态。它支持函数式更新和直接合并。

2. react-router
   - 使用 `BrowserRouter`时，如果 Vite 配置了 `base`，那么需要在路由配置中设置 `basename`属性。
   - 在根组件中使用 `Outlet`来渲染子路由。
   - 在入口文件中，使用 `RouterProvider`并传入路由配置。

3. i18next
   - 初始化配置：设置回退语言（fallbackLng）、配置命名空间（ns）和默认命名空间。
   - 插件使用：`i18next-http-backend`动态加载翻译文件，`i18next-browser-languagedetector`自动检测语言。
   - React集成：使用 `useTranslation` hook 进行文本翻译和语言切换。

4. @tanstack/react-query (异步状态管理)
   - QueryClient: 负责缓存管理和全局配置。
   - useQuery: 获取数据，自动处理加载中、错误和缓存状态。
   - useMutation: 处理数据的增删改操作及副作用。

5. react-hook-form (表单处理)
   - useForm: 核心 hook，提供 register、handleSubmit 等方法。
   - Controller: 适配第三方 UI 组件库（如 MUI）的受控组件。
   - 验证逻辑：集成模式或内置校验规则。

6. MUI 体系 (@mui/material, icons, lab)
   - ThemeProvider: 全局主题配置与样式覆盖。
   - 核心组件：熟悉常用组件如 Button, Box, Grid, Stack, TextField。
   - X 系列：`@mui/x-date-pickers` (日期选择) 和 `@mui/x-tree-view` (树形结构)。

7. AIA DDS 系列 (@aia-reactjs-dds, assets, styles)
   - 企业规范：遵循 AIA 品牌视觉规范的组件库。
   - 资源引用：集成内部图标 (@aia-dds/icons) 和字体资源。

8. 功能增强组件
   - notistack: 堆栈式通知（Snackbar）管理。
   - react-countup: 数字滚动动画效果。
   - @uiw/react-markdown-preview: Markdown 内容预览渲染。
   - pdfjs-dist: PDF 文件的加载与解析显示。

9. 实用工具库
   - dayjs: 轻量级日期时间处理。
   - bignumber.js: 解决 JavaScript 浮点数计算精度问题。
   - nanoid: 生成短小、唯一、URL 友好的 ID。
   - consola: 优雅且带有类型的控制台日志打印。
   - file-saver: 客户端文件保存与下载。
   - react-copy-to-clipboard-ts: 点击复制到剪贴板功能。

10. 安全与底层钩子
    - jose: JWT 令牌的签名、验证及加密。
    - uidotenv-usehooks: 环境变量相关的自定义 hooks。
    - query-string: 解析和格式化 URL 查询参数。

> `pnpm store prune` 删除缓存 - 提升安装速度

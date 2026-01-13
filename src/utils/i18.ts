// i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

/**
 * i18n 初始化配置
 * 1. 使用 i18next-http-backend 插件：通过 HTTP 请求按需加载翻译文件
 * 2. 使用 i18next-browser-languagedetector 插件：自动检测用户语言偏好
 * 3. 使用 initReactI18next 插件：与 React 集成，提供 t 函数、Trans 组件等
 */
i18n
  .use(Backend)          // 加载远程翻译文件
  .use(LanguageDetector) // 自动检测语言
  .use(initReactI18next) // 注入 React 相关 API
  .init({
    fallbackLng: 'en',    // 当检测不到语言或缺少翻译时回退到英文
    ns: ['common'],      // 声明命名空间，避免默认只加载 translation.json
    defaultNS: 'common', // 未指定 ns 时默认使用 common
    backend: {
      // 翻译文件路径模板，{{lng}} 会被替换为语言代码，{{ns}} 替换为命名空间
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`
    },
    detection: {
      // 语言检测顺序：先查 localStorage，再查 cookie，最后使用浏览器语言
      order: ['localStorage', 'cookie', 'navigator'],
      // 检测成功后缓存到 localStorage 与 cookie，下次优先使用
      caches: ['localStorage', 'cookie']
    }
  })

export default i18n
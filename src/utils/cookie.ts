/**
 * Cookie 管理工具类
 * 提供安全的 Cookie 读写操作，支持过期时间、路径和安全属性设置
 */
export const cookieStore = {
  /**
   * 设置 Cookie
   * @param name Cookie 名称
   * @param value Cookie 值
   * @param days 有效天数 (默认 7 天)
   */
  set(name: string, value: string, days: number = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    
    // 构建 cookie 字符串，包含安全属性
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    
    // 如果是 https 环境，添加 Secure 属性
    if (window.location.protocol === 'https:') {
      cookieString += '; Secure';
    }
    
    document.cookie = cookieString;
  },

  /**
   * 获取 Cookie
   * @param name Cookie 名称
   */
  get(name: string): string | null {
    const nameEQ = encodeURIComponent(name) + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  },

  /**
   * 删除 Cookie
   * @param name Cookie 名称
   */
  remove(name: string) {
    this.set(name, "", -1);
  }
};

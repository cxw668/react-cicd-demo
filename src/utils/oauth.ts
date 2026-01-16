import { withBase } from './path';

/**
 * OAuth2 配置信息
 */
export const OAUTH_CONFIG = {
  github: {
    clientId: 'Ov23lieJ25TYUvOGgsxL',
    authUrl: 'https://github.com/login/oauth/authorize',
    scope: 'read:user user:email',
  },
  gitlab: {
    clientId: 'f25779eaf8e8d6fd955407efebf0d33e04eb90dd61b8e3374b5fc01e0789d709',
    authUrl: 'https://gitlab.com/oauth/authorize',
    scope: 'read_user',
  }
};

/**
 * 生成第三方登录重定向地址
 * @param provider 平台名称
 */
export const getOAuthRedirectUrl = (provider: 'github' | 'gitlab') => {
  const config = OAUTH_CONFIG[provider];
  const redirectUri = window.location.origin + withBase('/oauth/callback');
  const state = Math.random().toString(36).substring(7);
  
  // 存储 state 以防 CSRF 攻击
  localStorage.setItem('oauth_state', state);
  localStorage.setItem('oauth_provider', provider);

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    scope: config.scope,
    state: state,
    response_type: 'code',
  });

  return `${config.authUrl}?${params.toString()}`;
};

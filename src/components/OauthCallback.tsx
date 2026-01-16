import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import { useUserStore } from '../store';
import { cookieStore } from '../utils/cookie';
import { consola } from 'consola';
import { trpc } from '../utils/trpc';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const [status, setStatus] = useState('Verifying authorization...');

  const oauthMutation = trpc.oauthLogin.useMutation({
    onSuccess: (data) => {
      // 3. 存储 Token 并更新用户状态
      cookieStore.set('auth_token', data.token, 7);
      setUser(data.user);

      // 4. 清理状态并跳转
      localStorage.removeItem('oauth_state');
      localStorage.removeItem('oauth_provider');
      
      setStatus('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1000);
    },
    onError: (error) => {
      consola.error('OAuth login error:', error);
      setStatus(`Error: ${error.message}`);
      setTimeout(() => navigate('/login'), 3000);
    }
  });

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const storedState = localStorage.getItem('oauth_state');
    const provider = localStorage.getItem('oauth_provider') as 'github' | 'gitlab';

    // 1. 基础验证
    if (!code || state !== storedState || !provider) {
      consola.error('OAuth verification failed: Invalid state or code');
      setStatus('Authorization failed. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setStatus(`Exchanging code with ${provider}...`);
    
    // 2. 调用后端 tRPC 接口换取 Token
    oauthMutation.mutate({
      code,
      provider
    });
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2, maxWidth: 400, width: '90%' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>{status}</Typography>
        <Typography variant="body2" color="textSecondary">
          Please do not close this window. We are finalizing your secure login.
        </Typography>
      </Paper>
    </Box>
  );
}

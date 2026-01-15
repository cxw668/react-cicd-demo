import { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store";
import { cookieStore } from "../utils/cookie";
import { getOAuthRedirectUrl } from "../utils/oauth";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3001/api/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // 使用统一的 cookieStore 管理 token
      cookieStore.set("auth_token", token, 7);
      setUser(user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    }
  };
  /**
   * GITHUB login verify
   */
  const handleGithubLogin = () => { 
    window.location.href = getOAuthRedirectUrl('github');
  }

  /**
   * GITLAB login verify
   */
  const handleGitlabLogin = () => { 
    window.location.href = getOAuthRedirectUrl('gitlab');
  }
  return (
    <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: '100%' }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Typography variant="body2">You don't want to Register? Prepare Login in Github or GitLab!</Typography>
            <Stack direction='row' gap={1}>
              <Button
                onClick={handleGithubLogin}
                fullWidth
                variant="contained"
                sx={{ fontWeight: 'bold', mt: 3, mb: 2, color: '#4a4a4a', bgcolor: '#eff1f3', '&:hover': { color: '#eff1f3', bgcolor: '#4a4a4a' } }}
              >
                Gihub
              </Button>
              <Button
                onClick={handleGitlabLogin}
                fullWidth
                variant="contained"
                sx={{ fontWeight: 'bold', mt: 3, mb: 2, color: '#4a4a4a', bgcolor: '#fca326', '&:hover': { color: '#fff', bgcolor: '#e24329' } }}
              >
                Gitlab
              </Button>
            </Stack>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

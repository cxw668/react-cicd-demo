import { mockCountriesOptions, useUserFormStore, type UserForm, COUNTRY_TO_NATION, computeUserFields } from '@/store'
import { Button, CircularProgress, Typography, Box, Select, TextField, MenuItem, FormControl, InputLabel, Avatar, IconButton, Card, CardContent, CardActions, Tooltip, Snackbar, Alert, Chip, Stack, Divider } from '@mui/material'
import { StaticDatePicker } from '@mui/x-date-pickers'
import { PhotoCamera, Delete, Security, VerifiedUser, Person, AdminPanelSettings } from '@mui/icons-material'
import { useEffect, useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useShallow } from 'zustand/react/shallow'
import { consola } from 'consola'
import dayjs from 'dayjs'
import { verifyToken } from '@/utils/auth'

export function UserForm4() {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const { users, loading, fetchUsers, addUser, deleteUser, context, setContext } = useUserFormStore(useShallow((state) => ({
    users: state.users,
    loading: state.loading,
    fetchUsers: state.fetchUsers,
    addUser: state.addUser,
    updateUser: state.updateUser,
    deleteUser: state.deleteUser,
    context: state.context,
    setContext: state.setContext
  })))

  // JWT 角色校验逻辑
  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const payload = await verifyToken(token);
          if (payload && payload.role === 'admin') {
            setContext({ role: 'admin' });
            consola.success('JWT 验证成功：当前用户为管理员');
          } else {
            setContext({ role: 'guest' });
            consola.info('JWT 验证：当前用户为普通访客');
          }
        } else {
          setContext({ role: 'guest' });
        }
      } catch (err) {
        consola.error('Token 验证过程发生异常:', err);
        setContext({ role: 'guest' });
      }
    };
    validateToken()
  }, [setContext]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers().catch(err => {
        setSnackbar({ open: true, message: `加载用户列表失败: ${err.message}`, severity: 'error' });
      })
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchUsers])

  const { handleSubmit, control, reset, watch } = useForm<UserForm>({
    defaultValues: {
      name: '',
      email: '',
      age: 20,
      gender: 'male',
      country: 'USA',
      birthdate: dayjs().format('YYYY-MM-DD')
    },
    mode: "onChange",
  })

  // 监听表单值以进行实时联动计算
  const formValues = watch();
  const computed = useMemo(() => computeUserFields(formValues), [formValues]);

  const onSubmit = async (data: UserForm) => {
    try {
      await addUser(data)
      reset() // 提交后重置表单
      setSnackbar({ open: true, message: 'successed! Add User', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: '用户添加失败', severity: 'error' });
    }
  }

  return (
    <Box className="flex gap-10 w-screen" sx={{ p: 3 }}>
      <Box sx={{ flex: 1, maxWidth: '450px' }}>
        <Card variant="outlined" sx={{ mb: 3, bgcolor: '#f8f9fa' }}>
          <CardContent sx={{ py: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Current Mode: <Chip component='span' size="small" label={context.mode} color="primary" variant="outlined" />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Role: <Chip
                  component='span'
                  size="small"
                  icon={context.role === 'admin' ? <AdminPanelSettings /> : <Person />}
                  label={context.role}
                  color={context.role === 'admin' ? 'secondary' : 'default'}
                />
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => <TextField required {...field} label="Name" variant="outlined" size="small" />}
          />
          <Controller
            name="email"
            control={control}
            rules={{ required: 'Email is required' }}
            render={({ field }) => <TextField required {...field} label="Email" variant="outlined" size="small" />}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="age"
              control={control}
              render={({ field }) => <TextField required {...field} label="Age" variant="outlined" size="small" type="number" sx={{ flex: 1 }} />}
            />
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormControl variant="outlined" size="small" sx={{ flex: 1 }}>
                  <InputLabel>Gender</InputLabel>
                  <Select {...field} label="Gender">
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <FormControl variant="outlined" size="small" sx={{ flex: 1 }}>
                  <InputLabel>Country</InputLabel>
                  <Select {...field} label="Country">
                    {mockCountriesOptions.map((country) => (
                      <MenuItem key={country} value={country}>{country}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <TextField value={computed.nation} disabled label="Nation (Derived)" variant="outlined" size="small" sx={{ flex: 1, bgcolor: '#f0f0f0' }} />
          </Box>

          {/* 业务联动状态显示区 */}
          <Card variant="outlined" sx={{ borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.02)' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                Business Logic Checks:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {computed.isMinor && (
                  <Chip size="small" label="Minor User" color="warning" variant="filled" />
                )}
                <Chip
                  size="small"
                  icon={computed.requiresApproval ? <Security fontSize="small" /> : <VerifiedUser fontSize="small" />}
                  label={computed.requiresApproval ? "Needs Approval" : "Auto Approved"}
                  color={computed.requiresApproval ? "error" : "success"}
                />
                {computed.backgroundCheckRequired && (
                  <Chip size="small" label="Background Check Required" color="info" variant="outlined" />
                )}
              </Stack>
            </CardContent>
          </Card>

          <Controller
            name="birthdate"
            control={control}
            render={({ field }) => (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 'fold' }}>Birthdate:</Typography>
                <StaticDatePicker
                  {...field}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) => {
                    field.onChange(newValue ? dayjs(newValue).format('YYYY-MM-DD') : '');
                  }}
                  slotProps={{
                    actionBar: {
                      actions: ['today', 'clear'],
                    },
                  }}
                />
              </Box>
            )}
          />
          <Controller
            name='avatar'
            control={control}
            render={({ field: { onChange, value } }) => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Avatar:</Typography>
                <Box sx={{ position: 'relative' }}>
                  <IconButton color="primary" component="label" sx={{ p: 0 }}>
                    <input hidden accept="image/*" type="file" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => onChange(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                    <Avatar src={value} sx={{ width: 64, height: 64, border: '1px solid #ddd' }}>
                      {!value && <PhotoCamera />}
                    </Avatar>
                  </IconButton>
                  {value && (
                    <IconButton onClick={() => onChange('')} sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'background.paper', boxShadow: 2, '&:hover': { bgcolor: '#ff1744', color: 'white' } }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            )}
          />

          <Button variant="contained" type="submit" disabled={loading} size="large" sx={{ mt: 2 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create User'}
          </Button>
        </form>
      </Box>

      <Divider orientation="vertical" flexItem />

      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>User List ({users.length})</Typography>
        {loading && users.length === 0 ? (
          <CircularProgress />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pr: 1 }}>
            {users.map((user) => (
              <Card key={user.id} variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 1, position: 'relative' }}>
                <Avatar src={user.avatar} sx={{ width: 50, height: 50, mr: 2 }}>
                  {!user.avatar && user.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">{user.email}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.age} yrs | {user.country} | {COUNTRY_TO_NATION[user.country as keyof typeof COUNTRY_TO_NATION]}
                  </Typography>
                </Box>
                <CardActions sx={{ position: 'absolute', right: 0 }}>
                  <Tooltip title="Delete User">
                    <IconButton color="error" onClick={() => deleteUser(user.id)} size="small">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  )
}
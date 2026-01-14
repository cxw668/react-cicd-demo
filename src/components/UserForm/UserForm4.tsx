import { mockCountriesOptions, mockNationsOptions, useUserFormStore, type UserForm } from '@/store'
import { Button, CircularProgress, Typography, Box, Select, TextField, MenuItem, FormControl, InputLabel, Avatar, IconButton, Card, CardContent, CardActions, Tooltip, Snackbar, Alert } from '@mui/material'
import { StaticDatePicker } from '@mui/x-date-pickers'
import { PhotoCamera, Delete } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useShallow } from 'zustand/react/shallow'
import { consola } from 'consola'
import dayjs from 'dayjs'
export function UserForm4() {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const { users, loading, fetchUsers, addUser, deleteUser } = useUserFormStore(useShallow((state) => ({
    users: state.users,
    loading: state.loading,
    fetchUsers: state.fetchUsers,
    addUser: state.addUser,
    updateUser: state.updateUser,
    deleteUser: state.deleteUser,
  })))

  let CountriesOptions = []
  let NationsOptions = []

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
      CountriesOptions = mockCountriesOptions;
      NationsOptions = mockNationsOptions;
      consola.log(CountriesOptions)
      consola.info('国家选项数据：', CountriesOptions);
      consola.info('民族选项数据：', NationsOptions);
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchUsers, mockCountriesOptions, mockNationsOptions])

  const { handleSubmit, control, reset } = useForm<UserForm>({
    defaultValues: {
      name: '',
      email: '',
      age: 20,
      gender: 'male',
      countries: 'USA',
      nations: 'American',
      birthdate: dayjs().format('YYYY-MM-DD')
    },
    mode: "onChange",
  })

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
      <Box >
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', marginBottom: '20px' }}>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => <TextField required {...field} label="Name" variant="standard" />}
          />
          <Controller
            name="email"
            control={control}
            rules={{ required: 'Email is required' }}
            render={({ field }) => <TextField required {...field} label="Email" variant="standard" />}
          />
          <Controller
            name="age"
            control={control}
            render={({ field }) => <TextField required {...field} label="Age" variant="standard" type="number" />}
          />
          <Controller
            name="countries"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Countries</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={field.value}
                  label="Countries"
                  onChange={field.onChange}
                >
                  <MenuItem value="USA">United States</MenuItem>
                  <MenuItem value="Canada">Canada</MenuItem>
                  <MenuItem value="UK">United Kingdom</MenuItem>
                  <MenuItem value="Australia">Australia</MenuItem>
                  <MenuItem value="Germany">Germany</MenuItem>
                  <MenuItem value="France">France</MenuItem>
                  <MenuItem value="Japan">Japan</MenuItem>
                  <MenuItem value="China">China</MenuItem>
                  <MenuItem value="Brazil">Brazil</MenuItem>
                  <MenuItem value="India">India</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="nations"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Nations</InputLabel>
                <Select {...field} native label="Nations">
                  <option value="American">American</option>
                  <option value="Canadian">Canadian</option>
                  <option value="British">British</option>
                  <option value="Australian">Australian</option>
                  <option value="German">German</option>
                  <option value="French">French</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Brazilian">Brazilian</option>
                  <option value="Indian">Indian</option>
                </Select>
              </FormControl>

            )}
          />
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select {...field} native label="Gender">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="birthdate"
            control={control}
            render={({ field }) => (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                <Typography sx={{ fontWeight: 'bold' }}>Birthdate:</Typography>
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
                <Typography sx={{ fontWeight: 'bold' }}>Avatar:</Typography>
                <Box sx={{ position: 'relative' }}>
                  <IconButton color="primary" aria-label="upload picture" component="label" sx={{ p: 0 }}>
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            onChange(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Avatar
                      src={value}
                      sx={{ width: 64, height: 64, cursor: 'pointer', border: '1px solid #ddd' }}
                    >
                      {!value && <PhotoCamera />}
                    </Avatar>
                  </IconButton>
                  {value && (
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onChange('');
                      }}
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': { bgcolor: '#ff1744', color: 'white' },
                        zIndex: 1
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            )}
          />
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Add User'}
          </Button>
        </form>
      </Box>
      <Box>
        {loading && users.length === 0 ? (
          <CircularProgress />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '500px', overflowY: 'auto', p: 1 }}>
            {users.map((user) => (
              <Card key={user.id} variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 1, overflow: 'visible' }} className='h-20'>
                <Avatar src={user.avatar} sx={{ width: 56, height: 56, mr: 2 }}>
                  {!user.avatar && user.name.charAt(0)}
                </Avatar>
                <CardContent sx={{ flex: '1 0 auto', p: '8px !important' }}>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Age: {user.age} | {user.countries}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Tooltip title="删除用户" arrow>
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { useUserStore, useTasksDataStore, type DailyTask } from "./store";
import { verifyToken } from "./utils/auth";
import { consola } from "consola";
import { cookieStore } from "./utils/cookie";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Chip,
  Menu,
  MenuItem,
  Button,
  TextField,
  Stack
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReactMarkdown from "react-markdown";

function Header() {
  const { tasks, fetchTasks, loading, addTask } = useTasksDataStore();
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({ title: '', description: '', note: '' });
  
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenAddDialog = () => {
    setNewTaskData({ title: '', description: '', note: '' });
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const handleAddTask = async () => {
    if (!newTaskData.title.trim()) return;
    await addTask(newTaskData);
    handleCloseAddDialog();
  };
  
  const handleOpenTask = (task: DailyTask) => {
    setSelectedTask(task);
    handleCloseMenu();
  };

  const handleCloseTask = () => {
    setSelectedTask(null);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon color="primary" />
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Daily Tasks
          </Typography>
          <Chip label="Current Tasks" size="small" color="primary" variant="outlined" sx={{ ml: 1 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <Button
            onClick={handleOpenAddDialog}
            size="medium"
            disabled={loading}
            title="click me to add task!"
            sx={{
              color: '#4a4a4a',
              fontWeight: 700,
              border: '1px solid',
              '&:hover': {
                backgroundColor: '#49709a',
                color: '#fff'
              }
            }}
          >
            Add Task
          </Button>
          <Button
            id="task-menu-button"
            aria-controls={openMenu ? 'task-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
            variant="outlined"
            onClick={handleOpenMenu}
            endIcon={<ExpandMoreIcon />}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Quick Select
          </Button>
          <Menu
            id="task-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            MenuListProps={{
              'aria-labelledby': 'task-menu-button',
            }}
            PaperProps={{
              sx: { borderRadius: 2, mt: 1, minWidth: 180 }
            }}
          >
            {tasks.map((task) => (
              <MenuItem key={task.id} onClick={() => handleOpenTask(task)}>
                <Typography variant="body2">{task.title}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
      
      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  borderColor: 'primary.light'
                },
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3
              }}
              onClick={() => handleOpenTask(task)}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {task.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {task.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={isAddDialogOpen}
        onClose={handleCloseAddDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Task</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={newTaskData.title}
              onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
              placeholder="Task Title"
              variant="outlined"
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={newTaskData.description}
              onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
              placeholder="Brief description of the task"
            />
            <TextField
              label="Note (Markdown Supported)"
              fullWidth
              multiline
              rows={6}
              value={newTaskData.note}
              onChange={(e) => setNewTaskData({ ...newTaskData, note: e.target.value })}
              placeholder="Detailed notes using Markdown syntax..."
              helperText="You can use Markdown here (e.g., # Header, - list, [x] checkbox)"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={handleCloseAddDialog} color="inherit">Cancel</Button>
          <Button 
            onClick={handleAddTask} 
            variant="contained" 
            disabled={!newTaskData.title.trim() || loading}
          >
            {loading ? 'Adding...' : 'Add Task'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(selectedTask)}
        onClose={handleCloseTask}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, p: 1 }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            {selectedTask?.title}
          </Typography>
          <IconButton onClick={handleCloseTask} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Box className="markdown-content prose max-w-none">
            {selectedTask && (
              <ReactMarkdown>{selectedTask.note}</ReactMarkdown>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
function App() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const checkAuth = async () => {
      const token = cookieStore.get("auth_token") || localStorage.getItem('auth_token');
      
      if (!token) {
        consola.info("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      const payload = await verifyToken(token);
      if (!payload) {
        consola.error("Invalid token, cleaning up and redirecting to login");
        cookieStore.remove("auth_token");
        localStorage.removeItem("auth_token");
        navigate("/login");
      } else {
        consola.success("User verified via jose");
        setUser(payload as any);
        
        // 如果是从 localStorage 恢复的且 cookie 没有，同步回 cookie 保持一致
        if (!cookieStore.get("auth_token")) {
          cookieStore.set("auth_token", token, 7);
        }
      }
    };

    checkAuth();
  }, [navigate, setUser]);

  return (
    <div className="w-full">
      <div className='header'>
        <Header />
      </div>
      <Outlet />
      <div className='footer'>

      </div>
    </div>
  )
}

export default App

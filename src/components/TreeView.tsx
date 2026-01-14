import React, { useState, useMemo } from 'react';
import {
  RichTreeView,
  TreeItem,
} from '@mui/x-tree-view';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Search,
} from '@mui/icons-material';

interface TreeItem {
  id: string;
  label: string;
  children?: TreeItem[];
}
const mockTreeItems = [
  {
    id: '1',
    label: '项目根目录',
    children: [
      {
        id: '2',
        label: '前端开发',
        children: [
          { id: '3', label: 'React 组件' },
          { id: '4', label: '样式文件' },
        ],
      },
      {
        id: '5',
        label: '后端开发',
        children: [
          { id: '6', label: 'API 接口' },
          { id: '7', label: '数据库设计' },
        ],
      },
    ],
  },
]
export default function TreeView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, _setItems] = useState<TreeItem[]>(mockTreeItems);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;

    const filterItems = (items: TreeItem[]): TreeItem[] => {
      return items.filter(item => {
        const matches = item.label.toLowerCase().includes(searchTerm.toLowerCase());
        if (item.children) {
          const filteredChildren = filterItems(item.children);
          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }
          return matches;
        }
        return matches;
      });
    };

    return filterItems(items);
  }, [items, searchTerm]);

  const handleAddItem = (parentId: string) => {
    const newItem: TreeItem = {
      id: `item-${Date.now()}`,
      label: '新项目',
    };

    // 实现添加逻辑
    console.log('添加项目到:', parentId, newItem);
  };

  const handleDeleteItem = (itemId: string) => {
    // 实现删除逻辑
    console.log('删除项目:', itemId);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        项目管理器
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <TextField
          placeholder="搜索项目..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <Search color="action" />,
          }}
          sx={{ flex: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleAddItem('root')}
        >
          添加
        </Button>
      </Box>

      <RichTreeView
        items={filteredItems}
        slots={{ item: TreeItem }}
        sx={{ height: 400, border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}
        slotProps={{
          item: {
            slots: {
              label: ({ children, itemId }: any) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <Typography sx={{ flex: 1 }}>{children}</Typography>
                  <IconButton size="small" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(itemId);
                  }}>
                    <Delete fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={(e) => {
                    e.stopPropagation();
                    console.log('Edit item:', itemId);
                  }}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <Chip label="项目" size="small" variant="outlined" />
                </Box>
              ),
            },
          } as any,
        }}
      />
    </Paper>
  );
}
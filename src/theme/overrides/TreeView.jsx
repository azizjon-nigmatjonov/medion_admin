import { Icon } from '@iconify/react';
import { Box } from '@mui/system';

// ----------------------------------------------------------------------

const ICON_SIZE = { width: 20, height: 20 };

export default function TreeView(theme) {
  return {
    MuiTreeView: {
      defaultProps: {
      }
    },
    MuiTreeItem: {
      styleOverrides: {
        label: { ...theme.typography.body2 },
        iconContainer: { width: 'auto' }
      }
    }
  };
}

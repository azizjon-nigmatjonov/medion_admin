import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

const ICON_MEDIUM = { width: 24, height: 24 };
const ICON_SMALL = { width: 20, height: 20 };

export default function Checkbox(theme) {
  return {
    MuiCheckbox: {
      defaultProps: {},

      styleOverrides: {
        root: {
          padding: theme.spacing(1),
          '& svg[font-size="small"]': { ...ICON_SMALL },
          '&.Mui-checked.Mui-disabled, &.Mui-disabled': {
            color: theme.palette.action.disabled
          }
        }
      }
    }
  };
}

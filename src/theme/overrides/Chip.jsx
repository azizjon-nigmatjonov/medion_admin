import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

export default function Chip(theme) {
  return {
    MuiChip: {
      defaultProps: {
       
      },

      styleOverrides: {
        label: {
          marginTop: -4
        },
        colorDefault: {
          '& .MuiChip-avatarMedium, .MuiChip-avatarSmall': {
            color: theme.palette.text.secondary
          }
        },
        outlined: {
          borderColor: theme.palette.grey[500_32],
          '&.MuiChip-colorPrimary': {
            borderColor: theme.palette.primary.main
          }
        }
      }
    }
  };
}

// src/theme.js
import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF1493', // Deep Pink
      light: '#FF69B4', // A lighter shade of pink
      dark: '#C71585',
    },
    secondary: {
      main: '#606060',
      light: '#909090',
      dark: '#404040',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 20,
        },
      },
    },
  },
});
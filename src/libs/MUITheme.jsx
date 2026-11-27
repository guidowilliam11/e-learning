import { createTheme } from '@mui/material'

const MUITheme = createTheme({
  palette: {
    primary: {
      main: '#F99B26',
      dark: '#943500',
    },
    secondary: {
      main: '#4F55DA',
      dark: '#383e95',
      light: '#E5E7FB',
    },
  },
  typography: {
    fontFamily: 'Inter',
    allVariants: {
      fontFamily: 'Inter',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          body: {
            fontFamily: 'Inter',
          },
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        color: 'secondary',
      },
    },
    MuiButton: {
      defaultProps: {
        color: 'secondary',
      },
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
          border: 'none',
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover fieldset': {
              borderColor: '#A1A1AA',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4F55DA',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#4F55DA',
          },
          '& .MuiInputBase-root': {
            fontSize: '0.925rem',
            fontFamily: 'Inter',
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.925rem',
            fontFamily: 'Inter',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          fontFamily: 'Inter',
        },
      },
    },
  },
})

export default MUITheme

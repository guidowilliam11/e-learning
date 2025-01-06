import { createTheme } from '@mui/material'

const MUITheme = createTheme({
  palette: {
    primary: {
      main: '#F99B26',
      dark: '#943500',
    },
    secondary: {
      main: '#545EE1',
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
              borderColor: '#F2994A',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#F2994A',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#F2994A',
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

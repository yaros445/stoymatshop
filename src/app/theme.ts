import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: { main: '#e67535', dark: '#cb5f24', contrastText: '#fff' },
    secondary: { main: '#192630' },
    success: { main: '#3e8b69' },
    text: { primary: '#202a32', secondary: '#78838b' },
    background: { default: '#fff', paper: '#fff' },
  },
  typography: {
    fontFamily: "'Manrope', 'Arial', sans-serif",
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
  },
})

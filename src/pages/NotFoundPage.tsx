import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <Box className="container not-found-page" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>Страница не найдена</Typography>
      <Typography color="text.secondary">Возможно, адрес изменился или страница была удалена.</Typography>
      <Button component={Link} to="/catalog" variant="contained">Перейти в каталог</Button>
    </Box>
  )
}

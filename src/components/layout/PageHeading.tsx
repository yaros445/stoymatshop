import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface PageHeadingProps {
  eyebrow: string
  title: string
  description: string
}

export function PageHeading({ eyebrow, title, description }: PageHeadingProps) {
  return (
    <Box className="container page-heading" sx={{ py: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'flex-end' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography className="eyebrow" component="span">{eyebrow}</Typography>
          <Typography component="h1" variant="h4" sx={{ mt: 1, fontWeight: 800 }}>
            {title}
          </Typography>
        </Box>
        <Typography color="text.secondary" sx={{ maxWidth: 420, fontSize: 13, lineHeight: 1.8 }}>
          {description}
        </Typography>
      </Box>
    </Box>
  )
}

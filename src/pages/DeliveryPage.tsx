import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { PageHeading } from '../components/layout/PageHeading.tsx'

const deliveryDetails = [
  {
    title: 'Доставка',
    text: 'По Минску — обычно на следующий день. Для регионов согласуем дату и стоимость при подтверждении заказа.',
  },
  {
    title: 'Стоимость',
    text: 'Доставка от 300 BYN по Минску бесплатна. Стоимость за пределами города зависит от адреса и состава заказа.',
  },
  {
    title: 'Оплата',
    text: 'Наличными или картой при получении. Для юридических лиц доступен безналичный расчёт.',
  },
  {
    title: 'Связаться с нами',
    text: 'Уточнить детали можно по телефону +375 (17) 309-09-09 ежедневно с 8:00 до 20:00.',
  },
]

export function DeliveryPage() {
  return (
    <>
      <PageHeading
        eyebrow="ПОКУПКА БЕЗ ЛИШНИХ ХЛОПОТ"
        title="Доставка и оплата"
        description="Доставляем стройматериалы по Минску и всей Беларуси. Менеджер подтвердит наличие, стоимость доставки и удобное время."
      />
      <Box
        className="container delivery-grid"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2,
          pb: 7,
        }}
      >
        {deliveryDetails.map((detail) => (
          <Box key={detail.title} id={detail.title === 'Связаться с нами' ? 'contacts' : undefined}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: 0 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 1, fontWeight: 750 }}>
                  {detail.title}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: 13, lineHeight: 1.8 }}>
                  {detail.title === 'Связаться с нами'
                    ? <>Уточнить детали можно по телефону <a href="tel:+375173090909">+375 (17) 309-09-09</a> ежедневно с 8:00 до 20:00.</>
                    : detail.text}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </>
  )
}

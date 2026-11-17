import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import { Icon } from '../ui/Icon.tsx'
import type { Category } from '../../types.ts'

interface CategorySectionProps {
  categories: Category[]
  onShowAll: () => void
  onSelectCategory: (categoryId: string) => void
}

export function CategorySection({ categories, onShowAll, onSelectCategory }: CategorySectionProps) {
  return (
    <section className="categories-section section-space" id="categories">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ВЫБИРАЙТЕ СВОЁ</span>
            <h2>Категории товаров</h2>
          </div>
          <Button className="text-link" variant="text" onClick={onShowAll}>
            Все категории <Icon name="arrow" size={17} />
          </Button>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <ButtonBase
              className="category-tile"
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              sx={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
            >
              <span className={`category-icon category-tone-${index % 5}`}>
                <Icon name={category.icon} size={25} />
              </span>
              <span className="category-label">
                <strong>{category.title}</strong>
                <small>{category.count}</small>
              </span>
              <Icon className="category-arrow" name="arrow" size={16} />
            </ButtonBase>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Icon } from '../ui/Icon.jsx'

export function CategorySection({ categories, onShowAll, onSelectCategory }) {
  return (
    <section className="categories-section section-space" id="categories">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ВЫБИРАЙТЕ СВОЁ</span>
            <h2>Категории товаров</h2>
          </div>
          <button className="text-link" type="button" onClick={onShowAll}>
            Все категории <Icon name="arrow" size={17} />
          </button>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <button
              className="category-tile"
              type="button"
              key={category.title}
              onClick={() => onSelectCategory(category.title)}
            >
              <span className={`category-icon category-tone-${index % 5}`}>
                <Icon name={category.icon} size={25} />
              </span>
              <span className="category-label">
                <strong>{category.title}</strong>
                <small>{category.count}</small>
              </span>
              <Icon className="category-arrow" name="arrow" size={16} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

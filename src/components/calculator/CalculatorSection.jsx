import { useState } from 'react'
import { calculatePlaster } from '../../utils/storefront.js'
import { Icon } from '../ui/Icon.jsx'

export function CalculatorSection({ onChooseMaterials }) {
  const [width, setWidth] = useState(6)
  const [height, setHeight] = useState(2.7)
  const { area, bags } = calculatePlaster(width, height)

  function updateDimension(setDimension, value) {
    setDimension(Math.max(0, Number(value) || 0))
  }

  return (
    <section className="calculator-section section-space" id="calculator">
      <div className="container calculator-layout">
        <div className="calculator-copy">
          <span className="eyebrow">МЕНЬШЕ ОСТАТКОВ — БОЛЬШЕ ПОЛЬЗЫ</span>
          <h2>
            Рассчитайте
            <br />
            материалы за минуту
          </h2>
          <p>
            Укажите размеры стены, а мы подскажем, сколько сухой смеси понадобится для работы.
          </p>
          <div className="calculator-note">
            <span><Icon name="check" size={16} /></span> Расчёт с запасом на неровности и расход
          </div>
          <div className="calculator-note">
            <span><Icon name="check" size={16} /></span> Подберём подходящие товары из каталога
          </div>
        </div>
        <div className="calculator-panel">
          <div className="calculator-panel-title">
            <span className="calculator-icon"><Icon name="calculator" size={21} /></span>
            <div>
              <strong>Штукатурка стен</strong>
              <small>Расход смеси: 8,5 кг / м² при слое 5 мм</small>
            </div>
          </div>
          <div className="measure-fields">
            <label>
              Ширина стены, м
              <input
                type="number"
                min="0"
                step="0.1"
                value={width}
                onChange={(event) => updateDimension(setWidth, event.target.value)}
              />
            </label>
            <span>×</span>
            <label>
              Высота стены, м
              <input
                type="number"
                min="0"
                step="0.1"
                value={height}
                onChange={(event) => updateDimension(setHeight, event.target.value)}
              />
            </label>
          </div>
          <div className="calculation-result">
            <div>
              <small>Площадь стены</small>
              <strong>{area.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} м²</strong>
            </div>
            <div>
              <small>Штукатурка по 30 кг</small>
              <strong>{bags} <span>мешков</span></strong>
            </div>
          </div>
          <a
            className="button button-primary calculator-button"
            href="#catalog"
            onClick={onChooseMaterials}
          >
            Подобрать материалы <Icon name="arrow" size={17} />
          </a>
          <small className="calculator-disclaimer">
            Ориентировочный расчёт. Точный расход зависит от состояния поверхности.
          </small>
        </div>
      </div>
    </section>
  )
}

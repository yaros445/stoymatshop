import { useMemo, useState } from 'react'
import './App.css'

const categories = [
  { title: 'Сухие смеси', icon: 'mix', count: '124 товара' },
  { title: 'Кирпич и блоки', icon: 'brick', count: '86 товаров' },
  { title: 'Пиломатериалы', icon: 'wood', count: '58 товаров' },
  { title: 'Кровля', icon: 'roof', count: '73 товара' },
  { title: 'Изоляция', icon: 'insulation', count: '91 товар' },
  { title: 'Плитка', icon: 'tile', count: '112 товаров' },
  { title: 'Сантехника', icon: 'water', count: '64 товара' },
  { title: 'Электрика', icon: 'bolt', count: '105 товаров' },
  { title: 'Инструмент', icon: 'tool', count: '148 товаров' },
  { title: 'Крепёж', icon: 'fastener', count: '230 товаров' },
]

const products = [
  { id: 1, title: 'Штукатурка гипсовая, 30 кг', category: 'Сухие смеси', brand: 'СТАРАТЕЛИ', price: 18.9, oldPrice: 22.4, rating: '4.9', reviews: 128, image: 'photo-1581092160562-40aa08e78837', badge: 'Хит продаж' },
  { id: 2, title: 'Кирпич керамический полнотелый', category: 'Кирпич и блоки', brand: 'КЕРАМИН', price: 1.48, oldPrice: 1.72, rating: '4.8', reviews: 86, image: 'photo-1504307651254-35680f356dfd', badge: 'Выгодная цена' },
  { id: 3, title: 'Утеплитель минеральный, 50 мм', category: 'Изоляция', brand: 'ISOVER', price: 34.6, oldPrice: 39.9, rating: '4.9', reviews: 64, image: 'photo-1621905251918-48416bd8575a', badge: 'Хит продаж' },
  { id: 4, title: 'Доска обрезная 25 × 150 × 6000', category: 'Пиломатериалы', brand: 'ЛЕСНОЙ ДОМ', price: 12.8, oldPrice: 15.5, rating: '4.7', reviews: 42, image: 'photo-1600607687939-ce8a6c25118c', badge: 'Новинка' },
  { id: 5, title: 'Краска интерьерная белая, 9 л', category: 'Сухие смеси', brand: 'TIKKURILA', price: 68.5, oldPrice: 79.0, rating: '4.9', reviews: 173, image: 'photo-1562259949-e8e7689d7828', badge: 'Новинка' },
  { id: 6, title: 'Керамогранит «Бетон», 60 × 60 см', category: 'Плитка', brand: 'КЕРАМИН', price: 42.0, oldPrice: 49.5, rating: '4.8', reviews: 57, image: 'photo-1600607687920-4e2a09cf159d', badge: 'Хит продаж' },
  { id: 7, title: 'Шуруповёрт аккумуляторный, 18 В', category: 'Инструмент', brand: 'DEWALT', price: 289.0, oldPrice: 329.0, rating: '5.0', reviews: 39, image: 'photo-1504148455328-c376907d081c', badge: 'Новинка' },
  { id: 8, title: 'Металлочерепица, модульная', category: 'Кровля', brand: 'GRAND LINE', price: 31.7, oldPrice: 36.0, rating: '4.8', reviews: 91, image: 'photo-1635424710928-ff6d33f8ac8b', badge: 'Хит продаж' },
]

const demoDataKey = 'stroybaza.demo.data'
const emptyDemoData = { users: [], currentUserId: null, orders: [] }

function readDemoData() {
  try {
    const storedData = localStorage.getItem(demoDataKey)
    if (!storedData) return emptyDemoData

    const parsedData = JSON.parse(storedData)
    if (!Array.isArray(parsedData.users) || !Array.isArray(parsedData.orders)) {
      throw new Error('Некорректный формат данных')
    }

    return {
      users: parsedData.users,
      currentUserId: parsedData.currentUserId ?? null,
      orders: parsedData.orders,
    }
  } catch (error) {
    console.error('Не удалось загрузить демо-данные магазина:', error)
    return emptyDemoData
  }
}

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Для входа нужен современный браузер с поддержкой Web Crypto.')
  }

  const key = await globalThis.crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const digest = await globalThis.crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: new TextEncoder().encode(salt),
    iterations: 150000,
    hash: 'SHA-256',
  }, key, 256)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

const advantages = [
  { icon: 'truck', title: 'Доставим завтра', text: 'По Минску и всей Беларуси' },
  { icon: 'shield', title: 'Проверенное качество', text: 'Гарантия на каждый товар' },
  { icon: 'boxes', title: 'Цены для опта', text: 'Скидки на большие объёмы' },
]

function Icon({ name, size = 20, className = '' }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8L7.7 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.2 2.5Z" /></>,
    heart: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
    cart: <><path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6" /><circle cx="10" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    chevron: <><path d="m7 10 5 5 5-5" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    star: <><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></>,
    truck: <><path d="M3 6h11v12H3zM14 10h4l3 3v5h-7z" /><circle cx="7.5" cy="19" r="1.5" /><circle cx="17.5" cy="19" r="1.5" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    boxes: <><path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5" /></>,
    headset: <><path d="M3 14v-3a9 9 0 0 1 18 0v3" /><path d="M5 14h2v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2ZM19 14h-2v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z" /></>,
    mix: <><path d="M4 7h16M6 7l1 14h10l1-14M9 7l1-4h4l1 4" /><path d="M9 12h6" /></>,
    brick: <><path d="M3 7h18v14H3zM3 12h18M9 7v5m6 0v5m-6 0v4" /></>,
    wood: <><path d="M4 5h16v5H4zM4 14h16v5H4zM8 5v5m8-5v5m-8 4v5m8-5v5" /></>,
    roof: <><path d="m3 11 9-8 9 8v10H3zM8 21v-7h8v7M3 11h18" /></>,
    insulation: <><path d="M4 4h16v16H4zM8 4v16m8-16v16M4 8h16m-16 8h16" /></>,
    tile: <><path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" /></>,
    water: <><path d="M12 3v10m-5-5h10M5 13h14v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" /></>,
    bolt: <><path d="m13 2-3 9h7L10 22l3-9H6l7-11Z" /></>,
    tool: <><path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4L14 12l-3-3 3.7-2.7Z" /></>,
    fastener: <><path d="M7 3h10v4H7zM9 7v11a3 3 0 0 0 6 0V7M8 12h8" /></>,
    location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    calculator: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 12h2m4 0h2m-8 4h2m4 0h2" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
  }

  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.boxes}</svg>
}

function App() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Все товары')
  const [activeTab, setActiveTab] = useState('Хиты продаж')
  const [brand, setBrand] = useState('Все бренды')
  const [maxPrice, setMaxPrice] = useState(350)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [accountMode, setAccountMode] = useState('login')
  const [authError, setAuthError] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [demoData, setDemoData] = useState(readDemoData)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [orderComplete, setOrderComplete] = useState(null)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [wallWidth, setWallWidth] = useState(6)
  const [wallHeight, setWallHeight] = useState(2.7)

  const currentUser = demoData.users.find((user) => user.id === demoData.currentUserId) || null
  const userOrders = currentUser ? demoData.orders.filter((order) => order.userId === currentUser.id) : []

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesSearch = `${product.title} ${product.category} ${product.brand}`.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'Все товары' || product.category === activeCategory
    const matchesBrand = brand === 'Все бренды' || product.brand === brand
    const matchesPrice = product.price <= maxPrice
    const matchesStock = !inStockOnly || product.id !== 8
    const matchesTab = activeTab === 'Новинки' ? product.badge === 'Новинка' : true
    return showFavorites
      ? favorites.includes(product.id)
      : matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock && matchesTab
  }), [activeCategory, activeTab, brand, favorites, inStockOnly, maxPrice, search, showFavorites])

  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  const cartTotal = products.reduce((total, product) => total + product.price * (cart[product.id] || 0), 0)
  const wallArea = Math.max(0, Number(wallWidth) * Number(wallHeight))
  const bagCount = Math.ceil(wallArea / 3.5)

  function addToCart(id) {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }))
  }

  function changeQuantity(id, amount) {
    setCart((current) => {
      const quantity = (current[id] || 0) + amount
      if (quantity <= 0) {
        const next = { ...current }
        delete next[id]
        return next
      }
      return { ...current, [id]: quantity }
    })
  }

  function chooseCategory(title) {
    setActiveCategory(title)
    setShowFavorites(false)
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  function toggleFavorites() {
    setShowFavorites((value) => !value)
    setActiveCategory('Все товары')
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  function saveDemoData(nextData) {
    localStorage.setItem(demoDataKey, JSON.stringify(nextData))
    setDemoData(nextData)
  }

  async function handleAuth(event) {
    event.preventDefault()
    setAuthError('')
    setAuthBusy(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email')).trim().toLowerCase()
    const password = String(formData.get('password'))

    try {
      let nextData

      if (accountMode === 'register') {
        const name = String(formData.get('name')).trim()
        if (demoData.users.some((user) => user.email === email)) {
          setAuthError('Аккаунт с таким email уже существует. Войдите в него.')
          return
        }

        const passwordSalt = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, '0')).join('')
        const passwordHash = await hashPassword(password, passwordSalt)
        const user = { id: crypto.randomUUID(), name, email, passwordSalt, passwordHash }
        nextData = {
          ...demoData,
          users: [...demoData.users, user],
          currentUserId: user.id,
        }
      } else {
        const user = demoData.users.find((candidate) => candidate.email === email)
        if (!user || user.passwordHash !== await hashPassword(password, user.passwordSalt)) {
          setAuthError('Проверьте email и пароль.')
          return
        }

        nextData = { ...demoData, currentUserId: user.id }
      }

      saveDemoData(nextData)
      setAccountMode('profile')
      setAuthError('')
    } catch (error) {
      console.error('Не удалось выполнить вход или регистрацию:', error)
      setAuthError(error instanceof Error ? error.message : 'Не удалось сохранить данные. Попробуйте ещё раз.')
    } finally {
      setAuthBusy(false)
    }
  }

  function signOut() {
    try {
      saveDemoData({ ...demoData, currentUserId: null })
      setAccountMode('login')
      setAuthError('')
    } catch (error) {
      console.error('Не удалось завершить сеанс:', error)
      setAuthError('Не удалось завершить сеанс. Попробуйте ещё раз.')
    }
  }

  function submitOrder(event) {
    event.preventDefault()
    setCheckoutError('')

    const formData = new FormData(event.currentTarget)
    const items = products
      .filter((product) => cart[product.id])
      .map((product) => ({
        id: product.id,
        title: product.title,
        quantity: cart[product.id],
        price: product.price,
      }))
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const order = {
      id: `SB-${Date.now().toString(36).toUpperCase()}`,
      userId: currentUser?.id ?? null,
      createdAt: new Date().toISOString(),
      name: String(formData.get('name')).trim(),
      phone: String(formData.get('phone')).trim(),
      address: String(formData.get('address')).trim(),
      comment: String(formData.get('comment')).trim(),
      payment: 'При получении',
      items,
      total,
    }

    if (items.length === 0) {
      setCheckoutError('Корзина пуста. Добавьте товары и попробуйте снова.')
      return
    }

    try {
      const nextData = { ...demoData, orders: [order, ...demoData.orders] }
      saveDemoData(nextData)
      setCart({})
      setCheckoutOpen(false)
      setOrderComplete(order)
    } catch (error) {
      console.error('Не удалось сохранить заказ:', error)
      setCheckoutError('Не удалось сохранить заказ в этом браузере. Проверьте свободное место и попробуйте ещё раз.')
    }
  }

  return (
    <div className="storefront">
      <div className="topline"><div className="container topline-inner"><span>Стройматериалы с заботой о вашем проекте</span><div><a href="#delivery">Доставка и оплата</a><a href="#contacts">Контакты</a><span><Icon name="location" size={15} /> Минск</span></div></div></div>
      <header className="site-header">
        <div className="container header-main">
          <a className="brand-mark" href="#home" aria-label="СтройБаза, на главную"><span className="brand-symbol"><span /><span /><span /></span><span className="brand-name"><span className="brand-word">строй<span>база</span></span><small>МАТЕРИАЛЫ ДЛЯ ДЕЛА</small></span></a>
          <div className="search-box"><Icon name="search" size={19} /><input aria-label="Поиск по товарам" placeholder="Найти материалы, бренд или артикул" value={search} onChange={(event) => { setSearch(event.target.value); setShowFavorites(false) }} /><kbd>⌘ K</kbd></div>
          <a className="phone-block" href="tel:+375173090909"><Icon name="phone" size={18} /><span><strong>+375 (17) 309-09-09</strong><small>Ежедневно с 8:00 до 20:00</small></span></a>
          <button className="icon-action account-action" type="button" aria-label={currentUser ? 'Личный кабинет' : 'Войти'} onClick={() => { setAccountMode(currentUser ? 'profile' : 'login'); setAuthError(''); setAccountOpen(true) }}><Icon name="user" size={21} /><span>{currentUser ? 'Профиль' : 'Войти'}</span></button>
          <button className={`icon-action favorite-action ${showFavorites ? 'is-active' : ''}`} type="button" aria-label="Показать избранное" aria-pressed={showFavorites} onClick={toggleFavorites}><Icon name="heart" size={21} /><span>Избранное</span>{favorites.length > 0 && <b>{favorites.length}</b>}</button>
          <button className="cart-action" type="button" onClick={() => setCartOpen(true)}><Icon name="cart" size={19} /><span>Корзина</span><b>{cartCount}</b></button>
        </div>
        <div className="nav-row"><div className="container nav-inner"><button className={`catalog-menu ${categoriesOpen ? 'is-open' : ''}`} type="button" onClick={() => setCategoriesOpen((value) => !value)}><Icon name="menu" size={19} /> Каталог товаров <Icon name="chevron" size={15} /></button><nav className="main-nav" aria-label="Основная навигация"><a href="#catalog">Каталог</a><a href="#calculator">Калькулятор</a><a href="#benefits">О компании</a><a href="#reviews">Отзывы</a></nav><span className="nav-promo"><span /> Доставка от 300 BYN — бесплатно</span></div>{categoriesOpen && <div className="category-dropdown"><div className="container category-dropdown-inner">{categories.map((category) => <button type="button" key={category.title} onClick={() => { chooseCategory(category.title); setCategoriesOpen(false) }}><Icon name={category.icon} size={19} />{category.title}<Icon name="arrow" size={15} /></button>)}</div></div>}</div>
      </header>

      <main id="home">
        <section className="hero-section"><div className="container hero-layout"><div className="hero-copy"><span className="eyebrow"><span /> СТРОИТЬ ПРОЩЕ, КОГДА ВСЁ РЯДОМ</span><h1>Стройматериалы<br />с доставкой <em>за 1 день</em></h1><p>Всё для строительства и ремонта — от фундамента до последнего штриха. Честные цены и доставка точно в срок.</p><div className="hero-buttons"><a className="button button-primary" href="#catalog">Перейти в каталог <Icon name="arrow" size={18} /></a><a className="button button-text" href="#calculator">Рассчитать материалы</a></div><div className="hero-proof"><div className="avatar-stack"><span>А</span><span>М</span><span>И</span><span>+</span></div><div><strong>4 800+</strong><small>проектов уже построено с нами</small></div><span className="hero-rating"><Icon name="star" size={14} /> 4,9 <small>из 5</small></span></div></div><div className="hero-visual"><img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85" alt="Строительная площадка и возведение современного здания" /><div className="visual-caption"><span className="caption-dot" /><span><strong>Всё для стройки</strong><small>на одном складе в Минске</small></span><Icon name="arrow" size={19} /></div><div className="visual-stamp"><strong>15</strong><span>лет<br />на рынке</span></div></div></div><div className="container advantage-strip">{advantages.map((item) => <div className="advantage-item" key={item.title}><span className="advantage-icon"><Icon name={item.icon} size={22} /></span><span><strong>{item.title}</strong><small>{item.text}</small></span></div>)}</div></section>

        <section className="categories-section section-space" id="categories"><div className="container"><div className="section-heading"><div><span className="eyebrow">ВЫБИРАЙТЕ СВОЁ</span><h2>Категории товаров</h2></div><button className="text-link" type="button" onClick={() => { setActiveCategory('Все товары'); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }) }}>Все категории <Icon name="arrow" size={17} /></button></div><div className="category-grid">{categories.map((category, index) => <button className="category-tile" type="button" key={category.title} onClick={() => chooseCategory(category.title)}><span className={`category-icon category-tone-${index % 5}`}><Icon name={category.icon} size={25} /></span><span className="category-label"><strong>{category.title}</strong><small>{category.count}</small></span><Icon className="category-arrow" name="arrow" size={16} /></button>)}</div></div></section>

        <section className="products-section section-space" id="catalog"><div className="container"><div className="section-heading product-heading"><div><span className="eyebrow">ТОЛЬКО ПРОВЕРЕННОЕ</span><h2>{showFavorites ? 'Избранное' : activeCategory === 'Все товары' ? 'Выбор наших клиентов' : activeCategory}</h2></div><div className="product-tabs"><button className={activeTab === 'Хиты продаж' ? 'is-selected' : ''} type="button" onClick={() => setActiveTab('Хиты продаж')}>Хиты продаж</button><button className={activeTab === 'Новинки' ? 'is-selected' : ''} type="button" onClick={() => setActiveTab('Новинки')}>Новинки <span>NEW</span></button></div></div><div className="catalog-tools"><span>{filteredProducts.length} товаров</span><label className="brand-select">Бренд<select aria-label="Фильтр по бренду" value={brand} onChange={(event) => setBrand(event.target.value)}><option>Все бренды</option>{[...new Set(products.map((product) => product.brand))].map((name) => <option key={name}>{name}</option>)}</select><Icon name="chevron" size={14} /></label><label className="price-filter">До {maxPrice} BYN<input type="range" min="20" max="350" step="10" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Максимальная цена" /></label><label className="stock-filter"><input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} /><span className="custom-check"><Icon name="check" size={12} /></span> В наличии</label><button className="reset-filters" type="button" onClick={() => { setBrand('Все бренды'); setMaxPrice(350); setInStockOnly(false); setSearch(''); setShowFavorites(false); setActiveCategory('Все товары') }}>Сбросить</button></div><div className="product-grid">{filteredProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image-wrap"><img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=640&q=80`} alt={product.title} loading="lazy" /><span className={`product-badge ${product.badge === 'Новинка' ? 'badge-new' : ''}`}>{product.badge}</span><button className={`product-favorite ${favorites.includes(product.id) ? 'is-active' : ''}`} type="button" aria-label={favorites.includes(product.id) ? 'Убрать из избранного' : 'Добавить в избранное'} onClick={() => setFavorites((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])}><Icon name="heart" size={19} /></button></div><div className="product-info"><span className="product-brand">{product.brand}</span><h3>{product.title}</h3><div className="product-rating"><Icon name="star" size={14} /><strong>{product.rating}</strong><span>({product.reviews})</span><span className={`stock-label ${product.id === 8 ? 'stock-order' : ''}`}><i />{product.id === 8 ? 'Под заказ' : 'В наличии'}</span></div><div className="product-purchase"><div className="product-price"><strong>{product.price.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} <small>BYN</small></strong><del>{product.oldPrice.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} BYN</del></div><button className={`add-cart ${cart[product.id] ? 'added' : ''}`} type="button" aria-label={`Добавить в корзину: ${product.title}`} onClick={() => addToCart(product.id)}>{cart[product.id] ? <><Icon name="check" size={17} /><span>{cart[product.id]}</span></> : <Icon name="cart" size={18} />}</button></div></div></article>)}</div>{filteredProducts.length === 0 && <div className="empty-results"><Icon name="search" size={28} /><strong>{showFavorites ? 'В избранном пока пусто' : 'Ничего не нашлось'}</strong><span>{showFavorites ? 'Нажимайте на сердечко у товара, чтобы сохранить его здесь.' : 'Попробуйте изменить условия поиска или фильтры.'}</span><button type="button" onClick={() => { setSearch(''); setBrand('Все бренды'); setMaxPrice(350); setInStockOnly(false); setShowFavorites(false); setActiveCategory('Все товары') }}>{showFavorites ? 'Перейти в каталог' : 'Сбросить фильтры'}</button></div>}<div className="catalog-footer"><span>Показано {filteredProducts.length} из {products.length} товаров</span><button className="button button-outline" type="button" onClick={() => { setActiveCategory('Все товары'); setShowFavorites(false); setMaxPrice(350); setBrand('Все бренды'); setActiveTab('Хиты продаж') }}>Смотреть весь каталог <Icon name="arrow" size={17} /></button></div></div></section>

        <section className="benefits-section section-space" id="benefits"><div className="container"><div className="section-heading"><div><span className="eyebrow">С НАМИ СПОКОЙНО</span><h2>Почему выбирают СтройБазу</h2></div><p className="heading-note">Делаем стройку предсказуемой: от первого расчёта до разгрузки на объекте.</p></div><div className="benefit-grid"><article><span className="benefit-icon"><Icon name="truck" size={26} /></span><span className="benefit-number">01</span><h3>Привозим точно в срок</h3><p>Собственный транспорт и доставка по всей Беларуси. Подберём удобное время.</p></article><article><span className="benefit-icon"><Icon name="shield" size={26} /></span><span className="benefit-number">02</span><h3>Отвечаем за качество</h3><p>Работаем напрямую с производителями и проверяем каждую поставку.</p></article><article><span className="benefit-icon"><Icon name="boxes" size={26} /></span><span className="benefit-number">03</span><h3>Считаем выгодно</h3><p>Оптовые условия для бригад, застройщиков и постоянных клиентов.</p></article><article><span className="benefit-icon"><Icon name="headset" size={26} /></span><span className="benefit-number">04</span><h3>Помогаем разобраться</h3><p>Специалисты подскажут материалы и количество под вашу задачу.</p></article></div></div></section>

        <section className="calculator-section section-space" id="calculator"><div className="container calculator-layout"><div className="calculator-copy"><span className="eyebrow">МЕНЬШЕ ОСТАТКОВ — БОЛЬШЕ ПОЛЬЗЫ</span><h2>Рассчитайте<br />материалы за минуту</h2><p>Укажите размеры стены, а мы подскажем, сколько сухой смеси понадобится для работы.</p><div className="calculator-note"><span><Icon name="check" size={16} /></span> Расчёт с запасом на неровности и расход</div><div className="calculator-note"><span><Icon name="check" size={16} /></span> Подберём подходящие товары из каталога</div></div><div className="calculator-panel"><div className="calculator-panel-title"><span className="calculator-icon"><Icon name="calculator" size={21} /></span><div><strong>Штукатурка стен</strong><small>Расход смеси: 8,5 кг / м² при слое 5 мм</small></div></div><div className="measure-fields"><label>Ширина стены, м<input type="number" min="0" step="0.1" value={wallWidth} onChange={(event) => setWallWidth(event.target.value)} /></label><span>×</span><label>Высота стены, м<input type="number" min="0" step="0.1" value={wallHeight} onChange={(event) => setWallHeight(event.target.value)} /></label></div><div className="calculation-result"><div><small>Площадь стены</small><strong>{wallArea.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} м²</strong></div><div><small>Штукатурка по 30 кг</small><strong>{bagCount} <span>мешков</span></strong></div></div><a className="button button-primary calculator-button" href="#catalog" onClick={() => { setSearch('Штукатурка'); setActiveCategory('Все товары'); setShowFavorites(false) }}>Подобрать материалы <Icon name="arrow" size={17} /></a><small className="calculator-disclaimer">Ориентировочный расчёт. Точный расход зависит от состояния поверхности.</small></div></div></section>

        <section className="reviews-section section-space" id="reviews"><div className="container"><div className="section-heading"><div><span className="eyebrow">НАС РЕКОМЕНДУЮТ</span><h2>Слова тех, кто строит</h2></div><a className="text-link" href="mailto:info@stroybaza.by">Все отзывы <Icon name="arrow" size={17} /></a></div><div className="review-grid"><article className="review-card"><div className="review-stars">★★★★★ <span>5.0</span></div><p>«Собирали материалы на отделку дома. Менеджер всё посчитал, привезли на следующий день — ничего не забыли, ничего лишнего.»</p><div className="review-author"><span className="review-avatar avatar-sand">АК</span><span><strong>Александр К.</strong><small>Строит дом в Минском районе</small></span><small className="review-date">18.09.2025</small></div></article><article className="review-card"><div className="review-stars">★★★★★ <span>4.9</span></div><p>«Заказываем сухие смеси на объекты регулярно. Всегда есть нужные объёмы, документы в порядке и хороший оптовый прайс.»</p><div className="review-author"><span className="review-avatar avatar-blue">МС</span><span><strong>Марина С.</strong><small>Руководитель строительной бригады</small></span><small className="review-date">02.09.2025</small></div></article><article className="review-score"><span className="eyebrow">СРЕДНЯЯ ОЦЕНКА</span><strong>4,9<span>/5</span></strong><div className="review-stars">★★★★★</div><p>На основе 1 240 отзывов<br />на картах и в магазине</p><div className="rating-bars"><span>5 <i><b /></i> 92%</span><span>4 <i><b /></i> 6%</span><span>3 <i><b /></i> 2%</span></div></article></div><div className="partners-row"><span>НАМ ДОВЕРЯЮТ ПРОИЗВОДИТЕЛИ</span><div className="partner-logos"><strong>КЕРАМИН</strong><strong className="partner-light">ISOVER</strong><strong className="partner-italic">СТАРАТЕЛИ</strong><strong className="partner-box">GRAND LINE</strong><strong className="partner-bold">DEWALT</strong><strong>TIKKURILA</strong></div></div></div></section>

        <section className="newsletter-section"><div className="container newsletter-inner"><span className="newsletter-mark"><Icon name="mail" size={23} /></span><div><strong>Полезное для вашего проекта</strong><small>Расчёты, советы и закрытые предложения раз в неделю</small></div><form onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset() }}><input type="email" placeholder="Ваш email" aria-label="Ваш email" required /><button type="submit" aria-label="Подписаться"><Icon name="arrow" size={19} /></button></form></div></section>
      </main>

      <footer className="site-footer" id="contacts"><div className="container footer-main"><div className="footer-about"><a className="brand-mark footer-brand" href="#home"><span className="brand-symbol"><span /><span /><span /></span><span className="brand-name"><span className="brand-word">строй<span>база</span></span><small>МАТЕРИАЛЫ ДЛЯ ДЕЛА</small></span></a><p>Надёжная база для больших планов. Материалы, инструменты и доставка для стройки без лишних забот.</p><div className="social-links"><a href="https://t.me/" aria-label="Telegram">tg</a><a href="https://www.instagram.com/" aria-label="Instagram">ig</a><a href="https://vk.com/" aria-label="ВКонтакте">вк</a></div></div><div className="footer-column"><strong>Покупателям</strong><a href="#catalog">Каталог товаров</a><a href="#delivery" id="delivery">Доставка и оплата</a><a href="#calculator">Калькулятор материалов</a><a href="#reviews">Отзывы клиентов</a></div><div className="footer-column"><strong>Контакты</strong><a href="tel:+375173090909">+375 (17) 309-09-09</a><a href="mailto:info@stroybaza.by">info@stroybaza.by</a><span><Icon name="location" size={15} /> Минск, ул. Складская, 14</span><span><Icon name="clock" size={15} /> Пн–Сб: 8:00–20:00</span></div><div className="footer-column payment-column"><strong>Оплата</strong><p>Наличные, карта, безналичный расчёт для юрлиц</p><div className="payment-methods"><span>VISA</span><span>МИР</span><span>ЕРИП</span></div><div className="legal-note">ООО «СтройБаза»<br />УНП 193456789</div></div></div><div className="container footer-bottom"><span>© 2025 СтройБаза. Все права защищены.</span><a href="mailto:info@stroybaza.by">Политика конфиденциальности</a><span>Цены указаны в белорусских рублях</span></div></footer>

      {cartOpen && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="side-drawer" aria-label="Корзина"><div className="drawer-heading"><div><span className="eyebrow">ВАШ ЗАКАЗ</span><h2>Корзина <span>{cartCount}</span></h2></div><button className="close-button" type="button" aria-label="Закрыть корзину" onClick={() => setCartOpen(false)}><Icon name="close" size={21} /></button></div>{cartCount === 0 ? <div className="drawer-empty"><span><Icon name="cart" size={27} /></span><strong>Пока здесь пусто</strong><p>Добавьте товары из каталога, и мы соберём ваш заказ.</p><button className="button button-primary" type="button" onClick={() => setCartOpen(false)}>Перейти к покупкам</button></div> : <><div className="drawer-items">{products.filter((product) => cart[product.id]).map((product) => <div className="drawer-product" key={product.id}><img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=160&q=70`} alt="" /><div className="drawer-product-info"><strong>{product.title}</strong><small>{product.price.toFixed(2)} BYN / шт.</small><div className="quantity-control"><button type="button" aria-label="Уменьшить количество" onClick={() => changeQuantity(product.id, -1)}>−</button><span>{cart[product.id]}</span><button type="button" aria-label="Увеличить количество" onClick={() => changeQuantity(product.id, 1)}>+</button></div></div><b>{(product.price * cart[product.id]).toFixed(2)} BYN</b></div>)}</div><div className="drawer-total"><span>Итого без доставки</span><strong>{cartTotal.toFixed(2)} BYN</strong><button className="button button-primary" type="button" onClick={() => { setCartOpen(false); setCheckoutError(''); setCheckoutOpen(true) }}>Оформить заказ <Icon name="arrow" size={17} /></button><small>Точная стоимость доставки будет рассчитана менеджером</small></div></>}</aside></div>}
      {accountOpen && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setAccountOpen(false) }}><section className="account-modal" aria-label="Личный кабинет"><button className="close-button modal-close" type="button" aria-label="Закрыть" onClick={() => setAccountOpen(false)}><Icon name="close" size={21} /></button><span className="modal-icon"><Icon name="user" size={23} /></span><span className="eyebrow">ЛИЧНЫЙ КАБИНЕТ</span>{currentUser && accountMode === 'profile' ? <><h2>Здравствуйте, {currentUser.name}</h2><p>{currentUser.email}</p><div className="profile-orders"><strong>История заказов ({userOrders.length})</strong>{userOrders.length === 0 ? <p>Пока заказов нет. Оформленные заказы появятся здесь.</p> : userOrders.map((order) => <article key={order.id}><div><strong>{order.id}</strong><span>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</span></div><b>{order.total.toFixed(2)} BYN</b><small>{order.items.map((item) => `${item.title} × ${item.quantity}`).join(', ')}</small><small>Оплата при получении · {order.address}</small></article>)}</div><button className="button button-outline profile-signout" type="button" onClick={signOut}>Выйти из аккаунта</button></> : <><h2>{accountMode === 'register' ? 'Создать аккаунт' : 'Рады вас видеть'}</h2><p>{accountMode === 'register' ? 'Зарегистрируйтесь, чтобы сохранять историю заказов в этом браузере.' : 'Войдите, чтобы видеть историю оформленных заказов.'}</p><form onSubmit={handleAuth}><label>Email<input name="email" type="email" autoComplete="email" required /></label>{accountMode === 'register' && <label>Имя<input name="name" type="text" autoComplete="name" minLength="2" required /></label>}<label>Пароль<input name="password" type="password" autoComplete={accountMode === 'register' ? 'new-password' : 'current-password'} minLength="8" required /></label>{authError && <p className="form-error" role="alert">{authError}</p>}<button className="button button-primary" type="submit" disabled={authBusy}>{authBusy ? 'Подождите…' : accountMode === 'register' ? 'Зарегистрироваться' : 'Войти'} <Icon name="arrow" size={17} /></button></form><button className="text-link auth-switch" type="button" onClick={() => { setAccountMode(accountMode === 'register' ? 'login' : 'register'); setAuthError('') }}>{accountMode === 'register' ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}</button><small>Демо-режим: данные сохраняются только в этом браузере и не отправляются на сервер.</small></>}</section></div>}
      {checkoutOpen && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckoutOpen(false) }}><section className="account-modal checkout-modal" aria-label="Оформление заказа"><button className="close-button modal-close" type="button" aria-label="Закрыть" onClick={() => setCheckoutOpen(false)}><Icon name="close" size={21} /></button><span className="modal-icon"><Icon name="cart" size={23} /></span><span className="eyebrow">ОФОРМЛЕНИЕ ЗАКАЗА</span><h2>Куда доставить?</h2><p>Заполните контакты — менеджер свяжется с вами для уточнения доставки.</p><div className="checkout-summary"><span>{cartCount} товара(ов)</span><strong>{cartTotal.toFixed(2)} BYN</strong></div><form onSubmit={submitOrder}><label>Имя<input name="name" type="text" autoComplete="name" defaultValue={currentUser?.name ?? ''} minLength="2" required /></label><label>Телефон<input name="phone" type="tel" autoComplete="tel" placeholder="+375 (__) ___-__-__" required /></label><label>Адрес доставки<input name="address" type="text" autoComplete="street-address" placeholder="Город, улица, дом" required /></label><label>Комментарий к заказу<textarea name="comment" rows="2" placeholder="Подъезд, удобное время и другие детали" /></label><div className="payment-note"><strong>Оплата при получении</strong><span>Наличными или картой при доставке</span></div>{checkoutError && <p className="form-error" role="alert">{checkoutError}</p>}<button className="button button-primary" type="submit">Подтвердить заказ <Icon name="arrow" size={17} /></button></form><small>Демо-режим: заказ сохранится только в этом браузере; продавцу он не отправляется.</small></section></div>}
      {orderComplete && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setOrderComplete(null) }}><section className="account-modal order-success" aria-label="Заказ оформлен"><button className="close-button modal-close" type="button" aria-label="Закрыть" onClick={() => setOrderComplete(null)}><Icon name="close" size={21} /></button><span className="modal-icon"><Icon name="check" size={23} /></span><span className="eyebrow">ЗАКАЗ СОХРАНЁН</span><h2>Спасибо за заказ!</h2><p>Номер заказа: <strong>{orderComplete.id}</strong></p><div className="checkout-summary"><span>К оплате при получении</span><strong>{orderComplete.total.toFixed(2)} BYN</strong></div><small>Это демо-заказ, он сохранён только в вашем браузере и не отправлен продавцу.</small><button className="button button-primary" type="button" onClick={() => setOrderComplete(null)}>Продолжить покупки</button></section></div>}
    </div>
  )
}

export default App

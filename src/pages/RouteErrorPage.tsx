import { Link, useRouteError } from 'react-router-dom'

export function RouteErrorPage() {
  const error = useRouteError()
  const message = error instanceof Error ? error.message : 'Произошла непредвиденная ошибка.'

  return (
    <section className="container route-error-page">
      <div className="empty-results">
        <strong>Не удалось открыть страницу</strong>
        <span>{message}</span>
        <Link className="button button-primary" to="/catalog">Вернуться в каталог</Link>
      </div>
    </section>
  )
}

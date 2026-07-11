export function EmptyState({ title, description, action }) {
  return (
    <section className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        □
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </section>
  )
}

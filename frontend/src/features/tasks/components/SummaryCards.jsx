const metrics = [
  { key: 'total', label: 'Total Tasks' },
  { key: 'completed', label: 'Completed Tasks' },
  { key: 'pending', label: 'Pending Tasks' },
]

export function SummaryCards({ summary }) {
  return (
    <section className="summary-grid">
      {metrics.map((metric) => (
        <article key={metric.key} className="summary-card">
          <span>{metric.label}</span>
          <strong>{summary[metric.key]}</strong>
        </article>
      ))}
    </section>
  )
}

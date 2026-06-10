const MetricCard = ({ label, value, detail }) => (
  <article className="metric-card">
    <span>{label}</span>
    <strong>{value}</strong>
    <small>{detail}</small>
  </article>
);

const StatsGrid = ({ stats, label = "Metrics" }) => (
  <section className="stats-grid" aria-label={label}>
    {stats.map((stat) => (
      <MetricCard
        key={stat.label}
        label={stat.label}
        value={stat.value}
        detail={stat.detail}
      />
    ))}
  </section>
);

export default StatsGrid;

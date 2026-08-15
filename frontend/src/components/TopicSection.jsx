export default function TopicSection({
  title,
  topics,
  emptyMessage,
  showCluster = false,
  variant = "default",
}) {
  const headingId = `${title.toLowerCase().replaceAll(" ", "-")}-heading`;

  return (
    <section
      className={`topic-section topic-section--${variant}`}
      aria-labelledby={headingId}
    >
      <div className="section-heading-row">
        <div>
          <p className="section-kicker">Learning status</p>
          <h2 id={headingId}>{title}</h2>
        </div>
        <span className="count-badge">{topics.length}</span>
      </div>

      {topics.length === 0 ? (
        <div className="section-empty">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <ul className="topic-grid">
          {topics.map((topic) => (
            <li className="topic-grid-item" key={topic.id}>
              <article className="topic-card">
                <span className="topic-status-dot" aria-hidden="true" />
                <h3>{topic.name}</h3>
                <p>{topic.description}</p>
                {showCluster && topic.cluster?.name ? (
                  <span className="cluster-tag">{topic.cluster.name}</span>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function PageHeader({ eyebrow, title, description }) {
  return (
    <header className="page-header">
      <p className="page-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-description">{description}</p>
    </header>
  );
}

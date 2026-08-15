export default function StatusState({ type = "empty", title, message }) {
  const isLoading = type === "loading";
  const role = type === "error" ? "alert" : isLoading ? "status" : undefined;

  return (
    <div className={`status-state status-state--${type}`} role={role}>
      {isLoading ? <span className="status-spinner" aria-hidden="true" /> : null}
      <div>
        <h2>{title}</h2>
        {message ? <p>{message}</p> : null}
      </div>
    </div>
  );
}

const ErrorBar = ({ message, onDismiss }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="error-bar">
      <span>{message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss error">
        &times;
      </button>
    </div>
  );
};

export default ErrorBar;

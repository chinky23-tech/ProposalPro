const LoadingState = ({ message }) => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <span>{message}</span>
  </div>
);

export default LoadingState;

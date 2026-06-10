const AiInsightPanel = ({
  scoreResult,
  appliedSuggestion,
  actionLoading,
  onApplySuggestion,
}) => {
  const suggestion = scoreResult?.recommendations?.[0];

  return (
    <article className="insight-panel">
      <div>
        <p className="eyebrow">AI insight</p>
        <h2>{appliedSuggestion ? "Suggestion applied" : "Live suggestion"}</h2>
        {appliedSuggestion ? (
          <p>{appliedSuggestion.updatedInsight}</p>
        ) : suggestion ? (
          <p>{suggestion}</p>
        ) : (
          <p>Improve the win score to receive a real-time suggestion.</p>
        )}
      </div>
      <button
        type="button"
        onClick={onApplySuggestion}
        disabled={actionLoading === "suggestion" || !suggestion}
      >
        <span aria-hidden="true">+</span>
        {actionLoading === "suggestion" ? "Applying..." : "Apply suggestion"}
      </button>
    </article>
  );
};

export default AiInsightPanel;

const AiBuilderPanel = ({
  brief,
  draftResult,
  scoreResult,
  actionLoading,
  onBriefChange,
  onGenerateDraft,
  onImproveWinScore,
}) => {
  const isWorking = Boolean(actionLoading);
  const hasBrief = Boolean(brief.trim());

  return (
    <article className="ai-workbench">
      <div className="section-heading">
        <div>
          <p className="eyebrow">AI proposal builder</p>
          <h2>Turn a client brief into a deal-ready draft.</h2>
        </div>
        <span className="status-pill">Live API</span>
      </div>

      <label htmlFor="brief">Client brief</label>
      <textarea
        id="brief"
        rows="5"
        value={brief}
        placeholder="Paste a real client brief here before generating a draft."
        onChange={(event) => onBriefChange(event.target.value)}
      />

      <div className="builder-actions">
        <button
          type="button"
          onClick={onGenerateDraft}
          disabled={isWorking || !hasBrief}
        >
          <span aria-hidden="true">*</span>
          {actionLoading === "draft" ? "Generating..." : "Generate draft"}
        </button>
        <button
          type="button"
          onClick={onImproveWinScore}
          disabled={isWorking || !hasBrief}
        >
          <span aria-hidden="true">^</span>
          {actionLoading === "score" ? "Improving..." : "Improve win score"}
        </button>
      </div>

      {draftResult && (
        <div className="ai-result-card">
          <p className="eyebrow">Generated draft</p>
          <h3>{draftResult.title}</h3>
          <p>{draftResult.executiveSummary}</p>
          <div className="draft-section-grid">
            {(draftResult.sections || []).map((section) => (
              <div key={section.heading}>
                <strong>{section.heading}</strong>
                <span>{section.body}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {scoreResult && (
        <div className="score-result-card">
          <div>
            <span>Previous score</span>
            <strong>{scoreResult.previousScore}%</strong>
          </div>
          <div>
            <span>Improved score</span>
            <strong>{scoreResult.improvedScore}%</strong>
          </div>
          <ul>
            {(scoreResult.recommendations || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
};

export default AiBuilderPanel;

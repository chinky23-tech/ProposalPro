import { useState } from "react";
import aiApi from "../../../api/ai";
import AiBuilderPanel from "../../../components/dashboard/AiBuilderPanel";
import AiInsightPanel from "../../../components/dashboard/AiInsightPanel";
import ErrorBar from "../../../components/dashboard/ErrorBar";

const AiBuilder = ({ token }) => {
  const [brief, setBrief] = useState("");
  const [draftResult, setDraftResult] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);
  const [appliedSuggestion, setAppliedSuggestion] = useState(null);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  const requireBrief = () => {
    if (brief.trim()) {
      return true;
    }

    setError("Paste a real client brief before using the AI builder.");
    return false;
  };

  const handleGenerateDraft = async () => {
    if (!requireBrief()) {
      return;
    }

    try {
      setActionLoading("draft");
      setError("");
      const data = await aiApi.generateDraft({ brief }, token);
      setDraftResult(data.draft);
    } catch (err) {
      setError(err.message || "Failed to generate draft.");
    } finally {
      setActionLoading("");
    }
  };

  const handleImproveWinScore = async () => {
    if (!requireBrief()) {
      return;
    }

    try {
      setActionLoading("score");
      setError("");
      const data = await aiApi.improveWinScore(
        { brief, currentScore: scoreResult?.improvedScore || null },
        token
      );
      setScoreResult(data);
      setAppliedSuggestion(null);

      if (data.improvedBrief) {
        setBrief(data.improvedBrief);
      }
    } catch (err) {
      setError(err.message || "Failed to improve win score.");
    } finally {
      setActionLoading("");
    }
  };

  const handleApplySuggestion = async () => {
    const suggestion = scoreResult?.recommendations?.[0];

    if (!suggestion) {
      setError("Improve win score first, then apply one of the live AI suggestions.");
      return;
    }

    try {
      setActionLoading("suggestion");
      setError("");
      const data = await aiApi.applySuggestion({ brief, suggestion }, token);
      setAppliedSuggestion(data);

      if (data.updatedBrief) {
        setBrief(data.updatedBrief);
      }
    } catch (err) {
      setError(err.message || "Failed to apply suggestion.");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <>
      <ErrorBar message={error} onDismiss={() => setError("")} />
      <section className="dashboard-grid ai-builder-view">
        <AiBuilderPanel
          brief={brief}
          draftResult={draftResult}
          scoreResult={scoreResult}
          actionLoading={actionLoading}
          onBriefChange={setBrief}
          onGenerateDraft={handleGenerateDraft}
          onImproveWinScore={handleImproveWinScore}
        />
        <AiInsightPanel
          scoreResult={scoreResult}
          appliedSuggestion={appliedSuggestion}
          actionLoading={actionLoading}
          onApplySuggestion={handleApplySuggestion}
        />
      </section>
    </>
  );
};

export default AiBuilder;

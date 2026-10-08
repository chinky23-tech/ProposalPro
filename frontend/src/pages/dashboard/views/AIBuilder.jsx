import { useState } from "react";

import aiApi from "../../../api/ai";
import { getStoredAuthSession } from "../../../api/auth";

import {
  Sparkles,
  Wand2,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export default function AIBuilder() {
  const [brief, setBrief] = useState("");

  const [draft, setDraft] =
    useState(null);

  const [improvedScore, setImprovedScore] =
    useState(null);

  const [suggestion, setSuggestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const getToken = () => {
    const session =
      getStoredAuthSession();

    return (
      session?.accessToken ||
      session?.token
    );
  };

  // Generate Draft
  const handleGenerateDraft =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await aiApi.generateDraft(
            { brief },
            getToken()
          );

        setDraft(response);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

  // Improve Score
  const handleImproveScore =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await aiApi.improveWinScore(
            {
              brief,
              currentScore:
                draft?.score || 0,
            },
            getToken()
          );

        setImprovedScore(response);

        if (
          response?.recommendation
        ) {
          setSuggestion(
            response.recommendation
          );
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

  // Apply Suggestion
  const handleApplySuggestion =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await aiApi.applySuggestion(
            {
              brief,
              suggestion,
            },
            getToken()
          );

        setDraft(response);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          AI Proposal Studio
        </h1>

        <p className="text-slate-400 mt-2">
          Generate winning
          proposals using AI.
        </p>
      </div>

      {/* Brief Input */}

      <div className="rounded-2xl border border-emerald-900/20 bg-slate-900 p-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Client Brief
        </label>

        <textarea
          value={brief}
          onChange={(e) =>
            setBrief(e.target.value)
          }
          rows={8}
          placeholder="Describe your client's requirements..."
          className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-emerald-500"
        />

        <button
          onClick={
            handleGenerateDraft
          }
          disabled={
            loading || !brief
          }
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          Generate Draft
        </button>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Generated Draft */}

      {draft && (
        <div className="rounded-2xl border border-emerald-900/20 bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-400" />

            <h2 className="text-xl font-semibold text-white">
              Generated Draft
            </h2>
          </div>

          <pre className="overflow-auto rounded-xl bg-slate-950 p-4 text-slate-300 whitespace-pre-wrap">
            {JSON.stringify(
              draft,
              null,
              2
            )}
          </pre>
        </div>
      )}

      {/* Improve Score */}

      {draft && (
        <div className="rounded-2xl border border-emerald-900/20 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Win Score
              </h2>

              <p className="text-slate-400">
                Improve proposal
                quality using AI
              </p>
            </div>

            <button
              onClick={
                handleImproveScore
              }
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-500"
            >
              <TrendingUp className="w-4 h-4" />
              Improve Score
            </button>
          </div>
        </div>
      )}

      {/* Suggestion */}

      {suggestion && (
        <div className="rounded-2xl border border-emerald-900/20 bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />

            <h2 className="text-xl font-semibold text-white">
              AI Suggestion
            </h2>
          </div>

          <p className="text-slate-300 mb-4">
            {suggestion}
          </p>

          <button
            onClick={
              handleApplySuggestion
            }
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white hover:bg-cyan-500"
          >
            <Wand2 className="w-4 h-4" />
            Apply Suggestion
          </button>
        </div>
      )}

      {/* Improved Score */}

      {improvedScore && (
        <div className="rounded-2xl border border-emerald-900/20 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            Improved Score
          </h2>

          <pre className="overflow-auto rounded-xl bg-slate-950 p-4 text-slate-300 whitespace-pre-wrap">
            {JSON.stringify(
              improvedScore,
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}


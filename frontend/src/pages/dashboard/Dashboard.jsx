import { useEffect, useState } from "react";
import proposalsApi from "../../api/proposals";

const navItems = ["Overview", "AI Builder", "Proposals", "Clients", "Analytics"];

const ideaItems = [
  "AI creates a polished first draft from a short client brief.",
  "Proposal scoring highlights weak pricing, scope, and proof sections.",
  "Reusable service packs help freelancers and agencies quote faster.",
];

const defaultBrief =
  "Website redesign for a growing SaaS team. Include discovery, UX, implementation, timeline, pricing, and proof points.";

const DashboardIcon = ({ type }) => {
  const paths = {
    Overview: "M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-4H4v4Z",
    "AI Builder": "M12 3 14 8l5 2-5 2-2 5-2-5-5-2 5-2 2-5Z",
    Proposals: "M6 3h9l3 3v15H6V3Zm8 1v4h4",
    Clients: "M8 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm8 1a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM2 21a6 6 0 0 1 12 0H2Zm11.5 0a5 5 0 0 1 8.5-3.5V21h-8.5Z",
    Analytics: "M4 19V5m0 14h16M8 15v-4m4 4V7m4 8v-6",
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[type]} />
    </svg>
  );
};

const EmptyState = ({ children }) => (
  <div className="empty-state">{children}</div>
);

const Dashboard = ({ user, token, onSignOut }) => {
  const firstName = user?.name?.split(" ")[0] || "there";

  const [activeSection, setActiveSection] = useState("Overview");
  const [proposals, setProposals] = useState([]);
  const [clients, setClients] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [sectionLoading, setSectionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [brief, setBrief] = useState(defaultBrief);
  const [draftResult, setDraftResult] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);
  const [appliedSuggestion, setAppliedSuggestion] = useState(null);
  const [actionLoading, setActionLoading] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState(null);

  const [formClient, setFormClient] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formStatus, setFormStatus] = useState("Draft");
  const [formScore, setFormScore] = useState("0");

  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await proposalsApi.getProposals(token);
      setProposals(data);
    } catch (err) {
      setError(err.message || "Failed to load proposals");
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      setSectionLoading(true);
      setError(null);
      const data = await proposalsApi.getClients(token);
      setClients(data);
    } catch (err) {
      setError(err.message || "Failed to load clients");
    } finally {
      setSectionLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setSectionLoading(true);
      setError(null);
      const data = await proposalsApi.getAnalytics(token);
      setAnalytics(data);
    } catch (err) {
      setError(err.message || "Failed to load analytics");
    } finally {
      setSectionLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialProposals = async () => {
      if (!token) {
        return;
      }

      try {
        const data = await proposalsApi.getProposals(token);

        if (isMounted) {
          setProposals(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load proposals");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialProposals();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSectionChange = (item) => {
    setActiveSection(item);

    if (item === "Clients") {
      fetchClients();
    } else if (item === "Analytics") {
      fetchAnalytics();
    } else if (item === "Proposals") {
      fetchProposals();
    }
  };

  const reviewCount = proposals.filter((p) => p.status === "Review").length;
  const totalScore = proposals.reduce(
    (acc, curr) => acc + (parseInt(curr.score, 10) || 0),
    0
  );
  const averageScore =
    proposals.length > 0 ? Math.round(totalScore / proposals.length) : 0;

  const stats = [
    {
      label: "Drafts in review",
      value: String(reviewCount),
      detail: "Requires review",
    },
    {
      label: "Win-ready score",
      value: `${averageScore}%`,
      detail: "Across active proposals",
    },
    {
      label: "Average draft time",
      value: "9m",
      detail: "Down from 2.4 days",
    },
  ];

  const formatCurrency = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const openCreateModal = () => {
    setFormClient("");
    setFormTitle("");
    setFormValue("");
    setFormStatus("Draft");
    setFormScore("0");
    setIsCreateOpen(true);
  };

  const openEditModal = (proposal) => {
    setEditingProposal(proposal);
    setFormClient(proposal.client);
    setFormTitle(proposal.title);
    setFormValue(String(proposal.value));
    setFormStatus(proposal.status);
    setFormScore(String(proposal.score));
  };

  const refreshCurrentSection = async () => {
    await fetchProposals();

    if (activeSection === "Clients") {
      await fetchClients();
    }

    if (activeSection === "Analytics") {
      await fetchAnalytics();
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formClient.trim() || !formTitle.trim()) {
      alert("Client name and Proposal title are required.");
      return;
    }

    try {
      await proposalsApi.createProposal(
        {
          client: formClient.trim(),
          title: formTitle.trim(),
          value: formValue,
          status: formStatus,
          score: parseInt(formScore, 10) || 0,
        },
        token
      );
      setIsCreateOpen(false);
      refreshCurrentSection();
    } catch (err) {
      alert(err.message || "Failed to create proposal");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!formClient.trim() || !formTitle.trim()) {
      alert("Client name and Proposal title cannot be empty.");
      return;
    }

    try {
      await proposalsApi.updateProposal(
        editingProposal.id,
        {
          client: formClient.trim(),
          title: formTitle.trim(),
          value: formValue,
          status: formStatus,
          score: parseInt(formScore, 10) || 0,
        },
        token
      );
      setEditingProposal(null);
      refreshCurrentSection();
    } catch (err) {
      alert(err.message || "Failed to update proposal");
    }
  };

  const handleDeleteClick = async () => {
    if (!window.confirm("Are you sure you want to delete this proposal?")) {
      return;
    }

    try {
      await proposalsApi.deleteProposal(editingProposal.id, token);
      setEditingProposal(null);
      refreshCurrentSection();
    } catch (err) {
      alert(err.message || "Failed to delete proposal");
    }
  };

  const handleGenerateDraft = async () => {
    try {
      setActionLoading("draft");
      setError(null);
      const data = await proposalsApi.generateDraft({ brief }, token);
      setDraftResult(data.draft);
    } catch (err) {
      setError(err.message || "Failed to generate draft");
    } finally {
      setActionLoading("");
    }
  };

  const handleImproveWinScore = async () => {
    try {
      setActionLoading("score");
      setError(null);
      const data = await proposalsApi.improveWinScore(
        { brief, currentScore: averageScore || 62 },
        token
      );
      setScoreResult(data);
      setBrief(data.improvedBrief);
    } catch (err) {
      setError(err.message || "Failed to improve win score");
    } finally {
      setActionLoading("");
    }
  };

  const handleApplySuggestion = async () => {
    try {
      setActionLoading("suggestion");
      setError(null);
      const data = await proposalsApi.applySuggestion(
        {
          suggestion:
            "Add a short case study and a clearer payment milestone to lift the proposal score.",
        },
        token
      );
      setAppliedSuggestion(data);
    } catch (err) {
      setError(err.message || "Failed to apply suggestion");
    } finally {
      setActionLoading("");
    }
  };

  const renderStats = () => (
    <section className="stats-grid" aria-label="Proposal metrics">
      {stats.map((stat) => (
        <article className="metric-card" key={stat.label}>
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
          <small>{stat.detail}</small>
        </article>
      ))}
    </section>
  );

  const renderAiBuilder = () => (
    <article className="ai-workbench">
      <div className="section-heading">
        <div>
          <p className="eyebrow">AI proposal builder</p>
          <h2>Turn a client brief into a deal-ready draft.</h2>
        </div>
        <span className="status-pill">API ready</span>
      </div>

      <label htmlFor="brief">Client brief</label>
      <textarea
        id="brief"
        rows="5"
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
      />

      <div className="builder-actions">
        <button
          type="button"
          onClick={handleGenerateDraft}
          disabled={actionLoading === "draft"}
        >
          <span aria-hidden="true">*</span>
          {actionLoading === "draft" ? "Generating..." : "Generate draft"}
        </button>
        <button
          type="button"
          onClick={handleImproveWinScore}
          disabled={actionLoading === "score"}
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
            {draftResult.sections.map((section) => (
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
            {scoreResult.recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );

  const renderIdeas = () => (
    <article className="idea-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Product direction</p>
          <h2>What Proposal Pro AI should become</h2>
        </div>
      </div>

      <ul>
        {ideaItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );

  const renderProposalTable = (title = "Recent proposals") => (
    <article className="proposal-table">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Pipeline</p>
          <h2>{title}</h2>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span>Fetching proposals...</span>
        </div>
      ) : proposals.length === 0 ? (
        <EmptyState>No proposals found. Click New proposal to create one.</EmptyState>
      ) : (
        <div className="proposal-list">
          {proposals.map((proposal) => (
            <div
              className="proposal-row proposal-row-clickable"
              key={proposal.id}
              onClick={() => openEditModal(proposal)}
              title="Click to edit or delete"
            >
              <div>
                <strong>{proposal.client}</strong>
                <span>{proposal.title}</span>
              </div>
              <span>{formatCurrency(proposal.value)}</span>
              <span>{proposal.status}</span>
              <span>{proposal.score}%</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );

  const renderInsight = () => (
    <article className="insight-panel">
      <div>
        <p className="eyebrow">AI insight</p>
        <h2>{appliedSuggestion ? "Suggestion applied" : "Best next move"}</h2>
        <p>
          {appliedSuggestion
            ? appliedSuggestion.updatedInsight
            : "Add a short case study and a clearer payment milestone to lift the Northstar proposal score."}
        </p>
      </div>
      <button
        type="button"
        onClick={handleApplySuggestion}
        disabled={actionLoading === "suggestion"}
      >
        <span aria-hidden="true">+</span>
        {actionLoading === "suggestion" ? "Applying..." : "Apply suggestion"}
      </button>
    </article>
  );

  const renderClients = () => (
    <section className="single-view">
      <article className="proposal-table">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Clients</p>
            <h2>Client proposal activity</h2>
          </div>
        </div>

        {sectionLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span>Fetching clients...</span>
          </div>
        ) : clients.length === 0 ? (
          <EmptyState>Create a proposal to see client activity here.</EmptyState>
        ) : (
          <div className="client-grid">
            {clients.map((client) => (
              <div className="client-card" key={client.client}>
                <strong>{client.client}</strong>
                <span>{client.proposal_count} proposals</span>
                <span>{formatCurrency(client.total_value)} total value</span>
                <small>{client.average_score}% average score</small>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );

  const renderAnalytics = () => {
    const analyticsStats = analytics
      ? [
          {
            label: "Total value",
            value: formatCurrency(analytics.total_value),
            detail: "All proposals",
          },
          {
            label: "Average score",
            value: `${analytics.average_score}%`,
            detail: "Win readiness",
          },
          {
            label: "Sent rate",
            value: `${analytics.win_rate}%`,
            detail: "Sent proposals",
          },
        ]
      : [];

    return (
      <section className="single-view">
        {sectionLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span>Fetching analytics...</span>
          </div>
        ) : !analytics ? (
          <EmptyState>Analytics will appear after your proposals load.</EmptyState>
        ) : (
          <>
            <section className="stats-grid" aria-label="Analytics metrics">
              {analyticsStats.map((stat) => (
                <article className="metric-card" key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                  <small>{stat.detail}</small>
                </article>
              ))}
            </section>

            <article className="proposal-table">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Status breakdown</p>
                  <h2>Proposal movement</h2>
                </div>
              </div>
              <div className="analytics-list">
                {analytics.status_breakdown.map((item) => (
                  <div key={item.status}>
                    <span>{item.status}</span>
                    <strong>{item.count}</strong>
                  </div>
                ))}
              </div>
            </article>
          </>
        )}
      </section>
    );
  };

  const renderSection = () => {
    if (activeSection === "AI Builder") {
      return (
        <section className="dashboard-grid ai-builder-view">
          {renderAiBuilder()}
          {renderIdeas()}
          {renderInsight()}
        </section>
      );
    }

    if (activeSection === "Proposals") {
      return (
        <section className="single-view">
          {renderProposalTable("All proposals")}
        </section>
      );
    }

    if (activeSection === "Clients") {
      return renderClients();
    }

    if (activeSection === "Analytics") {
      return renderAnalytics();
    }

    return (
      <>
        {renderStats()}
        <section className="dashboard-grid">
          {renderAiBuilder()}
          {renderIdeas()}
          {renderProposalTable()}
          {renderInsight()}
        </section>
      </>
    );
  };

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark" aria-hidden="true">
            PP
          </div>
          <div>
            <strong>ProposalPro</strong>
            <span>AI Workspace</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          {navItems.map((item) => (
            <button
              type="button"
              className={activeSection === item ? "is-active" : ""}
              key={item}
              aria-label={item}
              aria-current={activeSection === item ? "page" : undefined}
              onClick={() => handleSectionChange(item)}
            >
              <DashboardIcon type={item} />
              <span>{item}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-account">
          <div>
            <span>{user?.name}</span>
            <small>{user?.email}</small>
          </div>
          <button type="button" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </aside>

      <section className="dashboard-main">
        {error && (
          <div className="error-bar">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)}>
              &times;
            </button>
          </div>
        )}

        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Proposal Pro AI</p>
            <h1>
              {activeSection === "Overview"
                ? `Welcome back, ${firstName}`
                : activeSection}
            </h1>
            <p>
              Create professional, winning proposals in minutes instead of days.
            </p>
          </div>
          <button
            type="button"
            className="new-proposal-button"
            onClick={openCreateModal}
          >
            <span aria-hidden="true">+</span>
            New proposal
          </button>
        </header>

        {renderSection()}
      </section>

      {isCreateOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Proposal</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCreateOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateSubmit}>
                <div className="form-group">
                  <label htmlFor="client">Client Name</label>
                  <input
                    type="text"
                    id="client"
                    placeholder="e.g. Northstar Studios"
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="title">Proposal Title</label>
                  <input
                    type="text"
                    id="title"
                    placeholder="e.g. Brand refresh and launch plan"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="value">Estimated Value ($)</label>
                  <input
                    type="text"
                    id="value"
                    placeholder="e.g. $18,400"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Review">Review</option>
                    <option value="Sent">Sent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="score">Win Score (%)</label>
                  <input
                    type="number"
                    id="score"
                    min="0"
                    max="100"
                    placeholder="e.g. 85"
                    value={formScore}
                    onChange={(e) => setFormScore(e.target.value)}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="new-proposal-button">
                    Create Proposal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {editingProposal && (
        <div
          className="modal-overlay"
          onClick={() => setEditingProposal(null)}
        >
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Proposal</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingProposal(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateSubmit}>
                <div className="form-group">
                  <label htmlFor="edit-client">Client Name</label>
                  <input
                    type="text"
                    id="edit-client"
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-title">Proposal Title</label>
                  <input
                    type="text"
                    id="edit-title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-value">Estimated Value ($)</label>
                  <input
                    type="text"
                    id="edit-value"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-status">Status</label>
                  <select
                    id="edit-status"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Review">Review</option>
                    <option value="Sent">Sent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-score">Win Score (%)</label>
                  <input
                    type="number"
                    id="edit-score"
                    min="0"
                    max="100"
                    value={formScore}
                    onChange={(e) => setFormScore(e.target.value)}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setEditingProposal(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="new-proposal-button">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;

import { useState, useEffect } from "react";
import proposalsApi from "../../api/proposals";

const navItems = ["Overview", "AI Builder", "Proposals", "Clients", "Analytics"];

const ideaItems = [
  "AI creates a polished first draft from a short client brief.",
  "Proposal scoring highlights weak pricing, scope, and proof sections.",
  "Reusable service packs help freelancers and agencies quote faster.",
];

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

const Dashboard = ({ user, token, onSignOut }) => {
  const firstName = user?.name?.split(" ")[0] || "there";

  // Data State
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals & Form State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState(null);

  const [formClient, setFormClient] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formStatus, setFormStatus] = useState("Draft");
  const [formScore, setFormScore] = useState("0");

  // Fetch Proposals
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

  useEffect(() => {
    if (token) {
      fetchProposals();
    }
  }, [token]);

  // Dynamic Statistics Calculations
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

  // Currency Formatter
  const formatCurrency = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Open Create Form Modal
  const openCreateModal = () => {
    setFormClient("");
    setFormTitle("");
    setFormValue("");
    setFormStatus("Draft");
    setFormScore("0");
    setIsCreateOpen(true);
  };

  // Open Edit Form Modal
  const openEditModal = (proposal) => {
    setEditingProposal(proposal);
    setFormClient(proposal.client);
    setFormTitle(proposal.title);
    setFormValue(String(proposal.value));
    setFormStatus(proposal.status);
    setFormScore(String(proposal.score));
  };

  // Form Submit: Create Proposal
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
      fetchProposals();
    } catch (err) {
      alert(err.message || "Failed to create proposal");
    }
  };

  // Form Submit: Update Proposal
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
      fetchProposals();
    } catch (err) {
      alert(err.message || "Failed to update proposal");
    }
  };

  // Action: Delete Proposal
  const handleDeleteClick = async () => {
    if (!window.confirm("Are you sure you want to delete this proposal?")) {
      return;
    }

    try {
      await proposalsApi.deleteProposal(editingProposal.id, token);
      setEditingProposal(null);
      fetchProposals();
    } catch (err) {
      alert(err.message || "Failed to delete proposal");
    }
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
          {navItems.map((item, index) => (
            <button
              type="button"
              className={index === 0 ? "is-active" : ""}
              key={item}
              aria-label={item}
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
            <h1>Welcome back, {firstName}</h1>
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

        <section className="stats-grid" aria-label="Proposal metrics">
          {stats.map((stat) => (
            <article className="metric-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.detail}</small>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="ai-workbench">
            <div className="section-heading">
              <div>
                <p className="eyebrow">AI proposal builder</p>
                <h2>Turn a client brief into a deal-ready draft.</h2>
              </div>
              <span className="status-pill">Live brief</span>
            </div>

            <label htmlFor="brief">Client brief</label>
            <textarea
              id="brief"
              rows="5"
              defaultValue="Website redesign for a growing SaaS team. Include discovery, UX, implementation, timeline, pricing, and proof points."
            />

            <div className="builder-actions">
              <button type="button">
                <span aria-hidden="true">*</span>
                Generate draft
              </button>
              <button type="button">
                <span aria-hidden="true">^</span>
                Improve win score
              </button>
            </div>
          </article>

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

          <article className="proposal-table">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Pipeline</p>
                <h2>Recent proposals</h2>
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <span>Fetching proposals...</span>
              </div>
            ) : proposals.length === 0 ? (
              <div
                style={{
                  padding: "36px 0",
                  textAlign: "center",
                  color: "var(--text-muted)",
                }}
              >
                No proposals found. Click &quot;New proposal&quot; above to create one.
              </div>
            ) : (
              <div className="proposal-list">
                {proposals.map((proposal) => (
                  <div
                    className="proposal-row proposal-row-clickable"
                    key={proposal.id}
                    onClick={() => openEditModal(proposal)}
                    title="Click to Edit or Delete"
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

          <article className="insight-panel">
            <div>
              <p className="eyebrow">AI insight</p>
              <h2>Best next move</h2>
              <p>
                Add a short case study and a clearer payment milestone to lift
                the Northstar proposal score.
              </p>
            </div>
            <button type="button">
              <span aria-hidden="true">+</span>
              Apply suggestion
            </button>
          </article>
        </section>
      </section>

      {/* CREATE PROPOSAL MODAL */}
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

      {/* EDIT/DELETE PROPOSAL MODAL */}
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

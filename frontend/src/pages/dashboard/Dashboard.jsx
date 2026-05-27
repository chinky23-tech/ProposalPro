const stats = [
  { label: 'Drafts in review', value: '12', detail: '+4 this week' },
  { label: 'Win-ready score', value: '86%', detail: 'Across active proposals' },
  { label: 'Average draft time', value: '9m', detail: 'Down from 2.4 days' },
]

const proposalRows = [
  {
    client: 'Northstar Studios',
    title: 'Brand refresh and launch plan',
    value: '$18,400',
    status: 'Review',
    score: '91%',
  },
  {
    client: 'BrightPath SaaS',
    title: 'Customer onboarding automation',
    value: '$32,000',
    status: 'Draft',
    score: '78%',
  },
  {
    client: 'Apex Interiors',
    title: 'Website redesign proposal',
    value: '$11,800',
    status: 'Sent',
    score: '88%',
  },
]

const navItems = ['Overview', 'AI Builder', 'Proposals', 'Clients', 'Analytics']

const ideaItems = [
  'AI creates a polished first draft from a short client brief.',
  'Proposal scoring highlights weak pricing, scope, and proof sections.',
  'Reusable service packs help freelancers and agencies quote faster.',
]

const DashboardIcon = ({ type }) => {
  const paths = {
    Overview: 'M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-4H4v4Z',
    'AI Builder': 'M12 3 14 8l5 2-5 2-2 5-2-5-5-2 5-2 2-5Z',
    Proposals: 'M6 3h9l3 3v15H6V3Zm8 1v4h4',
    Clients: 'M8 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm8 1a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM2 21a6 6 0 0 1 12 0H2Zm11.5 0a5 5 0 0 1 8.5-3.5V21h-8.5Z',
    Analytics: 'M4 19V5m0 14h16M8 15v-4m4 4V7m4 8v-6',
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[type]} />
    </svg>
  )
}

const Dashboard = ({ user, onSignOut }) => {
  const firstName = user?.name?.split(' ')[0] || 'there'

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
              className={index === 0 ? 'is-active' : ''}
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
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Proposal Pro AI</p>
            <h1>Welcome back, {firstName}</h1>
            <p>
              Create professional, winning proposals in minutes instead of days.
            </p>
          </div>
          <button type="button" className="new-proposal-button">
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

            <div className="proposal-list">
              {proposalRows.map((proposal) => (
                <div className="proposal-row" key={proposal.client}>
                  <div>
                    <strong>{proposal.client}</strong>
                    <span>{proposal.title}</span>
                  </div>
                  <span>{proposal.value}</span>
                  <span>{proposal.status}</span>
                  <span>{proposal.score}</span>
                </div>
              ))}
            </div>
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
    </main>
  )
}

export default Dashboard

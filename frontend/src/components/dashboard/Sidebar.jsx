import DashboardIcon from "./DashboardIcon";

const dashboardNavItems = [
  "Overview",
  "AI Builder",
  "Proposals",
  "Clients",
  "Analytics",
];

const Sidebar = ({ user, activeSection, onSectionChange, onSignOut }) => (
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
      {dashboardNavItems.map((item) => (
        <button
          type="button"
          className={activeSection === item ? "is-active" : ""}
          key={item}
          aria-label={item}
          aria-current={activeSection === item ? "page" : undefined}
          onClick={() => onSectionChange(item)}
        >
          <DashboardIcon type={item} />
          <span>{item}</span>
        </button>
      ))}
    </nav>

    <div className="sidebar-account">
      <div>
        <span>{user?.name || "Account"}</span>
        <small>{user?.email || ""}</small>
      </div>
      <button type="button" onClick={onSignOut}>
        Sign out
      </button>
    </div>
  </aside>
);

export default Sidebar;

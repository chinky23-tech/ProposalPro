const DashboardHeader = ({ activeSection, user, onNewProposal }) => {
  const firstName = user?.name?.split(" ")[0] || "there";
  const title =
    activeSection === "Overview" ? `Welcome back, ${firstName}` : activeSection;

  return (
    <header className="dashboard-header">
      <div>
        <p className="eyebrow">Proposal Pro AI</p>
        <h1>{title}</h1>
        <p>Create professional, winning proposals in minutes instead of days.</p>
      </div>
      <button
        type="button"
        className="new-proposal-button"
        onClick={onNewProposal}
      >
        <span aria-hidden="true">+</span>
        New proposal
      </button>
    </header>
  );
};

export default DashboardHeader;

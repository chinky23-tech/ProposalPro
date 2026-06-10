import { useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import ProposalModal from "../../components/dashboard/ProposalModal";
import Sidebar from "../../components/dashboard/Sidebar";
import AiBuilder from "./views/AiBuilder";
import Analytics from "./views/Analytics";
import Clients from "./views/Clients";
import Overview from "./views/Overview";
import Proposals from "./views/Proposals";

const Dashboard = ({ user, token, onSignOut }) => {
  const [activeSection, setActiveSection] = useState("Overview");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshDashboardData = () => {
    setRefreshKey((current) => current + 1);
  };

  const renderSection = () => {
    if (activeSection === "AI Builder") {
      return <AiBuilder token={token} />;
    }

    if (activeSection === "Proposals") {
      return (
        <Proposals
          token={token}
          refreshKey={refreshKey}
          onEditProposal={setEditingProposal}
        />
      );
    }

    if (activeSection === "Clients") {
      return <Clients token={token} refreshKey={refreshKey} />;
    }

    if (activeSection === "Analytics") {
      return <Analytics token={token} refreshKey={refreshKey} />;
    }

    return (
      <Overview
        token={token}
        refreshKey={refreshKey}
        onEditProposal={setEditingProposal}
      />
    );
  };

  return (
    <main className="dashboard-shell">
      <Sidebar
        user={user}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onSignOut={onSignOut}
      />

      <section className="dashboard-main">
        <DashboardHeader
          activeSection={activeSection}
          user={user}
          onNewProposal={() => setIsCreateOpen(true)}
        />

        {renderSection()}
      </section>

      {isCreateOpen && (
        <ProposalModal
          key="create-proposal"
          token={token}
          onClose={() => setIsCreateOpen(false)}
          onSaved={refreshDashboardData}
        />
      )}

      {editingProposal && (
        <ProposalModal
          key={`edit-proposal-${editingProposal.id}`}
          proposal={editingProposal}
          token={token}
          onClose={() => setEditingProposal(null)}
          onSaved={refreshDashboardData}
        />
      )}
    </main>
  );
};

export default Dashboard;

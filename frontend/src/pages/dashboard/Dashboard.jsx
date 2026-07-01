import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import Overview from "./views/Overview";
import AIBuilder from "./views/AIBuilder";
import Proposals from "./views/Proposals";
import Templates from "./views/Templates";
import Packages from "./views/Packages";
import Documents from "./views/Documents";
import Clients from "./views/Clients";
import Analytics from "./views/Analytics";
import Team from "./views/Team";
import Billing from "./views/Billing";
import Settings from "./views/Settings";

export default function Dashboard() {
return ( <DashboardLayout> <Routes>
<Route
index
element={<Overview />}
/>


    <Route
      path="ai-builder"
      element={<AIBuilder />}
    />

    <Route
      path="proposals"
      element={<Proposals />}
    />

    <Route
      path="templates"
      element={<Templates />}
    />

    <Route
      path="packages"
      element={<Packages />}
    />

    <Route
      path="documents"
      element={<Documents />}
    />

    <Route
      path="clients"
      element={<Clients />}
    />

    <Route
      path="analytics"
      element={<Analytics />}
    />

    <Route
      path="team"
      element={<Team />}
    />

    <Route
      path="billing"
      element={<Billing />}
    />

    <Route
      path="settings"
      element={<Settings />}
    />

    <Route
      path="*"
      element={<Navigate to="/dashboard" replace />}
    />
  </Routes>
</DashboardLayout>


);
}

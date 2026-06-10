import { useEffect, useMemo, useState } from "react";
import proposalsApi from "../../../api/proposals";
import ErrorBar from "../../../components/dashboard/ErrorBar";
import ProposalList from "../../../components/dashboard/ProposalList";
import StatsGrid from "../../../components/dashboard/StatsGrid";
import { formatCurrency } from "../../../utils/formatters";

const Overview = ({ token, refreshKey, onEditProposal }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadProposals = async () => {
      try {
        const data = await proposalsApi.getProposals(token);

        if (!isCurrent) {
          return;
        }

        setProposals(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        if (isCurrent) {
          setError(err.message || "Failed to load proposals.");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    if (token) {
      loadProposals();
    }

    return () => {
      isCurrent = false;
    };
  }, [token, refreshKey]);

  const stats = useMemo(() => {
    const totalValue = proposals.reduce(
      (total, proposal) => total + (Number.parseFloat(proposal.value) || 0),
      0
    );
    const totalScore = proposals.reduce(
      (total, proposal) => total + (Number.parseInt(proposal.score, 10) || 0),
      0
    );
    const averageScore =
      proposals.length > 0 ? Math.round(totalScore / proposals.length) : 0;

    return [
      {
        label: "Total proposals",
        value: String(proposals.length),
        detail: "From your database",
      },
      {
        label: "Pipeline value",
        value: formatCurrency(totalValue),
        detail: "Open proposal value",
      },
      {
        label: "Win-ready score",
        value: `${averageScore}%`,
        detail: "Across active proposals",
      },
    ];
  }, [proposals]);

  return (
    <>
      <ErrorBar message={error} onDismiss={() => setError("")} />
      <StatsGrid stats={stats} label="Proposal metrics" />
      <section className="single-view">
        <ProposalList
          proposals={proposals}
          isLoading={loading}
          onEditProposal={onEditProposal}
        />
      </section>
    </>
  );
};

export default Overview;

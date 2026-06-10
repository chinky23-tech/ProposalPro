import { useEffect, useState } from "react";
import proposalsApi from "../../../api/proposals";
import ErrorBar from "../../../components/dashboard/ErrorBar";
import ProposalList from "../../../components/dashboard/ProposalList";

const Proposals = ({ token, refreshKey, onEditProposal }) => {
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

  return (
    <section className="single-view">
      <ErrorBar message={error} onDismiss={() => setError("")} />
      <ProposalList
        title="All proposals"
        proposals={proposals}
        isLoading={loading}
        onEditProposal={onEditProposal}
      />
    </section>
  );
};

export default Proposals;

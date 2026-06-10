import { useEffect, useState } from "react";
import clientsApi from "../../../api/clients";
import EmptyState from "../../../components/dashboard/EmptyState";
import ErrorBar from "../../../components/dashboard/ErrorBar";
import LoadingState from "../../../components/dashboard/LoadingState";
import { formatCurrency } from "../../../utils/formatters";

const Clients = ({ token, refreshKey }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadClients = async () => {
      try {
        const data = await clientsApi.getClients(token);

        if (!isCurrent) {
          return;
        }

        setClients(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        if (isCurrent) {
          setError(err.message || "Failed to load clients.");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    if (token) {
      loadClients();
    }

    return () => {
      isCurrent = false;
    };
  }, [token, refreshKey]);

  return (
    <section className="single-view">
      <ErrorBar message={error} onDismiss={() => setError("")} />
      <article className="proposal-table">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Clients</p>
            <h2>Client proposal activity</h2>
          </div>
        </div>

        {loading ? (
          <LoadingState message="Fetching clients..." />
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
};

export default Clients;

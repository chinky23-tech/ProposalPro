import { formatCurrency } from "../../utils/formatters";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";

const ProposalList = ({
  title = "Recent proposals",
  proposals = [],
  isLoading = false,
  loadingMessage = "Fetching proposals...",
  emptyMessage = "No proposals found. Click New proposal to create one.",
  onEditProposal,
}) => {
  const handleKeyDown = (event, proposal) => {
    if (!onEditProposal) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onEditProposal(proposal);
    }
  };

  return (
    <article className="proposal-table">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Pipeline</p>
          <h2>{title}</h2>
        </div>
      </div>

      {isLoading ? (
        <LoadingState message={loadingMessage} />
      ) : proposals.length === 0 ? (
        <EmptyState>{emptyMessage}</EmptyState>
      ) : (
        <div className="proposal-list">
          {proposals.map((proposal) => (
            <div
              className={`proposal-row ${
                onEditProposal ? "proposal-row-clickable" : ""
              }`}
              key={proposal.id}
              onClick={() => onEditProposal?.(proposal)}
              onKeyDown={(event) => handleKeyDown(event, proposal)}
              role={onEditProposal ? "button" : undefined}
              tabIndex={onEditProposal ? 0 : undefined}
              title={onEditProposal ? "Click to edit or delete" : undefined}
            >
              <div>
                <strong>{proposal.client}</strong>
                <span>{proposal.title}</span>
              </div>
              <span>{formatCurrency(proposal.value)}</span>
              <span>{proposal.status}</span>
              <span>{proposal.score ?? 0}%</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
};

export default ProposalList;

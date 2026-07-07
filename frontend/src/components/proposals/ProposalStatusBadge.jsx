export default function ProposalStatusBadge({
  status,
}) {
  const statusStyles = {
    Draft:
      "bg-slate-500/10 text-slate-400 border border-slate-500/20",

    Review:
      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",

    Sent:
      "bg-blue-500/10 text-blue-400 border border-blue-500/20",

    Viewed:
      "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",

    Accepted:
      "bg-green-500/10 text-green-400 border border-green-500/20",

    Rejected:
      "bg-red-500/10 text-red-400 border border-red-500/20",

    Won:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",

    Lost:
      "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-medium
        ${
          statusStyles[status] ||
          "bg-slate-500/10 text-slate-400 border border-slate-500/20"
        }
      `}
    >
      {status}
    </span>
  );
}
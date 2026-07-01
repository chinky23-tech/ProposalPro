export default function KpiCard({
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-emerald-900/20 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-white">
        {value}
      </h2>
    </div>
  );
}
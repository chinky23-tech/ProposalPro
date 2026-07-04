import { Search, Plus } from "lucide-react";

export default function ProposalToolbar({
  search,
  setSearch,
  status,
  setStatus,
  onCreate,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div className="flex flex-col md:flex-row gap-3">

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

          <input
            type="text"
            placeholder="Search proposals..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="pl-10 pr-4 py-2.5 w-72 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="All">
            All Statuses
          </option>

          <option value="Draft">
            Draft
          </option>

          <option value="Review">
            Review
          </option>

          <option value="Sent">
            Sent
          </option>

          <option value="Viewed">
            Viewed
          </option>

          <option value="Won">
            Won
          </option>

          <option value="Lost">
            Lost
          </option>
        </select>
      </div>

      {/* Create Button */}
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
      >
        <Plus className="w-4 h-4" />

        New Proposal
      </button>
    </div>
  );
}
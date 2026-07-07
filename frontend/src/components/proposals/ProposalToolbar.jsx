import { Search, Plus } from "lucide-react";
import Select from "../ui/Select";
import Input from "../ui/Input";
import Button from "../ui/Button";
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
      <Select
  value={status}
  onChange={(e) =>
    setStatus(e.target.value)
  }
  options={[
    {
      value: "All",
      label: "All Statuses",
    },
    {
      value: "Draft",
      label: "Draft",
    },
    {
      value: "Review",
      label: "Review",
    },
    {
      value: "Sent",
      label: "Sent",
    },
    {
      value: "Viewed",
      label: "Viewed",
    },
    {
      value: "Won",
      label: "Won",
    },
    {
      value: "Lost",
      label: "Lost",
    },
  ]}
/>
      
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
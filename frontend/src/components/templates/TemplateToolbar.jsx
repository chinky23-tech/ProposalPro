import {
  Search,
  Plus,
} from "lucide-react";

import Input from "../ui/Input";
import Button from "../ui/Button";

export default function TemplateToolbar({
  search,
  setSearch,
  onCreate,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="w-full md:max-w-md">
        <Input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search templates..."
        />
      </div>

      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        New Template
      </Button>
    </div>
  );
}
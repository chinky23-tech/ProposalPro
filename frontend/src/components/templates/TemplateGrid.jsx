import TemplateCard from "./TemplateCard";
import TemplateEmptyState from "./TemplateEmptyState";

export default function TemplateGrid({
  templates,
  onEdit,
  onDelete,
  onDuplicate,
  onUse,
  onCreate,
}) {
  if (
    !templates ||
    templates.length === 0
  ) {
    return (
      <TemplateEmptyState
        onCreate={onCreate}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {templates.map(
        (template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onUse={onUse}
          />
        )
      )}
    </div>
  );
}
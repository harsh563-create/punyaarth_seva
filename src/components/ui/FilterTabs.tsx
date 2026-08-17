interface FilterTabsProps {
  filters: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}

export default function FilterTabs({ filters, active, onChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 cursor-pointer ${
            active === filter.id
              ? 'bg-forest text-text-on-dark shadow-md'
              : 'bg-white text-text-muted hover:text-forest hover:bg-cream-dark border border-beige-dark'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

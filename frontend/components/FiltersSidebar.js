export default function FiltersSidebar({
  filters,
  setFilters,
  onApply,
  onReset,
}) {
  const updateFilter = (key, value) => {
    if (!setFilters) return;
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const toggleOptions = [
    { key: "fastWifi", label: "Fast WiFi" },
    { key: "studyFriendly", label: "Study-friendly" },
    { key: "quiet", label: "Quiet atmosphere" },
    { key: "familyFriendly", label: "Family-friendly" },
    { key: "outdoorSeating", label: "Outdoor seating" },
    { key: "airConditioning", label: "Air conditioning" },
    { key: "openNow", label: "Open now" },
  ];

  return (
    <aside className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-[0_20px_60px_rgba(74,48,33,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1b1410]/80 dark:text-white lg:sticky lg:top-28 lg:max-h-[calc(100vh-7rem)] lg:overflow-auto">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-300">
            Filters
          </p>
          <h4 className="text-lg font-semibold">Refine your search</h4>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-amber-700 transition hover:text-amber-900 dark:text-amber-300"
        >
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Minimum rating
          </label>
          <select
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            value={filters?.minRating || ""}
            onChange={(event) => updateFilter("minRating", event.target.value)}
          >
            <option value="">Any rating</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
            <option value="4.7">4.7+</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Price range
          </label>
          <select
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            value={filters?.maxPrice || ""}
            onChange={(event) => updateFilter("maxPrice", event.target.value)}
          >
            <option value="">Any price</option>
            <option value="1">Budget</option>
            <option value="2">Moderate</option>
            <option value="3">Premium</option>
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {toggleOptions.map((option) => (
            <label
              key={option.key}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-amber-50/60 px-4 py-3 text-sm font-medium transition hover:border-amber-300 dark:border-white/10 dark:bg-white/5"
            >
              <input
                type="checkbox"
                checked={Boolean(filters?.[option.key])}
                onChange={(event) =>
                  updateFilter(option.key, event.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-400"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={onApply}
          className="w-full rounded-2xl bg-gradient-to-r from-[#3b2f2f] to-[#5a4032] px-4 py-3 font-semibold text-white shadow-lg shadow-black/10 transition hover:translate-y-[-1px] focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          Apply filters
        </button>
      </div>
    </aside>
  );
}

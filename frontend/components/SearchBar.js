export default function SearchBar({
  value = '',
  onChange,
  onSearch,
  loading = false,
  placeholder = 'Search by cafe name, neighborhood, or vibe',
  buttonLabel = 'Search cafes'
}) {
  const submit = (event) => {
    event.preventDefault()
    if (onSearch) onSearch(value)
  }

  return (
    <form className="mx-auto flex w-full max-w-3xl flex-col gap-3 sm:flex-row" onSubmit={submit}>
      <input
        className="flex-1 rounded-2xl border border-white/20 bg-white/95 px-5 py-4 text-base text-gray-900 shadow-xl shadow-black/10 outline-none transition placeholder:text-gray-500 focus:border-amber-400 focus:ring-4 focus:ring-amber-200/50"
        placeholder={`🔍 ${placeholder}`}
        value={value}
        onChange={(event) => onChange && onChange(event.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 px-6 py-4 font-semibold text-[#241713] shadow-xl shadow-orange-950/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Searching...' : buttonLabel}
      </button>
    </form>
  )
}

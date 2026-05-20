export default function SearchBar({ value, onChange, onSearch }){
  const submit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form className="mt-4 flex gap-2" onSubmit={submit}>
      <input
        className="w-full md:w-96 p-3 rounded shadow text-black"
        placeholder="Search cafes by name, tag or location"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
      <button className="px-4 py-2 rounded bg-warm text-white">Search</button>
    </form>
  )
}

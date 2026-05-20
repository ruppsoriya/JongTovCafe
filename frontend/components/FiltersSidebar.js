export default function FiltersSidebar(){
  return (
    <aside className="p-4 bg-white rounded shadow">
      <h4 className="font-semibold mb-2">Filters</h4>
      <div className="space-y-2">
        <select className="w-full p-2 border rounded">
          <option>Sort by: Recommended</option>
        </select>
        <label className="flex items-center space-x-2"><input type="checkbox" /> <span>Fast WiFi</span></label>
        <label className="flex items-center space-x-2"><input type="checkbox" /> <span>Quiet</span></label>
      </div>
    </aside>
  )
}

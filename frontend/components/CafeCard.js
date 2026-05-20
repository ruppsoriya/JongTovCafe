import Link from 'next/link'

export default function CafeCard({ cafe }){
  const id = cafe.id || cafe._id

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <div className="h-40 bg-gray-200 flex items-center justify-center">{cafe.images && cafe.images[0] ? <img src={cafe.images[0]} alt="" className="h-full w-full object-cover" /> : <span className="text-gray-500">No Image</span>}</div>
      <div className="p-4">
        <h3 className="font-semibold">{cafe.name}</h3>
        <div className="text-sm text-gray-600">{cafe.location?.address || '—'}</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm">Rating: {cafe.rating}</div>
          <Link href={`/cafe/${id}`}><a className="text-sm text-warm">View</a></Link>
        </div>
      </div>
    </div>
  )
}

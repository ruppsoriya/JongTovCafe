export default function RatingStars({ rating = 0 }) {
  const filled = Math.round(Number(rating) || 0)

  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < filled ? 'text-amber-500' : 'text-amber-200'}>
          ★
        </span>
      ))}
      <span className="ml-1 text-xs font-semibold text-gray-600 dark:text-gray-300">{Number(rating || 0).toFixed(1)}</span>
    </div>
  )
}
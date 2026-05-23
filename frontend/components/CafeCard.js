import Link from 'next/link'
import { API_BASE } from '../lib/api'
import RatingStars from './RatingStars'
import { resolveCafeImageSource } from '../lib/image'

export default function CafeCard({ cafe }) {
  const id = cafe.id || cafe._id
  const priceLevel = '💵'.repeat(cafe.priceLevel || 1)
  const wifiIcon = cafe.wifiSpeed >= 70 ? '📶' : cafe.wifiSpeed > 0 ? '📡' : '☕'
  const nameValue = cafe.name || 'Cafe'
  const colors = ['from-amber-400 to-orange-500', 'from-yellow-300 to-amber-500', 'from-orange-400 to-red-400', 'from-red-400 to-pink-400']
  const colorIndex = Math.abs(nameValue.charCodeAt(0) || 0) % colors.length
  const bgGradient = colors[colorIndex]

  const escapeHtml = (value) => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const makePlaceholder = (title) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='480'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='%23f59e0b'/><stop offset='1' stop-color='%23fb923c'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><text x='50%' y='44%' dominant-baseline='middle' text-anchor='middle' font-size='72' fill='white'>☕</text><text x='50%' y='68%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='white'>${escapeHtml(title)}</text></svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }

  const imageSrc = resolveCafeImageSource(cafe, API_BASE)
  const tags = (cafe.highlights && cafe.highlights.length ? cafe.highlights : cafe.tags || []).slice(0, 3)
  const facilities = (cafe.facilities || []).slice(0, 2)
  const isOpen = cafe.isOpen !== false

  return (
    <Link href={`/cafe/${id}`} className="group block h-full focus:outline-none">
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_18px_50px_rgba(74,48,33,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(74,48,33,0.18)] group-focus-visible:ring-2 group-focus-visible:ring-amber-300 dark:border-white/10 dark:bg-[#1b1410]/90">
        <div className={`relative h-56 overflow-hidden bg-gradient-to-br ${bgGradient}`}>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={nameValue}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = makePlaceholder(nameValue)
                event.currentTarget.style.objectFit = 'cover'
                event.currentTarget.style.objectPosition = 'center'
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-7xl text-white">☕</div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#140f0d]/70 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isOpen ? 'bg-emerald-500/90 text-white' : 'bg-white/90 text-gray-900'}`}>
              {isOpen ? 'Open now' : 'Closed'}
            </span>
            {cafe.rating >= 4.5 && <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900">Top rated</span>}
          </div>
          <div className="absolute bottom-4 right-4 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-[#261915] shadow-lg">
            <RatingStars rating={cafe.rating || 0} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div>
            <div className="mb-2 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-[#221815] dark:text-white">{nameValue}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{cafe.location?.address || 'Phnom Penh'}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900 dark:bg-white/5 dark:text-amber-200">
                {priceLevel || '💵'}
              </div>
            </div>

            <p className="line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {cafe.description || 'A coffee stop curated for study sessions, remote work, or easy meetups.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-white/10 dark:text-amber-100">
                {tag}
              </span>
            ))}
            {!tags.length && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">Coffee stop</span>}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="rounded-2xl bg-[#faf4ee] px-3 py-2 dark:bg-white/5">{wifiIcon} WiFi {cafe.wifiSpeed || 0}</div>
            <div className="rounded-2xl bg-[#faf4ee] px-3 py-2 dark:bg-white/5">⭐ {Number(cafe.rating || 0).toFixed(1)}</div>
          </div>

          <div className="mt-auto flex flex-wrap gap-2">
            {facilities.map((facility) => (
              <span key={facility} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 dark:border-white/10 dark:bg-white/5 dark:text-amber-100">
                {facility}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
}
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CafeCard from '../../components/CafeCard'
import RatingStars from '../../components/RatingStars'
import { api, API_BASE } from '../../lib/api'
import { resolveCafeImageSource } from '../../lib/image'
import { useAuth } from '../../context/AuthContext'
import { getLocalCafeById } from '../../lib/localCafes'

function MenuPreview({ cafe }) {
  const items = useMemo(() => {
    const tags = Array.isArray(cafe?.tags) ? cafe.tags : []
    const facilities = Array.isArray(cafe?.facilities) ? cafe.facilities : []
    const source = [...tags, ...facilities]
    if (!source.length) {
      return ['Americano', 'Latte', 'Chocolate Croissant', 'Iced Tea']
    }
    return source.slice(0, 4).map((item) => String(item).replace(/-/g, ' '))
  }, [cafe])

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <div key={index} className="rounded-2xl border border-white/60 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="text-sm font-semibold text-[#221815] dark:text-white">{item}</div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-300">Popular menu preview</div>
        </div>
      ))}
    </div>
  )
}

export default function CafeDetail({ cafe }) {
  const { user } = useAuth()
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [reviews, setReviews] = useState(cafe?.Reviews || [])
  const [currentImage, setCurrentImage] = useState(0)
  const [similarCafes, setSimilarCafes] = useState([])
  const [similarLoading, setSimilarLoading] = useState(true)

  useEffect(() => {
    const loadSimilar = async () => {
      if (!cafe) return
      setSimilarLoading(true)
      try {
        const prefs = {
          tags: cafe.tags || [],
          minRating: Number(cafe.rating || 0) - 0.3,
          pricePref: cafe.priceLevel || 2,
          fastWifi: Number(cafe.wifiSpeed || 0) >= 70,
          studyFriendly: (cafe.tags || []).some((tag) => /study/i.test(tag))
        }
        const { data } = await api.get('/cafes/recommend', { params: { prefs: JSON.stringify(prefs) } })
        setSimilarCafes((Array.isArray(data) ? data : []).filter((item) => String(item.id) !== String(cafe.id || cafe._id)).slice(0, 3))
      } catch (error) {
        setSimilarCafes([])
      } finally {
        setSimilarLoading(false)
      }
    }

    loadSimilar()
  }, [cafe])

  if (!cafe) {
    return <div className="min-h-screen bg-cream p-8 text-coffee">Loading...</div>
  }

  const cafeId = cafe.id || cafe._id
  const images = (Array.isArray(cafe.images) ? cafe.images : [])
    .map((image) => resolveCafeImageSource({ images: [image], name: cafe.name, location: cafe.location }, API_BASE))
    .filter(Boolean)
    .slice(0, 5)
  const currentImageSrc = images[currentImage] || images[0]
  const mapSrc = cafe?.location?.coords
    ? `https://www.google.com/maps?q=${cafe.location.coords.lat},${cafe.location.coords.lng}&z=15&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(cafe?.location?.address || cafe.name)}&z=15&output=embed`

  const escapeHtml = (value) => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const makePlaceholder = (title) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='720'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='%23f59e0b'/><stop offset='1' stop-color='%23fb923c'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><text x='50%' y='44%' dominant-baseline='middle' text-anchor='middle' font-size='92' fill='white'>☕</text><text x='50%' y='68%' dominant-baseline='middle' text-anchor='middle' font-size='34' fill='white'>${escapeHtml(title)}</text></svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }

  const addFavorite = async () => {
    if (!user) return setMessage('Please login to save favorites.')
    try {
      await api.post(`/auth/favorites/${cafeId}`)
      setMessage('Cafe added to favorites.')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save favorite.')
    }
  }

  const submitReview = async (event) => {
    event.preventDefault()
    if (!user) return setMessage('Please login to submit a review.')
    try {
      await api.post('/reviews', { cafeId, rating: Number(rating), text: reviewText })
      const { data } = await api.get(`/reviews/cafe/${cafeId}`)
      setReviews(data)
      setMessage('Review submitted.')
      setReviewText('')
      setRating(5)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not submit review.')
    }
  }

  const openingEntries = cafe.openingHours && typeof cafe.openingHours === 'object' ? Object.entries(cafe.openingHours) : []

  return (
    <div className="min-h-screen text-[#231913] dark:text-[#f7ede5]">
      <Head>
        <title>{cafe.name} | Jong Tov Cafe</title>
        <meta name="description" content={cafe.description || `${cafe.name} cafe details`} />
      </Head>
      <Navbar />

      <main id="main-content" className="pt-24">
        <section className="container mx-auto px-4 pb-10 scroll-mt-28">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/85 shadow-[0_24px_70px_rgba(74,48,33,0.12)] dark:border-white/10 dark:bg-[#1a120f]/90">
              <div className="relative h-[420px] bg-gradient-to-br from-amber-300 via-orange-400 to-red-400">
                {currentImageSrc ? (
                  <img
                    src={currentImageSrc}
                    alt={cafe.name}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = makePlaceholder(cafe.name)
                      event.currentTarget.style.objectFit = 'cover'
                      event.currentTarget.style.objectPosition = 'center'
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-8xl text-white">☕</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#120d0a]/65 via-transparent to-transparent" />
                <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#241713] shadow-lg">
                  {cafe.isOpen !== false ? 'Open now' : 'Closed'}
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">Cafe detail</p>
                    <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">{cafe.name}</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">{cafe.description}</p>
                  </div>
                  <div className="hidden rounded-2xl bg-white/15 px-4 py-3 text-right backdrop-blur md:block">
                    <RatingStars rating={cafe.rating} />
                    <div className="mt-2 text-xs text-white/70">{cafe.location?.address || 'Phnom Penh'}</div>
                  </div>
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto p-4">
                  {images.map((image, index) => (
                    <button
                      type="button"
                      key={image + index}
                      onClick={() => setCurrentImage(index)}
                      className={`h-20 w-28 flex-none overflow-hidden rounded-2xl border transition ${currentImage === index ? 'border-amber-400 ring-2 ring-amber-200' : 'border-white/60 dark:border-white/10'}`}
                    >
                      <img
                        src={image}
                        alt={`${cafe.name} ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null
                          event.currentTarget.src = makePlaceholder(cafe.name)
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <aside className="space-y-5 rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_20px_60px_rgba(74,48,33,0.10)] dark:border-white/10 dark:bg-[#1a120f]/90">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-200">Overview</p>
                  <div className="mt-2 text-2xl font-bold text-[#221815] dark:text-white">{cafe.name}</div>
                </div>
                <div className="rounded-2xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900 dark:bg-white/5 dark:text-amber-200">
                  {'💵'.repeat(cafe.priceLevel || 1)}
                </div>
              </div>

              <RatingStars rating={cafe.rating} />

              <div className="flex flex-wrap gap-2">
                {(cafe.tags || []).slice(0, 6).map((tag) => (
                  <span key={tag} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-white/10 dark:text-amber-100">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Location', value: cafe.location?.address || 'Phnom Penh' },
                  { label: 'WiFi speed', value: cafe.wifiSpeed ? `${cafe.wifiSpeed}+` : 'Unknown' },
                  { label: 'Popularity', value: cafe.popularity || 0 },
                  { label: 'Open status', value: cafe.isOpen !== false ? 'Open' : 'Closed' }
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-[#faf4ee] p-4 dark:bg-white/5">
                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">{item.label}</div>
                    <div className="mt-2 text-sm font-semibold text-[#221815] dark:text-white">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={addFavorite} className="rounded-2xl bg-[#2f221d] px-4 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px]">
                  Save to favorites
                </button>
                {cafe?.location?.googleMapsUrl && (
                  <a
                    href={cafe.location.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 transition hover:border-amber-300 dark:border-white/10 dark:bg-white/5 dark:text-amber-100"
                  >
                    Open in Google Maps
                  </a>
                )}
              </div>

              {message && <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-white/5 dark:text-amber-100">{message}</p>}
            </aside>
          </div>
        </section>

        <section className="container mx-auto grid gap-6 px-4 pb-10 scroll-mt-28 lg:grid-cols-[1fr_0.75fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_20px_60px_rgba(74,48,33,0.10)] dark:border-white/10 dark:bg-[#1a120f]/90">
              <h2 className="text-2xl font-bold text-[#221815] dark:text-white">About this cafe</h2>
              <p className="mt-4 text-sm leading-7 text-gray-700 dark:text-gray-300">
                {cafe.description || 'A modern cafe tailored for coffee lovers, students, and remote workers.'}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {(cafe.facilities || ['WiFi', 'Seating', 'Coffee']).map((facility) => (
                  <div key={facility} className="rounded-2xl bg-[#faf4ee] px-4 py-3 text-sm font-medium text-[#221815] dark:bg-white/5 dark:text-white">
                    {facility}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_20px_60px_rgba(74,48,33,0.10)] dark:border-white/10 dark:bg-[#1a120f]/90">
              <h2 className="text-2xl font-bold text-[#221815] dark:text-white">Menu preview</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">A lightweight preview based on cafe tags and available facilities.</p>
              <div className="mt-5">
                <MenuPreview cafe={cafe} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_20px_60px_rgba(74,48,33,0.10)] dark:border-white/10 dark:bg-[#1a120f]/90">
              <h2 className="text-2xl font-bold text-[#221815] dark:text-white">Opening hours</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {openingEntries.length ? openingEntries.map(([day, hours]) => (
                  <div key={day} className="rounded-2xl bg-[#faf4ee] px-4 py-3 text-sm text-[#221815] dark:bg-white/5 dark:text-white">
                    <div className="font-semibold capitalize">{day}</div>
                    <div className="text-gray-600 dark:text-gray-300">{String(hours)}</div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300">Opening hours not provided yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_20px_60px_rgba(74,48,33,0.10)] dark:border-white/10 dark:bg-[#1a120f]/90">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-[#221815] dark:text-white">Reviews</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Ratings and feedback from the community.</p>
                </div>
                <div className="rounded-2xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 dark:bg-white/5 dark:text-amber-200">
                  {reviews.length} review{reviews.length === 1 ? '' : 's'}
                </div>
              </div>

              <form onSubmit={submitReview} className="mt-6 rounded-[1.5rem] border border-amber-100 bg-amber-50/60 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#221815] dark:text-white">Your rating</label>
                    <select
                      className="w-full rounded-2xl border border-white/60 bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                      value={rating}
                      onChange={(event) => setRating(event.target.value)}
                    >
                      <option value="5">5</option>
                      <option value="4">4</option>
                      <option value="3">3</option>
                      <option value="2">2</option>
                      <option value="1">1</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#221815] dark:text-white">Write a review</label>
                    <textarea
                      className="min-h-32 w-full rounded-2xl border border-white/60 bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                      placeholder="Tell other visitors about the WiFi, atmosphere, drinks, and study-friendliness."
                      value={reviewText}
                      onChange={(event) => setReviewText(event.target.value)}
                    />
                  </div>
                </div>
                <button className="mt-4 rounded-2xl bg-[#2f221d] px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px]">
                  Post review
                </button>
              </form>

              <div className="mt-6 space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-[1.5rem] border border-white/60 bg-white/85 p-5 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-[#221815] dark:text-white">{review.User?.name || 'Guest'}</div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-300">{new Date(review.createdAt || Date.now()).toLocaleDateString()}</div>
                      </div>
                      <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-white/5 dark:text-amber-100">
                        {review.rating}/5
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">{review.text || 'No comment provided.'}</p>
                  </div>
                ))}
                {!reviews.length && <p className="text-sm text-gray-600 dark:text-gray-300">No reviews yet.</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_20px_60px_rgba(74,48,33,0.10)] dark:border-white/10 dark:bg-[#1a120f]/90">
              <h2 className="text-2xl font-bold text-[#221815] dark:text-white">Location map</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Open the exact spot on Google Maps or use the embedded location below.</p>
              <iframe title="Cafe Map" src={mapSrc} className="mt-5 h-[420px] w-full rounded-[1.5rem] border-0" loading="lazy" />
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_20px_60px_rgba(74,48,33,0.10)] dark:border-white/10 dark:bg-[#1a120f]/90">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-[#221815] dark:text-white">Similar cafes</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Recommended based on this cafe’s vibe.</p>
                </div>
                {similarLoading && <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-200">Loading</div>}
              </div>

              <div className="mt-5 space-y-4">
                {similarCafes.map((similarCafe) => (
                  <CafeCard key={similarCafe.id} cafe={similarCafe} />
                ))}
                {!similarLoading && !similarCafes.length && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">No similar cafes found yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_20px_60px_rgba(74,48,33,0.10)] dark:border-white/10 dark:bg-[#1a120f]/90">
              <h2 className="text-2xl font-bold text-[#221815] dark:text-white">Quick actions</h2>
              <div className="mt-4 space-y-3 text-sm">
                <button onClick={addFavorite} className="w-full rounded-2xl bg-[#2f221d] px-4 py-3 font-semibold text-white transition hover:translate-y-[-1px]">
                  Save cafe
                </button>
                <Link href="/" className="block rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center font-semibold text-amber-900 dark:border-white/10 dark:bg-white/5 dark:text-amber-100">
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export async function getServerSideProps({ params }) {
  try {
    const response = await axios.get(`${API_BASE}/api/cafes/${params.id}`)
    return { props: { cafe: response.data } }
  } catch (error) {
    return { props: { cafe: getLocalCafeById(params.id) } }
  }
}
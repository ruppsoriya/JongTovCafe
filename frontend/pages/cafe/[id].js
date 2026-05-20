import axios from 'axios'
import Navbar from '../../components/Navbar'
import { api, API_BASE } from '../../lib/api'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function CafeDetail({ cafe }){
  const { user } = useAuth()
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')

  if (!cafe) return <div>Loading...</div>

  const mapSrc = cafe?.location?.coords
    ? `https://www.google.com/maps?q=${cafe.location.coords.lat},${cafe.location.coords.lng}&z=15&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(cafe?.location?.address || cafe.name)}&z=15&output=embed`

  const addFavorite = async () => {
    if (!user) return setMessage('Please login to save favorites.');
    try {
      await api.post(`/auth/favorites/${cafe.id || cafe._id}`)
      setMessage('Cafe added to favorites.')
    } catch (e) {
      setMessage(e.response?.data?.message || 'Could not save favorite.')
    }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) return setMessage('Please login to submit a review.');
    try {
      await api.post('/reviews', { cafeId: cafe.id || cafe._id, rating: Number(rating), text: reviewText })
      setMessage('Review submitted.')
      setReviewText('')
    } catch (e2) {
      setMessage(e2.response?.data?.message || 'Could not submit review.')
    }
  }

  return (
    <div className="min-h-screen bg-cream text-coffee">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">{cafe.name}</h1>
        <p className="mt-2">{cafe.description}</p>
        <div className="mt-4">Rating: {cafe.rating}</div>
        <div className="mt-2">Price Level: {'$'.repeat(cafe.priceLevel || 1)}</div>
        <button onClick={addFavorite} className="mt-4 px-4 py-2 rounded bg-coffee text-cream">Save to Favorites</button>
        {message && <p className="mt-3 text-sm">{message}</p>}

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Location Map</h2>
          <iframe title="Cafe Map" src={mapSrc} className="w-full h-72 rounded border" loading="lazy" />
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Submit Review</h2>
          <form onSubmit={submitReview} className="bg-white p-4 rounded shadow max-w-xl">
            <label className="text-sm">Rating</label>
            <select className="w-full p-2 border rounded mb-2" value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
            <textarea className="w-full p-2 border rounded mb-2" rows="4" placeholder="Write your review" value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
            <button className="px-4 py-2 rounded bg-warm text-white">Post Review</button>
          </form>
        </section>
      </main>
    </div>
  )
}

export async function getServerSideProps({ params }){
  try{
    const res = await axios.get(`${API_BASE}/api/cafes/${params.id}`);
    return { props: { cafe: res.data } }
  }catch(e){ return { props: { cafe: null } } }
}

import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Dashboard(){
  const [cafes, setCafes] = useState([])
  const [form, setForm] = useState({ name: '', description: '', rating: 4.5, priceLevel: 2, address: '' })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  const loadCafes = async () => {
    try {
      const { data } = await api.get('/cafes')
      setCafes(data)
    } catch (e) {
      setCafes([])
    }
  }

  useEffect(() => {
    loadCafes()
  }, [])

  const saveCafe = async (e) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      description: form.description,
      rating: Number(form.rating),
      priceLevel: Number(form.priceLevel),
      location: { address: form.address }
    }
    try {
      if (editingId) {
        await api.put(`/cafes/${editingId}`, payload)
        setMessage('Cafe updated')
      } else {
        await api.post('/cafes', payload)
        setMessage('Cafe created')
      }
      setForm({ name: '', description: '', rating: 4.5, priceLevel: 2, address: '' })
      setEditingId(null)
      loadCafes()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Save failed. Login first.')
    }
  }

  const editCafe = (cafe) => {
    setEditingId(cafe.id)
    setForm({
      name: cafe.name || '',
      description: cafe.description || '',
      rating: cafe.rating || 4,
      priceLevel: cafe.priceLevel || 2,
      address: cafe.location?.address || ''
    })
  }

  const deleteCafe = async (id) => {
    try {
      await api.delete(`/cafes/${id}`)
      setMessage('Cafe deleted')
      loadCafes()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Delete failed. Login first.')
    }
  }

  return (
    <div className="min-h-screen bg-cream text-coffee">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-2">Manage cafes, users and reviews</p>
        <p className="text-sm mt-1">Current admin CRUD in this build is for cafes.</p>

        {message && <div className="mt-3 p-2 bg-white rounded border">{message}</div>}

        <section className="mt-6 bg-white rounded shadow p-4 max-w-2xl">
          <h2 className="font-semibold mb-3">{editingId ? 'Edit Cafe' : 'Add Cafe'}</h2>
          <form onSubmit={saveCafe} className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input className="p-2 border rounded md:col-span-2" placeholder="Cafe name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <textarea className="p-2 border rounded md:col-span-2" rows="3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input type="number" step="0.1" min="1" max="5" className="p-2 border rounded" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
            <input type="number" min="1" max="4" className="p-2 border rounded" placeholder="Price Level" value={form.priceLevel} onChange={(e) => setForm({ ...form, priceLevel: e.target.value })} />
            <input className="p-2 border rounded md:col-span-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <div className="md:col-span-2 flex gap-2">
              <button className="px-4 py-2 rounded bg-coffee text-cream">{editingId ? 'Update Cafe' : 'Create Cafe'}</button>
              {editingId && <button type="button" className="px-4 py-2 rounded border" onClick={() => { setEditingId(null); setForm({ name: '', description: '', rating: 4.5, priceLevel: 2, address: '' }); }}>Cancel</button>}
            </div>
          </form>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-3">All Cafes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cafes.map((cafe) => (
              <div className="bg-white rounded shadow p-4" key={cafe.id}>
                <div className="font-semibold">{cafe.name}</div>
                <div className="text-sm text-gray-600">{cafe.location?.address || '-'}</div>
                <div className="text-sm mt-2">Rating {cafe.rating} • {'$'.repeat(cafe.priceLevel || 1)}</div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => editCafe(cafe)} className="px-3 py-1 rounded border">Edit</button>
                  <button onClick={() => deleteCafe(cafe.id)} className="px-3 py-1 rounded border text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

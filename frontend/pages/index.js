import Head from 'next/head'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import CafeCard from '../components/CafeCard'
import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Home(){
  const [cafes, setCafes] = useState([]);
  const [q, setQ] = useState('');

  const fetchCafes = async () => {
    try {
      const { data } = await api.get('/cafes', { params: { q } });
      setCafes(data);
    } catch (e) {
      setCafes([]);
    }
  };

  useEffect(() => {
    fetchCafes();
  }, []);

  return (
    <div className="min-h-screen bg-cream text-coffee">
      <Head><title>Cafe Recs</title></Head>
      <Navbar />
      <main className="container mx-auto p-4">
        <section className="hero rounded-lg bg-[url('/hero.jpg')] bg-cover bg-center h-64 flex items-center p-6 mb-6">
          <div className="bg-black/40 p-6 rounded text-white">
            <h1 className="text-3xl font-semibold">Discover Your Next Favorite Cafe</h1>
            <p className="mt-2">For students, tourists, and remote workers</p>
            <SearchBar value={q} onChange={setQ} onSearch={fetchCafes} />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Featured Cafes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cafes.slice(0,6).map(c => <CafeCard key={c.id || c._id} cafe={c} />)}
          </div>
        </section>
      </main>
    </div>
  )
}

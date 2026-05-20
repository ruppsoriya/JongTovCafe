import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import Link from 'next/link';

export default function Profile() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    try {
      const { data } = await api.get('/auth/favorites');
      setFavorites(data || []);
    } catch (e) {
      setFavorites([]);
    }
  };

  useEffect(() => {
    if (user) loadFavorites();
  }, [user]);

  const removeFav = async (id) => {
    await api.delete(`/auth/favorites/${id}`);
    loadFavorites();
  };

  return (
    <div className="min-h-screen bg-cream text-coffee">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        {user ? <p className="mt-1 text-sm">Signed in as {user.name} ({user.email})</p> : <p className="mt-1 text-sm">Please login first.</p>}

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Saved Cafes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {favorites.map((cafe) => (
              <div className="bg-white rounded p-4 shadow flex justify-between items-center" key={cafe.id}>
                <div>
                  <div className="font-semibold">{cafe.name}</div>
                  <div className="text-sm text-gray-600">{cafe.location?.address || '-'}</div>
                </div>
                <div className="space-x-2">
                  <Link href={`/cafe/${cafe.id}`}><a className="text-warm">View</a></Link>
                  <button className="text-red-600" onClick={() => removeFav(cafe.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          {!favorites.length && <p className="text-sm text-gray-600">No saved cafes yet.</p>}
        </section>
      </main>
    </div>
  );
}

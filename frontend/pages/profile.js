import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CafeCard from "../components/CafeCard";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const cafeGridClass =
    "grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/auth/favorites");
      setFavorites(data || []);
    } catch (error) {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadFavorites();
  }, [user]);

  const removeFav = async (id) => {
    try {
      await api.delete(`/auth/favorites/${id}`);
      setMessage("Removed from favorites.");
      loadFavorites();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not remove favorite.");
    }
  };

  return (
    <div className="min-h-screen text-[#231913] dark:text-[#f7ede5]">
      <Navbar />
      <main className="container mx-auto px-4 pb-16 pt-28">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] bg-gradient-to-br from-[#221815] via-[#4b3127] to-[#e07a5f] p-8 text-white shadow-[0_30px_90px_rgba(74,48,33,0.22)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
              Profile
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight">
              Your saved cafes and activity.
            </h1>
            <div className="mt-6 rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              {user ? (
                <>
                  <div className="text-sm text-white/75">Signed in as</div>
                  <div className="mt-1 text-xl font-bold">{user.name}</div>
                  <div className="mt-1 text-sm text-white/75">{user.email}</div>
                  <div className="mt-4 text-sm text-white/70">
                    Role: {user.role || "user"}
                  </div>
                </>
              ) : (
                <p className="text-sm text-white/75">
                  Please login to view your saved cafes.
                </p>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#221815] transition hover:translate-y-[-1px]"
              >
                Explore cafes
              </Link>
              {user && (
                <button
                  onClick={logout}
                  className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Logout
                </button>
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_24px_70px_rgba(74,48,33,0.12)] dark:border-white/10 dark:bg-[#1a120f]/90">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#221815] dark:text-white">
                  Saved cafes
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Your shortlist for working, studying, and relaxing.
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 dark:bg-white/5 dark:text-amber-200">
                {favorites.length} saved
              </div>
            </div>

            {message && (
              <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-white/5 dark:text-amber-100">
                {message}
              </p>
            )}

            {loading ? (
              <div className="mt-6">
                <div className={cafeGridClass}>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-64 animate-pulse rounded-3xl bg-[#faf4ee] dark:bg-white/5"
                    />
                  ))}
                </div>
              </div>
            ) : favorites.length ? (
              <div className={`mt-6 ${cafeGridClass}`}>
                {favorites.map((cafe) => (
                  <div
                    key={cafe.id}
                    className="rounded-3xl border border-white/60 bg-[#faf4ee] p-4 dark:border-white/10 dark:bg-white/5"
                  >
                    <CafeCard cafe={cafe} />
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <Link
                        href={`/cafe/${cafe.id}`}
                        className="rounded-2xl bg-[#2f221d] px-4 py-2 text-sm font-semibold text-white"
                      >
                        View cafe
                      </Link>
                      <button
                        onClick={() => removeFav(cafe.id)}
                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-dashed border-amber-300 bg-white/70 p-8 text-center dark:border-white/10 dark:bg-white/5">
                <p className="text-lg font-semibold text-[#221815] dark:text-white">
                  No saved cafes yet.
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Start by exploring cafes and saving the ones you like.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

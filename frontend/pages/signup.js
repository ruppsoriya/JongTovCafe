import Link from 'next/link'
import Navbar from '../components/Navbar'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(name, email, password)
      router.push('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen text-[#231913] dark:text-[#f7ede5]">
      <Navbar />
      <main className="container mx-auto px-4 pb-16 pt-28">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#3b2f2f] via-[#5a4032] to-[#e07a5f] p-8 text-white shadow-[0_30px_90px_rgba(74,48,33,0.22)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Join the map</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Create your account and build your cafe profile.</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/75">
              Save favorite cafes, submit reviews, and receive smarter recommendations based on your preferences.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {['Personalized recs', 'Favorite cafes', 'Reviews', 'Admin-ready structure'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white/85 backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-[0_24px_70px_rgba(74,48,33,0.12)] dark:border-white/10 dark:bg-[#1a120f]/90">
            <h2 className="text-3xl font-bold text-[#221815] dark:text-white">Sign up</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Start tracking your favorite coffee spots.</p>
            {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <form onSubmit={submit} className="mt-6 space-y-4">
              <input
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-amber-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <input
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-amber-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <input
                type="password"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-amber-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#3b2f2f] to-[#5a4032] px-4 py-3 font-semibold text-white transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Creating...' : 'Create account'}
              </button>
            </form>
            <p className="mt-5 text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-amber-700 transition hover:text-amber-900 dark:text-amber-200">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

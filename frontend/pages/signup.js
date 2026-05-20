import Navbar from '../components/Navbar'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function Signup(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const submit = async (e) => {
    e.preventDefault()
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
    <div className="min-h-screen bg-cream text-coffee">
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <form onSubmit={submit}>
            <input className="w-full p-2 border mb-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="w-full p-2 border mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" className="w-full p-2 border mb-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button disabled={loading} className="w-full py-2 bg-coffee text-cream rounded disabled:opacity-60">{loading ? 'Creating...' : 'Create account'}</button>
          </form>
        </div>
      </main>
    </div>
  )
}

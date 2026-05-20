import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function Navbar(){
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/"><a className="text-2xl font-bold text-coffee">CafeRecs</a></Link>
        <div className="space-x-4">
          <Link href="/"><a>Home</a></Link>
          <Link href="/dashboard"><a>Admin</a></Link>
          {user ? (
            <>
              <Link href="/profile"><a>Profile</a></Link>
              <button onClick={logout} className="ml-2 px-3 py-1 bg-coffee text-cream rounded">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login"><a className="ml-2 px-3 py-1 bg-coffee text-cream rounded">Login</a></Link>
              <Link href="/signup"><a className="px-3 py-1 border border-coffee rounded">Sign up</a></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

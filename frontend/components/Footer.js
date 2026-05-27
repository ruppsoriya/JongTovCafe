import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/40 bg-[#18120f] text-white/80 dark:border-white/10">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 text-[#1f1814] shadow-lg">
              ☕
            </span>
            <span className="text-lg font-bold text-white">Jong Tov Cafe</span>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/65">
            A coffee discovery app for students, tourists, and remote workers
            looking for the right place to stay productive.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
            Explore
          </h3>
          <div className="space-y-3 text-sm">
            <Link href="/" className="block transition hover:text-white">
              Home
            </Link>
            <Link href="/profile" className="block transition hover:text-white">
              Favorites
            </Link>
            <Link
              href="/dashboard"
              className="block transition hover:text-white"
            >
              Admin dashboard
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
            Contact
          </h3>
          <div className="space-y-3 text-sm text-white/70">
            <p>Phnom Penh, Cambodia</p>
            <p>support@jongtovcafe.app</p>
            <p>Instagram, Facebook, and Google Maps ready</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

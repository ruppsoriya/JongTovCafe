import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedTheme = window.localStorage.getItem("cafe-theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem("cafe-theme", nextTheme);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/20 bg-[#1f1814]/85 text-white shadow-[0_10px_30px_rgba(31,24,20,0.18)] backdrop-blur-xl">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:py-4">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-[#1f1814]"
        >
          Skip to content
        </a>
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 text-lg font-bold tracking-tight text-white sm:text-xl"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-orange-400 to-red-400 text-2xl text-[#1f1814] shadow-lg">
            ☕
          </span>
          <span className="sm:inline">Jong Tov Cafe</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-white/80 transition hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/#recommendations"
            className="text-sm font-medium text-white/80 transition hover:text-white"
          >
            Recommendations
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-white/80 transition hover:text-white"
          >
            Favorites
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              Admin
            </Link>
          )}
        </div>

        <div className="flex w-full flex-col gap-3 md:hidden">
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-amber-300"
              aria-label="Toggle theme"
            >
              Theme
            </button>
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-3 py-2 text-xs font-semibold text-[#1f1814] transition hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-medium text-white/80 transition hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-3 py-2 text-xs font-semibold text-[#1f1814] transition hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Link
              href="/"
              className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/90 transition hover:bg-white/15"
            >
              Home
            </Link>
            <Link
              href="/#recommendations"
              className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/90 transition hover:bg-white/15"
            >
              Recommendations
            </Link>
            <Link
              href="/profile"
              className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/90 transition hover:bg-white/15"
            >
              Favorites
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/dashboard"
                className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/90 transition hover:bg-white/15"
              >
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-end gap-2 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-amber-300 sm:text-sm"
            aria-label="Toggle theme"
          >
            <span className="sm:hidden">Theme</span>
            <span className="hidden sm:inline">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
          </button>
          {user ? (
            <>
              <Link
                href="/profile"
                className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15 sm:inline-flex"
              >
                {user.name}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-3 py-2 text-xs font-semibold text-[#1f1814] transition hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-amber-300 sm:px-4 sm:text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-medium text-white/80 transition hover:text-white sm:text-sm"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-3 py-2 text-xs font-semibold text-[#1f1814] transition hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-amber-300 sm:px-4 sm:text-sm"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

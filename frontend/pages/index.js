import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import FiltersSidebar from "../components/FiltersSidebar";
import CafeCard from "../components/CafeCard";
import Footer from "../components/Footer";
import { api } from "../lib/api";
import localCafes from "../lib/localCafes";

const initialFilters = {
  minRating: "",
  maxPrice: "",
  fastWifi: false,
  studyFriendly: false,
  quiet: false,
  familyFriendly: false,
  outdoorSeating: false,
  airConditioning: false,
  openNow: false,
};

const quickFilterPresets = [
  { label: "Fast WiFi", key: "fastWifi" },
  { label: "Study-friendly", key: "studyFriendly" },
  { label: "Quiet", key: "quiet" },
  { label: "Outdoor seating", key: "outdoorSeating" },
  { label: "Air conditioning", key: "airConditioning" },
];

export default function Home() {
  const [cafes, setCafes] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [recommendLoading, setRecommendLoading] = useState(true);
  const [showAllCafes, setShowAllCafes] = useState(true);

  const activeTags = useMemo(() => {
    const tags = [];
    if (filters.fastWifi) tags.push("Fast WiFi");
    if (filters.studyFriendly) tags.push("Study-friendly");
    if (filters.quiet) tags.push("Quiet");
    if (filters.familyFriendly) tags.push("Family-friendly");
    if (filters.outdoorSeating) tags.push("Outdoor seating");
    if (filters.airConditioning) tags.push("Air conditioning");
    return tags;
  }, [filters]);

  const buildParams = (currentFilters = filters, currentQuery = query) => {
    const tags = [];
    if (currentFilters.fastWifi) tags.push("Fast WiFi");
    if (currentFilters.studyFriendly) tags.push("Study-friendly");
    if (currentFilters.quiet) tags.push("Quiet");
    if (currentFilters.familyFriendly) tags.push("Family-friendly");
    if (currentFilters.outdoorSeating) tags.push("Outdoor seating");
    if (currentFilters.airConditioning) tags.push("Air conditioning");

    const params = {};
    if (currentQuery.trim()) params.q = currentQuery.trim();
    if (currentFilters.minRating) params.minRating = currentFilters.minRating;
    if (currentFilters.maxPrice) params.maxPrice = currentFilters.maxPrice;
    if (currentFilters.openNow) params.openNow = "true";
    if (currentFilters.fastWifi) params.fastWifi = "true";
    if (currentFilters.studyFriendly) params.studyFriendly = "true";
    if (currentFilters.familyFriendly) params.familyFriendly = "true";
    if (currentFilters.outdoorSeating) params.outdoorSeating = "true";
    if (currentFilters.airConditioning) params.airConditioning = "true";
    if (tags.length) params.tags = tags.join(",");
    return params;
  };

  const filterLocalCafes = (currentFilters = filters, currentQuery = query) => {
    const queryText = String(currentQuery || "")
      .trim()
      .toLowerCase();
    return localCafes.filter((cafe) => {
      const tagList = (cafe.tags || []).map((item) =>
        String(item).toLowerCase(),
      );
      const facilityList = (cafe.facilities || []).map((item) =>
        String(item).toLowerCase(),
      );
      const name = String(cafe.name || "").toLowerCase();
      const description = String(cafe.description || "").toLowerCase();

      if (
        queryText &&
        !`${name} ${description} ${cafe.location?.address || ""}`
          .toLowerCase()
          .includes(queryText)
      ) {
        return false;
      }
      if (
        currentFilters.minRating &&
        Number(cafe.rating || 0) < Number(currentFilters.minRating)
      )
        return false;
      if (
        currentFilters.maxPrice &&
        Number(cafe.priceLevel || 0) > Number(currentFilters.maxPrice)
      )
        return false;
      if (currentFilters.openNow && cafe.isOpen === false) return false;
      if (
        currentFilters.fastWifi &&
        !(
          Number(cafe.wifiSpeed || 0) >= 70 ||
          tagList.includes("fast wifi") ||
          facilityList.includes("fast wifi")
        )
      )
        return false;
      if (
        currentFilters.studyFriendly &&
        !(
          tagList.includes("study-friendly") ||
          facilityList.includes("study-friendly")
        )
      )
        return false;
      if (
        currentFilters.quiet &&
        !(
          tagList.includes("quiet") || facilityList.includes("quiet atmosphere")
        )
      )
        return false;
      if (
        currentFilters.familyFriendly &&
        !(
          tagList.includes("family-friendly") ||
          facilityList.includes("family-friendly")
        )
      )
        return false;
      if (
        currentFilters.outdoorSeating &&
        !(
          tagList.includes("outdoor seating") ||
          facilityList.includes("outdoor seating")
        )
      )
        return false;
      if (
        currentFilters.airConditioning &&
        !(
          tagList.includes("air conditioning") ||
          facilityList.includes("air conditioning")
        )
      )
        return false;
      return true;
    });
  };

  const getLocalRecommendations = (
    currentFilters = filters,
    currentQuery = query,
  ) => {
    const filtered = filterLocalCafes(currentFilters, currentQuery);
    return [...filtered].sort(
      (a, b) => Number(b.popularity || 0) - Number(a.popularity || 0),
    );
  };

  const loadCafes = async (currentFilters = filters, currentQuery = query) => {
    setLoading(true);
    try {
      const { data } = await api.get("/cafes", {
        params: buildParams(currentFilters, currentQuery),
      });
      setCafes(
        Array.isArray(data) && data.length
          ? data
          : filterLocalCafes(currentFilters, currentQuery),
      );
    } catch (error) {
      console.error("Error fetching cafes:", error);
      setCafes(filterLocalCafes(currentFilters, currentQuery));
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async (currentFilters = filters) => {
    setRecommendLoading(true);
    try {
      const prefs = {
        tags: activeTags,
        minRating: currentFilters.minRating || undefined,
        pricePref: currentFilters.maxPrice || undefined,
        fastWifi: currentFilters.fastWifi,
        studyFriendly: currentFilters.studyFriendly,
        quiet: currentFilters.quiet,
        familyFriendly: currentFilters.familyFriendly,
        outdoorSeating: currentFilters.outdoorSeating,
      };
      const { data } = await api.get("/cafes/recommend", {
        params: { prefs: JSON.stringify(prefs) },
      });
      setRecommended(
        Array.isArray(data) && data.length
          ? data.slice(0, 8)
          : getLocalRecommendations(currentFilters).slice(0, 8),
      );
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommended(getLocalRecommendations(currentFilters).slice(0, 8));
    } finally {
      setRecommendLoading(false);
    }
  };

  const runSearch = async (nextFilters = filters, nextQuery = query) => {
    const nextActiveTags = [];
    if (nextFilters.fastWifi) nextActiveTags.push("Fast WiFi");
    if (nextFilters.studyFriendly) nextActiveTags.push("Study-friendly");
    if (nextFilters.quiet) nextActiveTags.push("Quiet");
    if (nextFilters.familyFriendly) nextActiveTags.push("Family-friendly");
    if (nextFilters.outdoorSeating) nextActiveTags.push("Outdoor seating");
    if (nextFilters.airConditioning) nextActiveTags.push("Air conditioning");

    await Promise.all([
      loadCafes(nextFilters, nextQuery),
      (async () => {
        setRecommendLoading(true);
        try {
          const prefs = {
            tags: nextActiveTags,
            minRating: nextFilters.minRating || undefined,
            pricePref: nextFilters.maxPrice || undefined,
            fastWifi: nextFilters.fastWifi,
            studyFriendly: nextFilters.studyFriendly,
            quiet: nextFilters.quiet,
            familyFriendly: nextFilters.familyFriendly,
            outdoorSeating: nextFilters.outdoorSeating,
          };
          const { data } = await api.get("/cafes/recommend", {
            params: { prefs: JSON.stringify(prefs) },
          });
          setRecommended(
            Array.isArray(data) && data.length
              ? data.slice(0, 8)
              : getLocalRecommendations(nextFilters, nextQuery).slice(0, 8),
          );
        } catch (error) {
          console.error("Error fetching recommendations:", error);
          setRecommended(
            getLocalRecommendations(nextFilters, nextQuery).slice(0, 8),
          );
        } finally {
          setRecommendLoading(false);
        }
      })(),
    ]);
  };

  const handlePreset = async (key) => {
    const nextFilters = { ...filters, [key]: !filters[key] };
    setFilters(nextFilters);
    await runSearch(nextFilters, query);
  };

  const handleReset = async () => {
    setQuery("");
    setFilters(initialFilters);
    await runSearch(initialFilters, "");
  };

  useEffect(() => {
    loadCafes();
    loadRecommendations();
  }, []);

  const featuredCafes = cafes.slice(0, 8);
  const visibleCafes = showAllCafes ? cafes : featuredCafes;
  const popularCafes = [...cafes]
    .sort((a, b) => Number(b.popularity || 0) - Number(a.popularity || 0))
    .slice(0, 6);
  const openCount = cafes.filter((cafe) => cafe.isOpen !== false).length;
  const averageRating = cafes.length
    ? (
        cafes.reduce((sum, cafe) => sum + Number(cafe.rating || 0), 0) /
        cafes.length
      ).toFixed(1)
    : "0.0";

  const cafeGridClass =
    "grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";

  return (
    <div className="min-h-screen text-[#231913] dark:text-[#f7ede5]">
      <Head>
        <title>Jong Tov Cafe - Discover the best cafes in Phnom Penh</title>
        <meta
          name="description"
          content="Modern cafe discovery and recommendation platform for students, tourists, and remote workers in Phnom Penh."
        />
      </Head>
      <Navbar />

      <main id="main-content" className="pt-24">
        <section className="relative overflow-hidden px-4 pb-14 pt-6">
          <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20 dark:opacity-10" />
          <div className="container mx-auto grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-amber-200">
                Student friendly cafe discovery
              </span>
              <h1 className="mt-5 text-5xl font-black tracking-tight text-[#221815] sm:text-6xl lg:text-7xl dark:text-white">
                Find cafes that fit the way you work, study, and travel.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700 dark:text-gray-300">
                Search by coffee quality, WiFi, quiet corners, price, and
                atmosphere. Jong Tov Cafe turns Phnom Penh’s coffee scene into a
                recommendation experience that feels modern and personal.
              </p>

              <div className="mt-8">
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  onSearch={runSearch}
                  loading={loading}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {quickFilterPresets.map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => handlePreset(preset.key)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      filters[preset.key]
                        ? "border-transparent bg-[#2f221d] text-white shadow-lg shadow-black/10"
                        : "border-white/60 bg-white/70 text-[#2f221d] hover:border-amber-300 hover:bg-amber-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Cafes indexed", value: cafes.length || "50+" },
                  { label: "Open now", value: openCount || "0" },
                  { label: "Average rating", value: averageRating },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_12px_40px_rgba(74,48,33,0.08)] dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {item.label}
                    </div>
                    <div className="mt-2 text-3xl font-black tracking-tight text-[#221815] dark:text-white">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 rounded-[2rem] border border-white/60 bg-white/75 p-5 shadow-[0_24px_80px_rgba(74,48,33,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1a120f]/85">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-[#3b2f2f] via-[#5f4031] to-[#e07a5f] p-6 text-white shadow-lg">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
                  Recommendation engine
                </div>
                <h2 className="mt-4 text-2xl font-bold">
                  Cafe picks that match your preferences.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/80">
                  Your selected filters shape content-based and popularity
                  scoring so the list adapts to work mode, study mode, or a
                  relaxed weekend search.
                </p>
              </div>

              <FiltersSidebar
                filters={filters}
                setFilters={setFilters}
                onApply={() => runSearch(filters, query)}
                onReset={handleReset}
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12 scroll-mt-28">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-200">
                Recommendations
              </p>
              <h2
                id="recommendations"
                className="mt-2 text-3xl font-bold tracking-tight text-[#221815] dark:text-white"
              >
                Cafes tailored to your vibe
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Powered by your filters, favorites, and popularity signals
            </p>
          </div>

          {recommendLoading && !recommended.length ? (
            <div className={cafeGridClass}>
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-96 animate-pulse rounded-3xl bg-white/70 dark:bg-white/5"
                />
              ))}
            </div>
          ) : (
            <div className={cafeGridClass}>
              {recommended.map((cafe) => (
                <CafeCard key={cafe.id} cafe={cafe} />
              ))}
            </div>
          )}
        </section>

        <section className="container mx-auto px-4 py-8 scroll-mt-28">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-200">
                Featured
              </p>
              <h2
                id="featured"
                className="mt-2 text-3xl font-bold tracking-tight text-[#221815] dark:text-white"
              >
                Featured cafes
              </h2>
            </div>
            <button
              type="button"
              onClick={() => runSearch(filters, query)}
              className="text-sm font-semibold text-amber-700 transition hover:text-amber-900 dark:text-amber-200"
            >
              Refresh results
            </button>
          </div>

          {loading ? (
            <div className={cafeGridClass}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-96 animate-pulse rounded-3xl bg-white/70 dark:bg-white/5"
                />
              ))}
            </div>
          ) : featuredCafes.length ? (
            <div className={cafeGridClass}>
              {featuredCafes.map((cafe) => (
                <CafeCard key={cafe.id || cafe._id} cafe={cafe} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-amber-300 bg-white/80 p-10 text-center dark:border-white/10 dark:bg-white/5">
              <div className="text-5xl">☕</div>
              <p className="mt-4 text-xl font-semibold">
                No cafes matched that filter set.
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Try widening the rating or price range, or reset the filters.
              </p>
            </div>
          )}
        </section>

        <section className="container mx-auto px-4 py-8 scroll-mt-28">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-200">
                Browse
              </p>
              <h2
                id="all-cafes"
                className="mt-2 text-3xl font-bold tracking-tight text-[#221815] dark:text-white"
              >
                All cafes
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {showAllCafes
                  ? `Showing all ${cafes.length} cafes`
                  : `Showing ${visibleCafes.length} of ${cafes.length} cafes`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAllCafes((current) => !current)}
              className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-50 dark:border-white/10 dark:bg-white/5 dark:text-amber-100"
            >
              {showAllCafes ? "Show featured cafes" : "Show all cafes"}
            </button>
          </div>

          {loading ? (
            <div className={cafeGridClass}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-96 animate-pulse rounded-3xl bg-white/70 dark:bg-white/5"
                />
              ))}
            </div>
          ) : visibleCafes.length ? (
            <div className={cafeGridClass}>
              {visibleCafes.map((cafe) => (
                <CafeCard key={cafe.id || cafe._id} cafe={cafe} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-amber-300 bg-white/80 p-10 text-center dark:border-white/10 dark:bg-white/5">
              <div className="text-5xl">☕</div>
              <p className="mt-4 text-xl font-semibold">
                No cafes available yet.
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Try refreshing the results or check back after the cafe data is
                seeded.
              </p>
            </div>
          )}
        </section>

        <section className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-200">
              Popular
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#221815] dark:text-white">
              Popular cafes carousel
            </h2>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
            {popularCafes.map((cafe) => (
              <div
                key={cafe.id || cafe._id}
                className="min-w-[320px] max-w-[320px] snap-start"
              >
                <CafeCard cafe={cafe} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

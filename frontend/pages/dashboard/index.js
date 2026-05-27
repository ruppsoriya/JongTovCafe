import Navbar from "../../components/Navbar";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const emptyForm = {
  name: "",
  description: "",
  rating: 4.5,
  priceLevel: 2,
  address: "",
  wifiSpeed: 70,
  tags: "",
  facilities: "",
  isOpen: true,
  openingHours:
    '{\n  "Mon-Fri": "8:00 AM - 10:00 PM",\n  "Sat-Sun": "8:00 AM - 11:00 PM"\n}',
};

export default function Dashboard() {
  const [cafes, setCafes] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("cafes");
  const { user, loading } = useAuth();
  const router = useRouter();

  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [cafesResponse, usersResponse, reviewsResponse] = await Promise.all(
        [api.get("/cafes"), api.get("/auth/users"), api.get("/reviews")],
      );
      setCafes(cafesResponse.data || []);
      setUsers(usersResponse.data || []);
      setReviews(reviewsResponse.data || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load admin data.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "admin") {
      setMessage("Admin access required.");
      return;
    }
    loadAdminData();
  }, [user, loading]);

  const analytics = useMemo(() => {
    const averageRating = cafes.length
      ? (
          cafes.reduce((sum, cafe) => sum + Number(cafe.rating || 0), 0) /
          cafes.length
        ).toFixed(1)
      : "0.0";
    return {
      cafes: cafes.length,
      reviews: reviews.length,
      users: users.length,
      openNow: cafes.filter((cafe) => cafe.isOpen !== false).length,
      averageRating,
    };
  }, [cafes, users, reviews]);

  const saveCafe = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        rating: Number(form.rating),
        priceLevel: Number(form.priceLevel),
        wifiSpeed: Number(form.wifiSpeed),
        isOpen: Boolean(form.isOpen),
        location: { address: form.address },
        tags: String(form.tags)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        facilities: String(form.facilities)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        openingHours: form.openingHours ? JSON.parse(form.openingHours) : {},
      };

      if (editingId) {
        await api.put(`/cafes/${editingId}`, payload);
        setMessage("Cafe updated");
      } else {
        await api.post("/cafes", payload);
        setMessage("Cafe created");
      }

      setForm(emptyForm);
      setEditingId(null);
      loadAdminData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const editCafe = (cafe) => {
    setEditingId(cafe.id);
    setForm({
      name: cafe.name || "",
      description: cafe.description || "",
      rating: cafe.rating || 4.5,
      priceLevel: cafe.priceLevel || 2,
      address: cafe.location?.address || "",
      wifiSpeed: cafe.wifiSpeed || 70,
      tags: (cafe.tags || []).join(", "),
      facilities: (cafe.facilities || []).join(", "),
      isOpen: cafe.isOpen !== false,
      openingHours: JSON.stringify(cafe.openingHours || {}, null, 2),
    });
    setActiveTab("cafes");
  };

  const deleteCafe = async (id) => {
    try {
      await api.delete(`/cafes/${id}`);
      setMessage("Cafe deleted");
      loadAdminData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Delete failed.");
    }
  };

  const deleteReview = async (id) => {
    try {
      await api.delete(`/reviews/${id}`);
      setMessage("Review removed");
      loadAdminData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not delete review.");
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen text-[#231913] dark:text-[#f7ede5]">
        <Navbar />
        <main className="container mx-auto px-4 pt-28">Loading...</main>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen text-[#231913] dark:text-[#f7ede5]">
        <Navbar />
        <main className="container mx-auto px-4 pt-28">
          <div className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-[0_24px_70px_rgba(74,48,33,0.12)] dark:border-white/10 dark:bg-[#1a120f]/90">
            <h1 className="text-3xl font-bold text-[#221815] dark:text-white">
              Admin access required
            </h1>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              You need an admin account to manage cafes, users, and reviews.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#231913] dark:text-[#f7ede5]">
      <Navbar />
      <main className="container mx-auto px-4 pb-16 pt-28">
        <section className="rounded-[2rem] bg-gradient-to-br from-[#221815] via-[#4b3127] to-[#e07a5f] p-8 text-white shadow-[0_30px_90px_rgba(74,48,33,0.22)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
            Admin dashboard
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Manage cafes, users, reviews, and analytics.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">
            This dashboard is wired to the live API so you can add cafes, edit
            details, moderate reviews, and inspect the overall community
            activity.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[
              { label: "Cafes", value: analytics.cafes },
              { label: "Open now", value: analytics.openNow },
              { label: "Reviews", value: analytics.reviews },
              { label: "Users", value: analytics.users },
              { label: "Average rating", value: analytics.averageRating },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur"
              >
                <div className="text-xs uppercase tracking-[0.18em] text-white/65">
                  {item.label}
                </div>
                <div className="mt-2 text-3xl font-black">{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        {message && (
          <div className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-white/5 dark:text-amber-100">
            {message}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {["cafes", "reviews", "users"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? "bg-[#2f221d] text-white" : "border border-white/60 bg-white/80 text-[#221815] dark:border-white/10 dark:bg-white/5 dark:text-white"}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "cafes" && (
          <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_24px_70px_rgba(74,48,33,0.12)] dark:border-white/10 dark:bg-[#1a120f]/90">
              <h2 className="text-2xl font-bold text-[#221815] dark:text-white">
                {editingId ? "Edit cafe" : "Add cafe"}
              </h2>
              <form onSubmit={saveCafe} className="mt-5 grid gap-4">
                <input
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  placeholder="Cafe name"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                />
                <textarea
                  className="min-h-28 rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  placeholder="Description"
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                    placeholder="Rating"
                    value={form.rating}
                    onChange={(event) =>
                      setForm({ ...form, rating: event.target.value })
                    }
                  />
                  <input
                    type="number"
                    min="1"
                    max="4"
                    className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                    placeholder="Price level"
                    value={form.priceLevel}
                    onChange={(event) =>
                      setForm({ ...form, priceLevel: event.target.value })
                    }
                  />
                  <input
                    type="number"
                    min="0"
                    className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                    placeholder="WiFi speed"
                    value={form.wifiSpeed}
                    onChange={(event) =>
                      setForm({ ...form, wifiSpeed: event.target.value })
                    }
                  />
                  <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium dark:border-white/10 dark:bg-white/5 dark:text-white">
                    <input
                      type="checkbox"
                      checked={form.isOpen}
                      onChange={(event) =>
                        setForm({ ...form, isOpen: event.target.checked })
                      }
                    />
                    Open now
                  </label>
                </div>
                <input
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  placeholder="Address"
                  value={form.address}
                  onChange={(event) =>
                    setForm({ ...form, address: event.target.value })
                  }
                />
                <input
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  placeholder="Tags, comma separated"
                  value={form.tags}
                  onChange={(event) =>
                    setForm({ ...form, tags: event.target.value })
                  }
                />
                <input
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  placeholder="Facilities, comma separated"
                  value={form.facilities}
                  onChange={(event) =>
                    setForm({ ...form, facilities: event.target.value })
                  }
                />
                <textarea
                  className="min-h-28 rounded-2xl border border-gray-200 bg-white px-4 py-3 font-mono text-sm outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  placeholder="Opening hours JSON"
                  value={form.openingHours}
                  onChange={(event) =>
                    setForm({ ...form, openingHours: event.target.value })
                  }
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    disabled={saving}
                    className="rounded-2xl bg-[#2f221d] px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update cafe"
                        : "Create cafe"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#221815] dark:border-white/10 dark:bg-white/5 dark:text-white"
                      onClick={() => {
                        setEditingId(null);
                        setForm(emptyForm);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_24px_70px_rgba(74,48,33,0.12)] dark:border-white/10 dark:bg-[#1a120f]/90">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-[#221815] dark:text-white">
                  All cafes
                </h2>
                <button
                  onClick={loadAdminData}
                  className="text-sm font-semibold text-amber-700 dark:text-amber-200"
                >
                  Refresh
                </button>
              </div>
              <div className="mt-5 space-y-4">
                {cafes.map((cafe) => (
                  <div
                    key={cafe.id}
                    className="rounded-3xl border border-white/60 bg-[#faf4ee] p-4 dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-semibold text-[#221815] dark:text-white">
                          {cafe.name}
                        </div>
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {cafe.location?.address || "-"}
                        </div>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          Rating {Number(cafe.rating || 0).toFixed(1)} •{" "}
                          {"$".repeat(cafe.priceLevel || 1)} • WiFi{" "}
                          {cafe.wifiSpeed || 0}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editCafe(cafe)}
                          className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCafe(cafe.id)}
                          className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "reviews" && (
          <section className="mt-8 rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_24px_70px_rgba(74,48,33,0.12)] dark:border-white/10 dark:bg-[#1a120f]/90">
            <h2 className="text-2xl font-bold text-[#221815] dark:text-white">
              Review moderation
            </h2>
            <div className="mt-5 space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-3xl border border-white/60 bg-[#faf4ee] p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-[#221815] dark:text-white">
                        {review.Cafe?.name || "Cafe"}
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {review.User?.name || "User"} •{" "}
                        {review.User?.email || "unknown"}
                      </div>
                      <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                        {review.text || "No comment"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-white/5 dark:text-amber-100">
                        {review.rating}/5
                      </div>
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "users" && (
          <section className="mt-8 rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_24px_70px_rgba(74,48,33,0.12)] dark:border-white/10 dark:bg-[#1a120f]/90">
            <h2 className="text-2xl font-bold text-[#221815] dark:text-white">
              Users
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {users.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-3xl border border-white/60 bg-[#faf4ee] p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="text-lg font-semibold text-[#221815] dark:text-white">
                    {entry.name}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {entry.email}
                  </div>
                  <div className="mt-3 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-white/5 dark:text-amber-100">
                    {entry.role || "user"}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

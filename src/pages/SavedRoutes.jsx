import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiMap, FiBookOpen, FiSearch, FiClock } from "react-icons/fi";
import config from "../config";
import { useTranslation } from "react-i18next";

export default function SavedRoutes({ token }) {
  const { t } = useTranslation();
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [minStops, setMinStops] = useState(0);
  const [daysFilter, setDaysFilter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/api/Routes/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setRoutes(data);
        setFilteredRoutes(data);
      } catch (err) {
        alert(t("savedRoutes.error.loadFail"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [token, t]);

  useEffect(() => {
    const keyword = search.toLowerCase();
    const now = new Date();
    const filtered = routes
      .filter((r) => {
        const matchesSearch =
          r.name.toLowerCase().includes(keyword) ||
          (r.description && r.description.toLowerCase().includes(keyword));
        const hasMinStops =
          !minStops || (r.Places && r.Places.length >= minStops);
        const isRecent =
          !daysFilter ||
          new Date(r.savedAt || r.createdAt || 0) >=
            new Date(now.getTime() - daysFilter * 24 * 60 * 60 * 1000);
        return matchesSearch && hasMinStops && isRecent;
      })
      .sort((a, b) => {
        const dateA = new Date(a.savedAt || a.createdAt || 0);
        const dateB = new Date(b.savedAt || b.createdAt || 0);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });

    setCurrentPage(1);
    setFilteredRoutes(filtered);
  }, [search, routes, sortOrder, minStops, daysFilter]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">
        {t("savedRoutes.loading")}
      </p>
    );

  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  const paginatedRoutes = filteredRoutes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">
        <FiBookOpen /> {t("savedRoutes.title")}
      </h2>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FiSearch className="text-green-600" />
          <input
            type="text"
            placeholder={t("savedRoutes.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-green-400"
          />
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-sm text-gray-600">
            {t("savedRoutes.minStops")}
          </label>
          <input
            type="number"
            min="0"
            value={minStops}
            onChange={(e) => setMinStops(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-green-400"
          />

          <label className="text-sm text-gray-600">
            {t("savedRoutes.daysFilter")}
          </label>
          <input
            type="number"
            min="0"
            value={daysFilter}
            onChange={(e) => setDaysFilter(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-green-400"
          />

          <label className="text-sm text-gray-600">
            {t("savedRoutes.sort")}
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-green-400"
          >
            <option value="desc">{t("savedRoutes.newest")}</option>
            <option value="asc">{t("savedRoutes.oldest")}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedRoutes.map((route) => (
          <div
            key={route.id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-100 flex flex-col"
          >
            <img
              src="/forest.png"
              alt="map preview"
              className="w-full h-32 object-cover rounded-md border mb-3"
            />

            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FiMapPin /> {route.name}
            </h3>
            <p className="text-gray-600 mt-1 mb-2 text-sm">
              {route.description || t("savedRoutes.noDescription")}
            </p>

            {route.Places && route.Places.length > 0 && (
              <ul className="list-disc pl-5 text-gray-700 text-sm mb-3">
                {route.Places.map((place, idx) => (
                  <li key={idx}>{place.name}</li>
                ))}
              </ul>
            )}

            <button
              onClick={() => {
                localStorage.setItem("selectedRoute", JSON.stringify(route));
                navigate("/map-view");
              }}
              className="mt-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition flex items-center gap-2"
            >
              <FiMap /> {t("savedRoutes.viewMap")}
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border transition ${
                page === currentPage
                  ? "bg-green-600 text-white"
                  : "bg-white text-green-700 border-green-400 hover:bg-green-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

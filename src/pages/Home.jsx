import TopNearbyPlaces from "../components/TopNearbyPlaces";
import GooglePlaceInfo from "../components/GooglePlaceInfo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaSearchLocation,
  FaMapMarkedAlt,
  FaHamburger,
  FaStarHalfAlt,
  FaRobot,
  FaHeadset,
  FaMobileAlt,
  FaMap,
  FaHeart,
  FaHandsHelping,
  FaQuestionCircle,
  FaStar,
  FaUtensils,
  FaPlay,
  FaMapMarkerAlt,
} from "react-icons/fa";

function FAQSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const faqData = t("home.faqs", { returnObjects: true });

  return (
    <section className="bg-green-50 py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center mb-12">
        <h4 className="text-green-700 font-bold mb-2 text-2xl">
          ❓ {t("home.faqTitle")}
        </h4>
        <h2 className="text-3xl font-extrabold mb-4">
          {t("home.faqSubtitle")}
        </h2>
        <p className="text-gray-700 max-w-xl mx-auto text-lg">
          {t("home.faqDesc")}
        </p>
      </div>
      <div className="container mx-auto max-w-4xl space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow transition p-4 border-l-4 border-green-600"
          >
            <button
              onClick={() => toggle(index)}
              className="flex items-center w-full justify-between text-left focus:outline-none"
            >
              <div className="flex items-center gap-3 text-green-700 text-lg font-semibold">
                <FaQuestionCircle className="text-green-500 text-xl" />
                {item.question}
              </div>
              <span className="text-2xl text-green-600">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="mt-3 text-gray-700 text-base leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/chat?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      <section className="relative text-white py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/hero1.png')" }}
        >
          <div className="absolute inset-0 bg-green-900 opacity-60"></div>
        </div>
        <div className="relative z-10 container mx-auto max-w-6xl px-4">
          <div className="max-w-3xl ml-auto text-right space-y-6">
            <h4 className="uppercase font-bold tracking-widest text-green-300 text-lg flex justify-end items-center gap-2">
              <FaUtensils className="text-green-300 text-xl" />
              {t("home.hero.sub")}
            </h4>
            <h1 className="text-5xl font-extrabold uppercase leading-tight drop-shadow-md">
              {t("home.hero.title")}
            </h1>
            <p className="text-green-100 text-lg leading-relaxed">
              {t("home.hero.desc")}
            </p>
            <div className="space-x-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold rounded-full py-3 px-6 hover:bg-green-200 transition"
              >
                <FaPlay />
                {t("home.hero.ctaVideo")}
              </a>
              <a
                href="#"
                className="inline-block bg-green-800 hover:bg-green-700 rounded-full py-3 px-6 font-semibold transition"
              >
                {t("home.hero.ctaExplore")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-extrabold text-green-800 mb-4">
            💬 {t("home.ai.title")}
          </h2>
          <p className="text-gray-600 mb-6 text-base">{t("home.ai.desc")}</p>
          <form
            onSubmit={handleQuerySubmit}
            className="flex flex-col sm:flex-row items-center gap-3 justify-center"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("home.ai.inputPlaceholder")}
              className="flex-1 w-full px-5 py-3 rounded-full text-gray-800 text-sm border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition text-sm shadow-md"
            >
              {t("home.ai.button")}
            </button>
          </form>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-16">
        <TopNearbyPlaces onPlaceClick={(place) => setSelectedPlace(place)} />
        {selectedPlace && (
          <div
            className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex justify-center items-start overflow-auto pt-10"
            onClick={() => setSelectedPlace(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-3 right-4 text-green-800 text-3xl font-bold"
              >
                ✕
              </button>
              <GooglePlaceInfo
                name={selectedPlace.name}
                address={
                  selectedPlace.vicinity ||
                  selectedPlace.formatted_address ||
                  ""
                }
              />
            </div>
          </div>
        )}
      </div>

      <section className="container mx-auto py-20 px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h4 className="text-green-700 font-bold mb-2 text-2xl">
              🌿 {t("home.about.title")}
            </h4>
            <h1 className="text-4xl font-extrabold mb-4 leading-snug">
              {t("home.about.heading")}
            </h1>
            <p className="mb-8 text-gray-700 leading-relaxed text-lg">
              {t("home.about.desc")}
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-green-50 rounded-xl p-4 border-l-4 border-green-600 hover:shadow-md transition">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaMapMarkedAlt className="text-green-600 text-2xl" />
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-green-800">
                    {t("home.about.convenient.title")}
                  </h5>
                  <p className="text-gray-700">
                    {t("home.about.convenient.desc")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-green-50 rounded-xl p-4 border-l-4 border-green-600 hover:shadow-md transition">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaRobot className="text-green-600 text-2xl" />
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-green-800">
                    {t("home.about.ai.title")}
                  </h5>
                  <p className="text-gray-700">{t("home.about.ai.desc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-green-50 rounded-xl p-4 border-l-4 border-green-600 hover:shadow-md transition">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaHeadset className="text-green-600 text-2xl" />
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-green-800">
                    {t("home.about.support.title")}
                  </h5>
                  <p className="text-gray-700">
                    {t("home.about.support.desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-xl">
            <img
              src="/forest.png"
              alt="About EatAround"
              className="w-full object-cover hover:scale-105 transition duration-500"
              style={{ maxHeight: 600, minHeight: 600 }}
            />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-green-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center mb-14">
          <h4 className="text-green-700 font-bold text-2xl mb-2">
            ✨ {t("home.services.title")}
          </h4>
          <h2 className="text-4xl font-extrabold mb-4 leading-snug">
            {t("home.services.heading")}
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            {t("home.services.desc")}
          </p>
        </div>
        <div className="container mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {t("home.services.items", { returnObjects: true }).map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 text-center"
            >
              <div className="bg-green-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h5 className="text-xl font-semibold text-green-800 mb-2">
                {item.title}
              </h5>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl py-20 px-4">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h4 className="text-green-700 font-bold mb-2 text-2xl">
            🌟 {t("home.benefits.title")}
          </h4>
          <h2 className="text-3xl font-extrabold mb-4">
            {t("home.benefits.heading")}
          </h2>
          <p className="text-gray-700 max-w-xl mx-auto text-lg">
            {t("home.benefits.desc")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {t("home.benefits.items", { returnObjects: true }).map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 bg-green-50 rounded-2xl border-l-4 border-green-600 hover:shadow-md transition"
            >
              <div className="bg-green-100 p-3 rounded-full">{item.icon}</div>
              <div>
                <h5 className="text-xl font-semibold text-green-800 mb-1">
                  {item.title}
                </h5>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FAQSection />

      <section className="bg-green-50 py-20 px-4">
        <div className="text-center max-w-4xl mx-auto mb-14">
          <h4 className="text-green-700 font-bold mb-2 text-2xl">
            💬 {t("home.testimonials.title")}
          </h4>
          <h2 className="text-3xl font-extrabold mb-4">
            {t("home.testimonials.heading")}
          </h2>
          <p className="text-gray-700 max-w-xl mx-auto text-lg">
            {t("home.testimonials.desc")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {t("home.testimonials.items", { returnObjects: true }).map(
            (user, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition"
              >
                <div className="mb-4">
                  <img
                    src="/user_avatar.png"
                    alt={user.name}
                    className="rounded-full w-20 h-20 mx-auto"
                  />
                </div>
                <div className="flex justify-center text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="italic text-gray-700 mb-4 text-center">
                  “{user.quote}”
                </p>
                <p className="font-semibold text-green-700 text-center">
                  {user.name}
                </p>
                <p className="text-center text-gray-600">{user.role}</p>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Header({ onLogout }) {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const dropdownRef = useRef();
  const langRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src="/vn.png" alt="Logo" className="h-14 w-auto" />
          <h1
            className="text-xl sm:text-2xl font-bold text-green-700 select-none"
            style={{ fontFamily: "iCielBC Lodestone, sans-serif" }}
          >
            Eat Around
          </h1>
        </Link>

        {/* Language Switcher */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1 border border-green-300 rounded-md text-sm text-green-700 hover:bg-green-100 transition"
          >
            🌐 {i18n.language === "vi" ? "VN" : "EN"}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {langDropdownOpen && (
            <ul className="absolute right-0 mt-2 bg-white border rounded shadow text-sm z-50">
              <li>
                <button
                  onClick={() => changeLanguage("vi")}
                  className="block w-full px-4 py-2 hover:bg-green-100"
                >
                  🇻🇳 Tiếng Việt
                </button>
              </li>
              <li>
                <button
                  onClick={() => changeLanguage("en")}
                  className="block w-full px-4 py-2 hover:bg-green-100"
                >
                  🇬🇧 English
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* Hamburger for mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-md text-green-700 hover:bg-green-100 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Main Nav */}
        <nav
          className={`${
            menuOpen ? "block" : "hidden"
          } lg:flex flex-col lg:flex-row lg:items-center absolute lg:static top-full left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow lg:shadow-none transition-all duration-200 lg:translate-y-0`}
        >
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 text-green-700 font-semibold hover:text-green-500"
          >
            {t("header.home")}
          </Link>
          <Link
            to="/chat"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 text-green-700 font-semibold hover:text-green-500"
          >
            {t("header.chatbot")}
          </Link>
          {username && (
            <>
              <Link
                to="/posts"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-green-700 font-semibold hover:text-green-500"
              >
                {t("header.posts")}
              </Link>
              <Link
                to="/saved"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-green-700 font-semibold hover:text-green-500"
              >
                {t("header.savedRoutes")}
              </Link>
            </>
          )}
          {username ? (
            <div className="relative px-4 py-2" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 text-green-700 font-semibold hover:text-green-500 focus:outline-none"
              >
                <span className="hidden sm:inline">
                  👋 {t("header.hello")}, <strong>{username}</strong>
                </span>
                <img
                  src="/user_avatar.png"
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {userDropdownOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50">
                  <li>
                    <Link
                      to="/trang-ca-nhan"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                      className="block px-4 py-2 hover:bg-green-100 text-green-700"
                    >
                      {t("header.profile")}
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                    >
                      {t("header.logout")}
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 mt-2 lg:mt-0 bg-green-600 hover:bg-green-700 text-white rounded transition"
            >
              {t("header.login")}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

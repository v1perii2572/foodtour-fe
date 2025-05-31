import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Header({ username, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src="/vn.png" alt="Logo" className="h-20 w-auto" />
          <h1
            className="text-2xl font-bold text-green-700 select-none"
            style={{ fontFamily: "iCielBC Lodestone" }}
          >
            Eat Around
          </h1>
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-md text-green-700 hover:bg-green-100 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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

        <nav
          className={`flex flex-col lg:flex-row lg:items-center lg:gap-6 absolute lg:static bg-white lg:bg-transparent w-full lg:w-auto left-0 top-full lg:top-auto shadow lg:shadow-none transition-transform transform lg:translate-x-0 ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          } lg:translate-y-0`}
        >
          <Link
            to="/"
            className="block px-4 py-2 text-green-700 font-semibold hover:text-green-400 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Trang chủ
          </Link>

          <Link
            to="/chat"
            className="block px-4 py-2 text-green-700 font-semibold hover:text-green-400 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Chat
          </Link>

          {username ? (
            <>
              <Link
                to="/saved"
                className="block px-4 py-2 text-green-700 font-semibold hover:text-green-400 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Lộ trình đã lưu
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 px-4 py-2 text-green-700 font-semibold hover:text-green-400 focus:outline-none"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <span>
                    👋 Xin chào, <strong>{username}</strong>
                  </span>
                  <img
                    src="/user_avatar.png"
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <svg
                    className="w-4 h-4 text-green-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <ul className="absolute right-0 mt-1 bg-white border border-green-200 rounded shadow-md w-48 z-50">
                    <li>
                      <Link
                        to="/chu-san"
                        className="block px-4 py-2 hover:bg-green-100 text-green-700"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setMenuOpen(false);
                        }}
                      >
                        Trang quản trị
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/trang-ca-nhan"
                        className="block px-4 py-2 hover:bg-green-100 text-green-700"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setMenuOpen(false);
                        }}
                      >
                        Thông tin cá nhân
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
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-4 py-2 mt-2 lg:mt-0 bg-green-600 hover:bg-green-700 text-white rounded transition"
              onClick={() => setMenuOpen(false)}
            >
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

import React from "react";
import Login from "../components/Login";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function LoginPage({ onLogin }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-green-700 flex items-center justify-center gap-2">
            <FiLogIn className="text-4xl" /> {t("login.title")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{t("login.subtitle")}</p>
        </div>

        <Login onLogin={onLogin} />

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">{t("login.noAccount")}</p>
          <Link
            to="/register"
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded shadow"
          >
            <FiUserPlus /> {t("login.registerNow")}
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import {
  FiStar,
  FiCalendar,
  FiCreditCard,
  FiMessageSquare,
  FiPercent,
  FiGift,
} from "react-icons/fi";
import config from "../config";
import { useTranslation } from "react-i18next";

const plans = [
  {
    id: "free",
    price: 0,
    days: 3,
    chats: 5,
    benefit: "subscription.benefit.trial",
    savings: 0,
  },
  {
    id: "week",
    price: 49000,
    days: 7,
    chats: 10,
    benefit: "",
    savings: 0,
  },
  {
    id: "month",
    price: 129000,
    days: 30,
    chats: 20,
    benefit: "subscription.benefit.dislikedSuggestion",
    savings: 67000,
  },
  {
    id: "3months",
    price: 339000,
    days: 90,
    chats: 35,
    benefit: "subscription.benefit.dislikedSuggestion",
    savings: 108000,
  },
];

function calculateSavings(currentIndex) {
  if (currentIndex <= 1) return 0;
  const currentPlan = plans[currentIndex];
  const weeklyEquivalent = (currentPlan.days / 7) * plans[1].price;
  const savings = weeklyEquivalent - currentPlan.price;
  return Math.round((savings / weeklyEquivalent) * 100);
}

export default function SubscriptionPage({ token }) {
  const { t } = useTranslation();
  const API_BASE_URL = config.apiUrl;

  const handleSubscribe = async (amount, days) => {
    const userId = localStorage.getItem("userId");

    if (amount === 0) {
      alert(t("subscription.alert.free"));
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/Payment/link?amount=${amount}&extraData=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (data.payUrl) {
        window.location.href = data.payUrl;
      } else {
        alert(t("subscription.alert.failed"));
      }
    } catch (err) {
      alert(t("subscription.alert.error"));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <h2 className="text-3xl font-bold mb-8 text-green-700 flex items-center gap-3">
        <FiStar className="text-3xl" /> {t("subscription.title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            className="border border-green-300 rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition duration-300"
          >
            <div>
              <h3 className="text-2xl font-semibold text-green-800 mb-3">
                {t(`subscription.plan.${plan.id}`)}
              </h3>
              <p className="text-gray-700 flex items-center gap-2 mb-1">
                <FiCalendar /> {plan.days} {t("subscription.days")}
              </p>
              <p className="text-gray-700 flex items-center gap-2 mb-1">
                <FiMessageSquare /> {plan.chats} {t("subscription.chatPerDay")}
              </p>
              <p className="text-gray-700 flex items-center gap-2 mb-1">
                <FiGift />{" "}
                {plan.benefit
                  ? t(plan.benefit)
                  : t("subscription.benefit.none")}
              </p>
              {index > 1 && (
                <p className="text-sm text-green-600 flex items-center gap-2 mt-2">
                  <FiPercent />{" "}
                  {t("subscription.savings", {
                    percent: calculateSavings(index),
                  })}
                </p>
              )}
              <p className="text-2xl font-bold text-green-600 mt-4">
                {plan.price === 0
                  ? t("subscription.free")
                  : `${plan.price.toLocaleString()} ₫`}
              </p>
            </div>
            <button
              onClick={() => handleSubscribe(plan.price, plan.days)}
              className={`mt-6 ${
                plan.price === 0
                  ? "bg-gray-400 hover:bg-gray-500"
                  : "bg-green-600 hover:bg-green-700"
              } text-white px-6 py-3 rounded-lg flex items-center gap-2 justify-center text-lg`}
            >
              <FiCreditCard />
              {plan.price === 0
                ? t("subscription.button.trial")
                : t("subscription.button.buy")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

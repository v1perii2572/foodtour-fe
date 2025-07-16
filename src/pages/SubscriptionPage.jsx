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

const plans = [
  {
    name: "3 Ngày (Miễn phí)",
    price: 0,
    days: 3,
    chats: 5,
    benefit: "Dùng thử giới hạn",
    savings: 0,
  },
  {
    name: "1 Tuần",
    price: 49000,
    days: 7,
    chats: 10,
    benefit: "",
    savings: 0,
  },
  {
    name: "1 Tháng",
    price: 129000,
    days: 30,
    chats: 20,
    benefit: "Gợi ý món không thích",
    savings: 67000,
  },
  {
    name: "3 Tháng",
    price: 339000, // giảm so với gói 6 tháng cũ
    days: 90,
    chats: 35,
    benefit: "Gợi ý món không thích",
    savings: 108000, // tùy chỉnh hợp lý
  },
];

function calculateSavings(currentIndex) {
  if (currentIndex <= 1) return 0;
  const currentPlan = plans[currentIndex];
  const weeklyEquivalent = (currentPlan.days / 7) * plans[1].price; // so sánh với gói 1 tuần
  const savings = weeklyEquivalent - currentPlan.price;
  return Math.round((savings / weeklyEquivalent) * 100);
}

export default function SubscriptionPage({ token }) {
  const API_BASE_URL = config.apiUrl;

  const handleSubscribe = async (amount, days) => {
    const userId = localStorage.getItem("userId");

    if (amount === 0) {
      alert("Gói miễn phí đã được kích hoạt!");
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
        alert("Không thể tạo liên kết thanh toán.");
      }
    } catch (err) {
      alert("Lỗi khi tạo giao dịch.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <h2 className="text-3xl font-bold mb-8 text-green-700 flex items-center gap-3">
        <FiStar className="text-3xl" /> Nâng cấp tài khoản VIP để nhận nhiều ưu
        đãi 🎉
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className="border border-green-300 rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition duration-300"
          >
            <div>
              <h3 className="text-2xl font-semibold text-green-800 mb-3">
                {plan.name}
              </h3>
              <p className="text-gray-700 flex items-center gap-2 mb-1">
                <FiCalendar /> {plan.days} ngày sử dụng
              </p>
              <p className="text-gray-700 flex items-center gap-2 mb-1">
                <FiMessageSquare /> {plan.chats} lượt chat bot mỗi ngày
              </p>
              <p className="text-gray-700 flex items-center gap-2 mb-1">
                <FiGift /> {plan.benefit || "Không có ưu đãi thêm"}
              </p>
              {index > 1 && (
                <p className="text-sm text-green-600 flex items-center gap-2 mt-2">
                  <FiPercent /> Tiết kiệm {calculateSavings(index)}% so với mua
                  lẻ
                </p>
              )}
              <p className="text-2xl font-bold text-green-600 mt-4">
                {plan.price === 0
                  ? "Miễn phí"
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
              <FiCreditCard /> {plan.price === 0 ? "Dùng thử miễn phí" : "Mua ngay"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiShield,
  FiCalendar,
  FiSave,
  FiEdit2,
  FiStar,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import config from "../config";

export default function ProfilePage({ token }) {
  const [name, setName] = useState("");
  const [dislikedFoods, setDislikedFoods] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [subscriptionDate, setSubscriptionDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = config.apiUrl;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/User/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);
          setName(data.name || "");
          setDislikedFoods((data.dislikedFoods || []).join(", "));
          setEmail(data.email || "");
          setRole(data.role || "");
          setSubscriptionDate(data.subscriptionDate || "");
          localStorage.setItem("userId", data.id);
          setLoading(false);
        } catch (err) {
          console.error("❌ Không phải JSON:", text);
          setError("Phản hồi từ server không hợp lệ.");
          setLoading(false);
        }
      })
      .catch(() => {
        setError("Không thể kết nối đến máy chủ.");
        setLoading(false);
      });
  }, [token]);

  const handleSave = async () => {
    setSuccess(false);
    setError("");

    const res = await fetch(`${API_BASE_URL}/api/User/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        dislikedFoods: dislikedFoods
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      }),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      setError("Không thể cập nhật thông tin.");
    }
  };

  if (loading)
    return <div className="p-4 text-gray-600">Đang tải thông tin...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-2">
        <FiUser /> Thông tin cá nhân
      </h2>

      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
      {success && (
        <div className="mb-4 text-green-600 font-medium">
          ✅ Đã cập nhật thành công!
        </div>
      )}

      <div className="mb-4">
        <label className="block font-medium text-gray-700 flex items-center gap-2">
          <FiMail /> Email
        </label>
        <div className="p-2 border rounded bg-gray-100 text-gray-700">
          {email}
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 flex items-center gap-2">
          <FiShield /> Vai trò
        </label>
        <div className="p-2 border rounded bg-gray-100 text-gray-700">
          {role}
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 flex items-center gap-2">
          <FiCalendar /> Ngày hết hạn
        </label>
        <div className="p-2 border rounded bg-gray-100 text-gray-700">
          {subscriptionDate
            ? new Date(subscriptionDate).toLocaleDateString()
            : "Không có"}
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 flex items-center gap-2">
          <FiEdit2 /> Tên của bạn
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-green-400"
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium text-gray-700 flex items-center gap-2">
          <FiEdit2 /> Món không thích
        </label>
        <input
          type="text"
          value={dislikedFoods}
          onChange={(e) => setDislikedFoods(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-green-400"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2"
        >
          <FiSave /> Lưu thay đổi
        </button>

        <Link
          to="/goi-dang-ky"
          className="inline-flex items-center gap-2 text-green-700 border border-green-600 px-4 py-2 rounded hover:bg-green-100"
        >
          <FiStar /> Nâng cấp VIP ngay
        </Link>
      </div>
    </div>
  );
}

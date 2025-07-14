import { useState, useEffect } from "react";
import { FaPaperPlane, FaSave, FaUser, FaRobot } from "react-icons/fa";
import config from "../config";
import { useLocation } from "react-router-dom";

export default function Chat({ token, onPlacesSelected }) {
  const [messages, setMessages] = useState([]);
  const location = useLocation();

  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  const [canSaveRoute, setCanSaveRoute] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [routeName, setRouteName] = useState("");

  const [mode, setMode] = useState("route");
  const [mood, setMood] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialQ = params.get("q");
    if (initialQ && messages.length === 0) {
      setInput(initialQ);
      setTimeout(() => {
        handleSend(initialQ);
      }, 300);
    }
  }, [location.search]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Lỗi vị trí:", error);
          setUserLocation({ lat: 0, lng: 0 });
        }
      );
    }
  }, []);

  const handleSend = async (customInput) => {
    const msg = customInput ?? input;
    if (!msg.trim()) return;

    const userMsg = { role: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setCanSaveRoute(false);

    try {
      const res = await fetch(`${config.apiUrl}/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          message: msg,
          lat: userLocation.lat,
          lng: userLocation.lng,
          mode,
          mood,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        alert(`Lỗi server: ${errText}`);
        return;
      }

      const data = await res.json();
      setSessionId(data.sessionId);
      const replyText = typeof data.reply === "string" ? data.reply : "";
      const cleanReply = replyText.replace(/\n\s*\n/g, "\n");

      setMessages((prev) => [...prev, { role: "assistant", text: cleanReply }]);
      setCanSaveRoute(mode === "route");
      setInput("");
    } catch (error) {
      alert("Gửi thất bại");
      console.error(error);
    }
  };

  const handleSaveRoute = async () => {
    if (!routeName.trim()) {
      alert("Vui lòng nhập tên lộ trình!");
      return;
    }
    try {
      const res = await fetch(`${config.apiUrl}/api/chat/save-route`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          customName: routeName.trim(),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        alert(`Lưu thất bại: ${errText}`);
        return;
      }

      setCanSaveRoute(false);
      setShowSaveModal(false);
      setRouteName("");
    } catch (err) {
      alert("Lưu thất bại");
      console.error(err);
    }
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex flex-col md:flex-row gap-2">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border px-3 py-2 rounded text-sm w-full md:w-52"
        >
          <option value="route">🗺️ Gợi ý theo lộ trình</option>
          <option value="place">📍 Gợi ý quán ăn lẻ</option>
        </select>

        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="border px-3 py-2 rounded text-sm w-full md:w-48"
        >
          <option value="">🎯 Dịp (tuỳ chọn)</option>
          <option value="hẹn hò">💖 Hẹn hò</option>
          <option value="đi chơi">🎉 Đi chơi</option>
          <option value="ăn tối muộn">🌙 Ăn tối muộn</option>
          <option value="ăn nhanh">⚡ Ăn nhanh</option>
          <option value="tụ họp bạn bè">🍻 Tụ họp bạn bè</option>
        </select>
      </div>

      <div className="h-[320px] overflow-y-auto p-4 bg-green-50 border border-green-100 rounded-xl shadow-inner space-y-3 text-sm leading-relaxed">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <FaRobot className="mt-1 text-green-600" title="AI" />
            )}
            {m.role === "user" && (
              <FaUser className="mt-1 text-green-700" title="Bạn" />
            )}
            <div
              className={`px-3 py-2 rounded-lg max-w-xs whitespace-pre-line ${
                m.role === "user"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-800 border"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border border-green-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
        />
        <button
          onClick={handleSend}
          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition"
          title="Gửi"
        >
          <FaPaperPlane />
        </button>
      </div>

      {canSaveRoute && sessionId && (
        <div className="text-right">
          <button
            onClick={() => setShowSaveModal(true)}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium"
          >
            <FaSave /> Lưu lộ trình
          </button>
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[320px] shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-green-700">
              Đặt tên cho lộ trình
            </h3>
            <input
              type="text"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="Nhập tên lộ trình..."
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setRouteName("");
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveRoute}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

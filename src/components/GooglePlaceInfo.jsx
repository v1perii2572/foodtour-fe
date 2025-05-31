import {
  FaPhoneAlt,
  FaGlobe,
  FaMoneyBillAlt,
  FaStar,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { useEffect, useState } from "react";

export default function GooglePlaceInfo({ name, address }) {
  const [data, setData] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        setError(null);
        setData(null);
        const response = await fetch(
          "https://localhost:7298/api/Place/details",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: name + ", " + address }),
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Lỗi khi gọi backend");
        }

        const json = await response.json();

        if (!json) throw new Error("Không tìm thấy dữ liệu");

        setData(json);
      } catch (err) {
        setError(err.message);
      }
    };

    if (name && address) {
      fetchPlaceDetails();
    }
  }, [name, address]);

  const priceLevelToVND = (level) => {
    const map = {
      0: "Miễn phí",
      1: "1–100.000 ₫",
      2: "100.000–300.000 ₫",
      3: "300.000–600.000 ₫",
      4: "600.000+ ₫",
    };
    return map[level] || "Không rõ";
  };

  if (error)
    return (
      <p className="text-red-600 italic font-semibold my-6 text-center">
        Lỗi: {error}
      </p>
    );

  if (!data)
    return (
      <p className="text-gray-500 italic my-6 text-center">
        Đang tải thông tin cho:{" "}
        <strong className="font-semibold">{name}</strong>
      </p>
    );

  return (
    <>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-3xl p-8 mt-8 mb-12">
        <h2 className="text-3xl font-extrabold text-green-700 mb-6 border-b-4 border-green-500 pb-2">
          {data.name}
        </h2>

        <ul className="space-y-4 text-gray-800 text-lg">
          <li className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-green-600 text-2xl flex-shrink-0" />
            <span className="truncate">{data.formatted_address}</span>
          </li>
          {data.rating && (
            <li className="flex items-center gap-4">
              <FaStar className="text-yellow-400 text-2xl flex-shrink-0" />
              <span>
                <strong>{data.rating.toFixed(1)}</strong> / 5.0 (
                {data.user_ratings_total.toLocaleString()} đánh giá)
              </span>
            </li>
          )}
          {data.formatted_phone_number && (
            <li className="flex items-center gap-4">
              <FaPhoneAlt className="text-blue-600 text-2xl flex-shrink-0" />
              <a
                href={`tel:${data.formatted_phone_number}`}
                className="hover:underline text-blue-700"
              >
                {data.formatted_phone_number}
              </a>
            </li>
          )}
          {data.price_level !== undefined && (
            <li className="flex items-center gap-4">
              <FaMoneyBillAlt className="text-green-700 text-2xl flex-shrink-0" />
              <span>
                Giá tham khảo:{" "}
                <strong>{priceLevelToVND(data.price_level)}</strong>
              </span>
            </li>
          )}
          {data.website && (
            <li className="flex items-center gap-4 break-all">
              <FaGlobe className="text-indigo-600 text-2xl flex-shrink-0" />
              <a
                href={data.website}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-700 hover:underline"
              >
                {data.website}
              </a>
            </li>
          )}
        </ul>

        {data.opening_hours?.weekday_text && (
          <div className="mt-8">
            <h3 className="flex items-center gap-3 text-green-600 font-semibold text-xl mb-3">
              <MdAccessTime className="text-green-700 text-3xl" />
              Giờ mở cửa
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-lg">
              {data.opening_hours.weekday_text.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>
        )}

        {data.photos && (
          <div className="flex gap-5 overflow-x-auto mt-10 pb-3 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-200">
            {data.photos
              .filter((photo) => photo.photoUrl)
              .slice(0, 6)
              .map((photo, idx) => (
                <img
                  key={idx}
                  src={photo.photoUrl}
                  alt={`${data.name} photo ${idx + 1}`}
                  className="w-60 h-40 object-cover rounded-2xl border border-gray-300 cursor-pointer shadow-lg hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedPhoto(photo.photoUrl)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/forest.png";
                  }}
                  loading="lazy"
                />
              ))}
          </div>
        )}

        {data.reviews && (
          <div className="mt-12 space-y-6 text-gray-800">
            <h3 className="text-2xl font-bold text-green-700 mb-4">
              🗣️ Đánh giá gần đây
            </h3>
            {data.reviews.slice(0, 3).map((review, idx) => (
              <blockquote
                key={idx}
                className="border-l-6 border-green-400 pl-6 italic bg-green-50 rounded-2xl py-4 px-6 shadow-md"
              >
                “{review.text}”
                <footer className="mt-2 font-semibold text-gray-900">
                  — {review.author_name}
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Phóng to"
            className="max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

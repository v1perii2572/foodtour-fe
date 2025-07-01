import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaStar, FaUtensils } from "react-icons/fa";
import config from "../config";

function PlaceCard({ place, onClick }) {
  const apiKey = config.google1ApiKey;

  const photoUrl = place.photos?.[0]?.photo_reference
    ? `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
    : "/no-image.png";

  return (
    <div
      onClick={() => onClick(place)}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col"
    >
      <img
        src={photoUrl}
        alt={place.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center gap-2">
          <FaUtensils className="text-green-600" /> {place.name}
        </h3>
        <p className="text-gray-600 text-sm mb-1 flex items-center gap-2">
          <FaMapMarkerAlt className="text-green-500" />
          {place.vicinity ||
            place.formatted_address ||
            "Địa chỉ không xác định"}
        </p>
        {place.rating !== undefined && (
          <p className="text-yellow-500 font-semibold mt-auto flex items-center gap-1">
            <FaStar />
            {place.rating} ({place.user_ratings_total} đánh giá)
          </p>
        )}
      </div>
    </div>
  );
}

export default function TopNearbyPlaces({ onPlaceClick }) {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
      },
      (err) => {
        console.error("Lỗi khi lấy vị trí:", err);
      }
    );
  }, []);

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      if (!location) return;

      try {
        const res = await fetch(
          `${config.apiUrl}/api/Places/nearby-google?lat=${location.latitude}&lng=${location.longitude}`
        );
        const data = await res.json();

        if (Array.isArray(data.results)) {
          const filtered = data.results.filter(
            (p) =>
              p.photos?.length > 0 &&
              p.user_ratings_total !== undefined &&
              p.user_ratings_total > 0
          );

          setPlaces(filtered.slice(0, 9));
        } else {
          console.error("Unexpected response format", data);
          setPlaces([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải quán ăn gần bạn:", error);
      }
    };

    fetchNearbyPlaces();
  }, [location]);

  if (places.length === 0) {
    return (
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-green-700">
          Top quán ăn gần bạn
        </h3>
        <p>Không tìm thấy quán ăn nào gần đây.</p>
      </div>
    );
  }

  return (
    <section>
      <h3 className="text-3xl font-bold mb-6 text-green-700">
        Top quán ăn gần bạn
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place, idx) => (
          <PlaceCard key={idx} place={place} onClick={onPlaceClick} />
        ))}
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import MapRoute from "./MapRoute";

export default function SelectedRouteMap({ places }) {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("📍 Vị trí người dùng:", latitude, longitude);
        setUserLocation({ latitude, longitude });
      },
      (err) => {
        console.error("❌ Lỗi khi lấy vị trí người dùng:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  if (!Array.isArray(places) || places.length === 0) {
    console.warn("⚠️ places không hợp lệ hoặc rỗng.");
    return <p>Không có lộ trình nào để hiển thị.</p>;
  }

  console.log("🧭 Lộ trình ban đầu từ props:", places);

  const normalizedPlaces = places.map((p) => ({
    ...p,
    latitude: p.latitude ?? p.lat,
    longitude: p.longitude ?? p.lng,
  }));

  const validPlaces = normalizedPlaces.filter(
    (p) =>
      typeof p.latitude === "number" &&
      typeof p.longitude === "number" &&
      !isNaN(p.latitude) &&
      !isNaN(p.longitude)
  );

  console.log("✅ Địa điểm hợp lệ:", validPlaces);

  const fullRoute = userLocation
    ? [
        {
          name: "Vị trí của bạn",
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        ...validPlaces,
      ]
    : validPlaces;

  console.log("📌 Route đầy đủ:", fullRoute);

  return (
    <div style={{ height: "400px", marginTop: 20 }}>
      <MapRoute places={fullRoute} />
    </div>
  );
}

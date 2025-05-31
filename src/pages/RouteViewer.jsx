import { useEffect, useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import MapRoute from "../components/MapRoute";
import GooglePlaceInfo from "../components/GooglePlaceInfo";
import { FaMapMarkedAlt, FaRoute } from "react-icons/fa";
import config from "../config";

const GOOGLE_API_KEY = config.google2ApiKey;

export default function RouteViewer() {
  const [route, setRoute] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedRoute");
    if (stored) {
      setRoute(JSON.parse(stored));
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            name: "Vị trí hiện tại",
            address: "",
          });
        },
        (error) => {
          console.warn("Không lấy được vị trí người dùng:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.warn("Trình duyệt không hỗ trợ Geolocation");
    }
  }, []);

  if (!route) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg italic">
        Đang tải lộ trình...
      </div>
    );
  }

  let normalizedPlaces =
    route.places
      ?.map((p) => ({
        ...p,
        latitude: p.latitude ?? p.lat,
        longitude: p.longitude ?? p.lng,
      }))
      .filter((p) => p.latitude && p.longitude) ?? [];

  if (userLocation) {
    normalizedPlaces = [userLocation, ...normalizedPlaces];
  }

  const uniquePlaces = normalizedPlaces.filter(
    (place, index, self) =>
      index ===
      self.findIndex(
        (p) => p.name === place.name && p.address === place.address
      )
  );

  const placesForInfo = uniquePlaces.filter(
    (p) => p.name && p.address && p.name !== "Vị trí hiện tại"
  );

  return (
    <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={["places"]}>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        <div className="border-b pb-4">
          <h2 className="text-4xl font-extrabold text-green-700 flex items-center gap-2">
            <FaMapMarkedAlt className="text-green-500" />
            Lộ trình: {route.name}
          </h2>

          <a
            href={buildRouteLink(uniquePlaces)}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition"
          >
            <FaRoute />
            Xem chỉ đường toàn tuyến
          </a>
        </div>

        {uniquePlaces.length >= 2 && (
          <div className="relative h-[400px] rounded-xl shadow-md overflow-hidden">
            <MapRoute places={uniquePlaces} />
          </div>
        )}

        <div>
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            Chi tiết các quán ăn trong lộ trình
          </h3>
          <div className="space-y-6">
            {placesForInfo.map((place, idx) => (
              <GooglePlaceInfo
                key={idx}
                name={place.name}
                address={place.address}
              />
            ))}
          </div>
        </div>
      </div>
    </LoadScript>
  );

  function buildRouteLink(places) {
    if (!places || places.length < 2) return "#";

    const origin = `${places[0].latitude},${places[0].longitude}`;
    const destination = `${places[places.length - 1].latitude},${
      places[places.length - 1].longitude
    }`;
    const waypoints = places
      .slice(1, -1)
      .map((p) => `${p.latitude},${p.longitude}`)
      .join("|");

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}`;
  }
}

import { GoogleMap, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { useEffect, useState, useCallback } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function MapRoute({ places }) {
  const [directions, setDirections] = useState(null);

  const handleLoad = useCallback(() => {
    if (!places || places.length < 2) return;

    const origin = { lat: places[0].latitude, lng: places[0].longitude };
    const destination = {
      lat: places[places.length - 1].latitude,
      lng: places[places.length - 1].longitude,
    };
    const waypoints = places.slice(1, -1).map((p) => ({
      location: { lat: p.latitude, lng: p.longitude },
      stopover: true,
    }));

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Directions error:", status);
        }
      }
    );
  }, [places]);

  useEffect(() => {
    if (window.google && window.google.maps) {
      handleLoad();
    }
  }, [handleLoad]);

  if (!places || places.length < 2) {
    return (
      <div className="text-sm italic text-gray-500">
        Cần ít nhất 2 điểm để hiển thị bản đồ.
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: places[0].latitude, lng: places[0].longitude }}
      zoom={14}
    >
      {places.map((place, idx) => (
        <Marker
          key={idx}
          position={{ lat: place.latitude, lng: place.longitude }}
          label={`${idx + 1}`}
        />
      ))}

      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{ suppressMarkers: true }}
        />
      )}
    </GoogleMap>
  );
}

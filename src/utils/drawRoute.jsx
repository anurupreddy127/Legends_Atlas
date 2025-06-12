import { animateSeaRoute } from "./animateSeaRoute";
import { animateFlightPath } from "./animateFlightPath";

export function drawRoute({
  origin,
  destination,
  mapRef,
  onDone,
  pathType = "road",
  midpoints = [],
}) {
  if (!mapRef?.current || !origin || !destination) {
    console.error("❌ Missing mapRef or coordinates for drawRoute");
    onDone?.([]);
    return;
  }

  if (pathType === "water") {
    animateSeaRoute({ origin, destination, midpoints, mapRef, onDone });
    return;
  }

  if (pathType === "flight") {
    animateFlightPath({
      origin,
      destination,
      midpoints,
      mapRef,
      onDone,
    });
    return;
  }

  // 🛣️ Default: road (Google API)
  const directionsService = new window.google.maps.DirectionsService();

  directionsService.route(
    {
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        const path = result.routes[0].overview_path;

        // 📦 Expand bounds to include all path points
        const bounds = new window.google.maps.LatLngBounds();
        path.forEach((point) => bounds.extend(point));

        // 🧠 Padding to avoid card overlap (right side)
        const paddingOptions = {
          top: 50,
          bottom: 50,
          left: 50,
          right: 400, // This should match width + spacing of SubstoryCard
        };

        mapRef.current?.fitBounds(bounds, {
          maxZoom: 9,
          padding: paddingOptions,
        });

        onDone?.(path);
      } else {
        console.warn(
          "⚠️ Google Directions API failed, falling back to straight line:",
          status
        );

        // 🛟 Fallback line if Directions API fails
        if (
          typeof origin.lat === "number" &&
          typeof origin.lng === "number" &&
          typeof destination.lat === "number" &&
          typeof destination.lng === "number"
        ) {
          const fallbackPath = [
            new window.google.maps.LatLng(origin.lat, origin.lng),
            new window.google.maps.LatLng(destination.lat, destination.lng),
          ];

          const bounds = new window.google.maps.LatLngBounds();
          fallbackPath.forEach((point) => bounds.extend(point));

          const paddingOptions = {
            top: 50,
            bottom: 50,
            left: 50,
            right: 400,
          };

          mapRef.current?.fitBounds(bounds, {
            maxZoom: 9,
            padding: paddingOptions,
          });

          onDone?.(fallbackPath);
        } else {
          console.error(
            "❌ Invalid fallback coordinates:",
            origin,
            destination
          );
          onDone?.([]);
        }
      }
    }
  );
}

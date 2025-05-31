// utils/drawRoute.js

export function drawRoute({ origin, destination, mapRef, onDone }) {
  const directionsService = new window.google.maps.DirectionsService();

  directionsService.route(
    {
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        const path = result.routes[0].overview_path; // LatLng[] ✔️

        // Fit bounds before animating
        const bounds = new window.google.maps.LatLngBounds();
        path.forEach((point) => bounds.extend(point));
        mapRef.current?.fitBounds(bounds);

        // return path to animate
        onDone?.(path);
      } else {
        console.warn("⚠️ No driving route found, using fallback line.");
        onDone?.([
          new window.google.maps.LatLng(origin.lat, origin.lng),
          new window.google.maps.LatLng(destination.lat, destination.lng),
        ]);
      }
    }
  );
}

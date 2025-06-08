export function animateSeaRoute({ origin, destination, mapRef, onDone }) {
  const map = mapRef.current;
  if (!map) return;

  const originLatLng = new window.google.maps.LatLng(origin.lat, origin.lng);
  const destinationLatLng = new window.google.maps.LatLng(
    destination.lat,
    destination.lng
  );

  const totalSteps = 200;
  let step = 0;

  const marker = new window.google.maps.Marker({
    map,
    position: originLatLng,
    icon: {
      path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 5,
      strokeColor: "blue",
    },
    zIndex: 1002,
  });

  // Step 1: Zoom out to fit both points
  const bounds = new window.google.maps.LatLngBounds();
  bounds.extend(originLatLng);
  bounds.extend(destinationLatLng);

  // Fit map first with a callback
  map.fitBounds(bounds, {
    top: 50,
    bottom: 50,
    left: 50,
    right: 400,
  });

  // Step 2: After a short delay (allow fitBounds to render), start animation
  setTimeout(() => {
    const deltaLat = (destination.lat - origin.lat) / totalSteps;
    const deltaLng = (destination.lng - origin.lng) / totalSteps;

    function moveMarker() {
      step++;
      const newLat = origin.lat + deltaLat * step;
      const newLng = origin.lng + deltaLng * step;
      const newPosition = new window.google.maps.LatLng(newLat, newLng);
      marker.setPosition(newPosition);

      if (step < totalSteps) {
        requestAnimationFrame(moveMarker);
      } else {
        marker.setPosition(destinationLatLng);
        onDone?.([destinationLatLng]);
      }
    }

    moveMarker();
  }, 500); // slight delay so fitBounds renders before moving
}

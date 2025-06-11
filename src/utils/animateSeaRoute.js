/* eslint-disable no-unused-vars */
export function animateSeaRoute({
  origin,
  destination,
  mapRef,
  onDone,
  midpoints = [],
}) {
  const map = mapRef.current;
  if (!map) return;

  // 🔹 Remove all default markers before animation begins
  Array.from(map?.__gm?.overlays || []).forEach((overlay) => {
    if (overlay.setMap) overlay.setMap(null);
  });

  // 🔹 Construct full path
  const fullPath = [
    new window.google.maps.LatLng(origin.lat, origin.lng),
    ...midpoints.map((p) => new window.google.maps.LatLng(p.lat, p.lng)),
    new window.google.maps.LatLng(destination.lat, destination.lng),
  ];

  // 🔹 Create the animated blue marker
  const marker = new window.google.maps.Marker({
    map,
    position: fullPath[0],
    icon: {
      url: "/src/assets/boat.svg",
      scaledSize: new window.google.maps.Size(60, 60), // adjust size as needed
      anchor: new window.google.maps.Point(20, 20), // optional, centers the icon
    },
    zIndex: 1002,
  });

  // 🔹 Fit bounds to path
  const bounds = new window.google.maps.LatLngBounds();
  fullPath.forEach((point) => bounds.extend(point));
  map.fitBounds(bounds, {
    top: 50,
    bottom: 50,
    left: 50,
    right: 400,
    maxZoom: 9,
  });

  // 🔹 Animate marker
  let segmentIndex = 0;
  const stepsPerSegment = 200;
  let currentStep = 0;

  function animateSegment() {
    if (segmentIndex >= fullPath.length - 1) {
      marker.setMap(null); // 🧽 Remove animated marker

      // ✅ Add final destination static red marker
      const staticMarker = new window.google.maps.Marker({
        map,
        position: fullPath[fullPath.length - 1],
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        },
        zIndex: 1001,
      });

      onDone?.(fullPath);
      return;
    }

    const start = fullPath[segmentIndex];
    const end = fullPath[segmentIndex + 1];
    const latStep = (end.lat() - start.lat()) / stepsPerSegment;
    const lngStep = (end.lng() - start.lng()) / stepsPerSegment;

    const move = () => {
      if (currentStep <= stepsPerSegment) {
        const lat = start.lat() + latStep * currentStep;
        const lng = start.lng() + lngStep * currentStep;
        marker.setPosition(new window.google.maps.LatLng(lat, lng));
        currentStep++;
        requestAnimationFrame(move);
      } else {
        segmentIndex++;
        currentStep = 0;
        animateSegment();
      }
    };

    move();
  }

  setTimeout(() => {
    animateSegment();
  }, 300);
}

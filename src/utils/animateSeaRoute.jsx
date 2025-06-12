import boatIcon from "../assets/boat.svg";

export function animateSeaRoute({
  origin,
  destination,
  mapRef,
  onDone,
  midpoints = [],
}) {
  const map = mapRef.current;
  if (!map || !window.google || !window.google.maps) return;

  const fullPath = [
    new window.google.maps.LatLng(Number(origin.lat), Number(origin.lng)),
    ...midpoints.map(
      (p) => new window.google.maps.LatLng(Number(p.lat), Number(p.lng))
    ),
    new window.google.maps.LatLng(
      Number(destination.lat),
      Number(destination.lng)
    ),
  ];

  // 🔵 Moving marker for animation
  const movingMarker = new window.google.maps.Marker({
    map,
    position: fullPath[0],
    icon: {
      url: boatIcon,
      scaledSize: new window.google.maps.Size(60, 60), // adjust size as needed
      anchor: new window.google.maps.Point(20, 20), // optional, centers the icon
    },
    zIndex: 1002,
  });

  // 📍 Fit map bounds to path
  const bounds = new window.google.maps.LatLngBounds();
  fullPath.forEach((point) => bounds.extend(point));
  map.fitBounds(bounds, {
    top: 50,
    bottom: 50,
    left: 50,
    right: 400,
    maxZoom: 9,
  });

  let segmentIndex = 0;
  let currentStep = 0;
  const baseSpeed = 0.002;

  let latStep = 0,
    lngStep = 0,
    stepsPerSegment = 1;

  function computeSteps(start, end) {
    const dist = window.google.maps.geometry.spherical.computeDistanceBetween(
      start,
      end
    );
    stepsPerSegment = Math.min(250, Math.max(30, Math.floor(dist * baseSpeed)));

    latStep = (end.lat() - start.lat()) / stepsPerSegment;
    lngStep = (end.lng() - start.lng()) / stepsPerSegment;
  }

  function animateSegment() {
    if (segmentIndex >= fullPath.length - 1) {
      movingMarker.setMap(null); // 🔄 remove after animation
      onDone?.(fullPath);
      return;
    }

    const start = fullPath[segmentIndex];
    const end = fullPath[segmentIndex + 1];
    computeSteps(start, end);

    const move = () => {
      if (currentStep <= stepsPerSegment) {
        const lat = start.lat() + latStep * currentStep;
        const lng = start.lng() + lngStep * currentStep;
        movingMarker.setPosition(new window.google.maps.LatLng(lat, lng));
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

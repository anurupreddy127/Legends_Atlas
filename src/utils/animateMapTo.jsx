// utils/animateMapTo.js

export function animateMapTo(map, targetCenter, targetZoom, duration = 1000) {
  const start = performance.now();
  const initialCenter = map.getCenter();
  const initialZoom = map.getZoom();

  function animate(time) {
    const progress = Math.min((time - start) / duration, 1);
    const easeInOut = 0.5 * (1 - Math.cos(Math.PI * progress));

    const lat =
      initialCenter.lat() +
      (targetCenter.lat - initialCenter.lat()) * easeInOut;
    const lng =
      initialCenter.lng() +
      (targetCenter.lng - initialCenter.lng()) * easeInOut;
    map.setCenter({ lat, lng });

    const zoom = initialZoom + (targetZoom - initialZoom) * easeInOut;
    map.setZoom(zoom);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

export function animateMarkerAlongPath(marker, path, speed = 10) {
  if (!marker || !path || path.length < 2) return;

  let index = 0;

  function step() {
    if (index >= path.length) return;

    marker.setPosition(path[index]);
    index++;

    setTimeout(step, speed); // speed in ms per point
  }

  step();
}

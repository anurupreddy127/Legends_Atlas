/* eslint-disable no-unused-vars */
import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
  minHeight: "500px",
};

const RamayanaMap = ({
  center,
  locations,
  directions,
  substories,
  activeSubIndex,
  onMapLoad,
  showDestinationMarker,
  movingMarkerPosition,
  activeChapterIndex,
}) => {
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={5}
      onLoad={onMapLoad}
    >
      {/* 📍 Chapter markers - (these typically don't need high zIndex unless they overlap high zIndex elements) */}
      {!substories.length &&
        locations.map((loc, index) =>
          index === activeChapterIndex ? (
            <Marker
              key={index}
              position={{ lat: loc.lat, lng: loc.lng }}
              title={loc.name}
            />
          ) : null
        )}

      {/* 🧍 Rama's moving marker (animated) */}
      {/* This marker's zIndex was already set in App.jsx where it's created as a Google Maps object. */}
      {movingMarkerPosition && (
        <Marker
          position={movingMarkerPosition}
          icon={{
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 5,
            strokeColor: "blue",
          }}
          // The zIndex for this specific marker is set on the actual google.maps.Marker object in App.jsx
        />
      )}

      {/* 🔵 Active substory marker (the endpoint marker) */}
      {(() => {
        const activeSub = substories[activeSubIndex];
        if (activeSub?.lat && activeSub?.lng && showDestinationMarker) {
          return (
            <Marker
              position={{ lat: activeSub.lat, lng: activeSub.lng }}
              title={activeSub.title}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // A standard blue dot icon
              }}
              // zIndex={1001} // <--- ADDED THIS LINE: Sets z-index for the static endpoint marker
            />
          );
        }
        return null;
      })()}
    </GoogleMap>
  );
};

export default RamayanaMap;

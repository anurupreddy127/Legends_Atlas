import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
  minHeight: "500px",
};

const RamayanaMap = ({
  center,
  locations,
  substories,
  activeSubIndex,
  onMapLoad,
  // routeAnimationInProgress,
  showDestinationMarker,
  movingMarkerPosition,
}) => {
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={5}
      onLoad={onMapLoad}
    >
      {/* 📍 Chapter markers */}
      {locations.map((loc, index) => (
        <Marker
          key={index}
          position={{ lat: loc.lat, lng: loc.lng }}
          title={loc.name}
        />
      ))}

      {/* 🧍 Rama's moving marker (animated) */}
      {movingMarkerPosition && (
        <Marker
          position={movingMarkerPosition}
          icon={{
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 5,
            strokeColor: "blue",
          }}
        />
      )}

      {/* 🔵 Active substory marker */}
      {(() => {
        const activeSub = substories[activeSubIndex];
        if (activeSub?.lat && activeSub?.lng && showDestinationMarker) {
          return (
            <Marker
              position={{ lat: activeSub.lat, lng: activeSub.lng }}
              title={activeSub.title}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
            />
          );
        }
        return null;
      })()}
    </GoogleMap>
  );
};

export default RamayanaMap;

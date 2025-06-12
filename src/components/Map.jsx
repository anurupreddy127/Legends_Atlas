import { GoogleMap, Marker } from "@react-google-maps/api";

const Map = ({
  center,
  locations,
  substories,
  activeSubIndex,
  onMapLoad,
  showDestinationMarker,
  movingMarkerPosition,
  activeChapterIndex,
}) => {
  return (
    <GoogleMap
      mapContainerClassName="w-full h-screen min-h-[500px]"
      gestureHandling="greedy"
      center={center}
      zoom={5}
      mapTypeId="terrain"
      disableDefaultUI={false}
      onLoad={(map) => {
        onMapLoad(map);
        window.google.maps.event.trigger(map, "resize");
      }}
    >
      {/* 📍 Chapter marker (only for selected chapter when no substories visible) */}
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

      {/* 🚀 Moving marker (controlled via animation) */}
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

      {/* 📌 Active substory marker (destination point) */}
      {(() => {
        const activeSub = substories[activeSubIndex];
        if (activeSub?.lat && activeSub?.lng && showDestinationMarker) {
          return (
            <Marker
              position={{ lat: activeSub.lat, lng: activeSub.lng }}
              title={activeSub.title}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
            />
          );
        }
        return null;
      })()}
    </GoogleMap>
  );
};

export default Map;

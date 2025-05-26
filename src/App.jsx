/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { db } from "./firebaseConfig"; // 👈 Your existing Firebase setup
import { doc, setDoc, getDoc } from "firebase/firestore";
import { seedFirestore } from "./seedFirestore";
import { collection, getDocs } from "firebase/firestore";
import ChapterViewer from "./ChapterViewer";
import ChapterDetails from "./ChapterDetails";
import { DirectionsRenderer } from "@react-google-maps/api";

// 📍 Map container and center (Ayodhya)
const containerStyle = {
  width: "100%",
  height: "100vh", // full screen height
  minHeight: "500px", // fallback height
};

const center = {
  lat: 26.7996,
  lng: 82.2041,
};

// const locations = [
//   { name: "Ayodhya", lat: 26.7996, lng: 82.2041 },
//   { name: "Kishkindha (Hampi)", lat: 15.335, lng: 76.46 },
//   { name: "Rameswaram", lat: 9.2876, lng: 79.3129 },
//   { name: "Lanka (Nuwara Eliya)", lat: 6.9497, lng: 80.7891 },
// ];

function animateMapTo(map, targetCenter, targetZoom, duration = 1000) {
  const start = performance.now();
  const initialCenter = map.getCenter();
  const initialZoom = map.getZoom();

  function animate(time) {
    const progress = Math.min((time - start) / duration, 1);
    const easeInOut = 0.5 * (1 - Math.cos(Math.PI * progress)); // ease function

    // Interpolate lat/lng
    const lat =
      initialCenter.lat() +
      (targetCenter.lat - initialCenter.lat()) * easeInOut;
    const lng =
      initialCenter.lng() +
      (targetCenter.lng - initialCenter.lng()) * easeInOut;
    map.setCenter({ lat, lng });

    // Interpolate zoom
    const zoom = initialZoom + (targetZoom - initialZoom) * easeInOut;
    map.setZoom(zoom);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

function App() {
  const [locations, setLocations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [substories, setSubstories] = useState([]);
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [directions, setDirections] = useState(null);
  const mapRef = useRef(null);
  const [routeAnimationInProgress, setRouteAnimationInProgress] =
    useState(false);

  const drawRoute = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();

    setRouteAnimationInProgress(true);

    directionsService.route(
      {
        origin: new window.google.maps.LatLng(origin.lat, origin.lng),
        destination: new window.google.maps.LatLng(
          destination.lat,
          destination.lng
        ),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          console.log("✅ Route loaded");

          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(new window.google.maps.LatLng(origin.lat, origin.lng));
          bounds.extend(
            new window.google.maps.LatLng(destination.lat, destination.lng)
          );
          mapRef.current?.fitBounds(bounds);

          setTimeout(() => {
            mapRef.current?.panTo(
              new window.google.maps.LatLng(destination.lat, destination.lng)
            );
            mapRef.current?.setZoom(10);

            setRouteAnimationInProgress(false);
          }, 3000);
        } else {
          console.error("❌ Route failed:", result);
          setRouteAnimationInProgress(false);
        }
      }
    );
  };

  useEffect(() => {
    async function fetchChapters() {
      try {
        const chaptersRef = collection(db, "stories", "ramayana", "chapters");
        const snapshot = await getDocs(chaptersRef);

        const data = snapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => a.order - b.order); // optional: sort by order

        setLocations(data);
        console.log("✅ Loaded Chapters:", data);
      } catch (error) {
        console.error("❌ Failed to load chapters:", error);
      }
    }

    fetchChapters();
  }, []);

  // 🧭 Center map when user selects a chapter from sidebar
  useEffect(() => {
    if (selectedChapter && mapRef.current) {
      animateMapTo(
        mapRef.current,
        {
          lat: selectedChapter.lat,
          lng: selectedChapter.lng,
        },
        9
      );

      // Fetch substories only for chapter1
      const fetchSubstories = async () => {
        if (selectedChapter.title === "Ayodhya – The Beginning") {
          const subRef = collection(
            doc(db, "stories", "ramayana", "chapters", "chapter1"),
            "substories"
          );
          const snapshot = await getDocs(subRef);
          const data = snapshot.docs
            .map((doc) => doc.data())
            .sort((a, b) => a.order - b.order);
          setSubstories(data);
          setActiveSubIndex(0); // reset to first substory
        } else {
          setSubstories([]); // clear for other chapters
        }
      };

      fetchSubstories();
    }
  }, [selectedChapter]);

  useEffect(() => {
    const activeSub = substories[activeSubIndex];

    if (activeSub && activeSub.lat && activeSub.lng && mapRef.current) {
      // 🛣️ If not first substory, attempt route animation
      if (activeSubIndex > 0) {
        let prevSub = null;
        for (let i = activeSubIndex - 1; i >= 0; i--) {
          if (substories[i]?.lat && substories[i]?.lng) {
            prevSub = substories[i];
            break;
          }
        }

        if (prevSub) {
          const origin = {
            lat: Number(prevSub.lat),
            lng: Number(prevSub.lng),
          };
          const destination = {
            lat: Number(activeSub.lat),
            lng: Number(activeSub.lng),
          };

          console.log("🛣️ Drawing route from:", origin, "to", destination);
          setRouteAnimationInProgress(true);

          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route(
            {
              origin: new window.google.maps.LatLng(origin.lat, origin.lng),
              destination: new window.google.maps.LatLng(
                destination.lat,
                destination.lng
              ),
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                setDirections(result);
                const bounds = new window.google.maps.LatLngBounds();
                bounds.extend(
                  new window.google.maps.LatLng(origin.lat, origin.lng)
                );
                bounds.extend(
                  new window.google.maps.LatLng(
                    destination.lat,
                    destination.lng
                  )
                );
                mapRef.current?.fitBounds(bounds);

                // ⏱️ Wait 3s then zoom to destination
                setTimeout(() => {
                  mapRef.current?.panTo(destination);
                  mapRef.current?.setZoom(10);
                  setDirections(null);
                  setRouteAnimationInProgress(false);
                }, 3000);
              } else {
                console.error("❌ Route failed:", result);
                setRouteAnimationInProgress(false);
              }
            }
          );
          return;
        }
      }

      // 🚫 No route — just center map
      if (!routeAnimationInProgress) {
        animateMapTo(
          mapRef.current,
          {
            lat: Number(activeSub.lat),
            lng: Number(activeSub.lng),
          },
          10
        );
      }
    }
  }, [activeSubIndex, substories]);

  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyBwAKbzz7h3cL9Aq35v-2PFIuEDaF49F1o">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={5}
          onLoad={(map) => {
            console.log("✅ Google Map Loaded");
            mapRef.current = map;
          }}
          onError={(e) => console.error("❌ Map Load Error", e)}
        >
          {locations.map((loc, index) => (
            <Marker
              key={index}
              position={{ lat: loc.lat, lng: loc.lng }}
              title={loc.name}
            />
          ))}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: { strokeColor: "#FF0000" },
              }}
              key={JSON.stringify(
                directions?.routes?.[0]?.overview_polyline?.points || ""
              )}
            />
          )}

          {(() => {
            const activeSub = substories[activeSubIndex];
            if (activeSub?.lat && activeSub?.lng) {
              return (
                <Marker
                  position={{ lat: activeSub.lat, lng: activeSub.lng }}
                  title={activeSub.title}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // or change color
                  }}
                />
              );
            }
            return null;
          })()}
        </GoogleMap>

        {/* Render ChapterViewer and ChapterDetails */}
        <ChapterViewer
          chapters={locations}
          onSelect={(chapter, index) => {
            setSelectedChapter(chapter);
            setSelectedIndex(index);
            if (mapRef.current) {
              animateMapTo(
                mapRef.current,
                { lat: chapter.lat, lng: chapter.lng },
                9
              );
            }
          }}
          selectedIndex={locations.indexOf(selectedChapter)}
        />

        <ChapterDetails
          chapter={selectedChapter}
          substories={substories}
          activeIndex={activeSubIndex}
          onPrev={() => setActiveSubIndex((prev) => Math.max(prev - 1, 0))}
          onNext={() =>
            setActiveSubIndex((prev) =>
              Math.min(prev + 1, substories.length - 1)
            )
          }
        />
      </LoadScript>
    </>
  );
}

export default App;

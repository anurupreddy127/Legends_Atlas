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
import { animateMapTo } from "./utils/animateMapTo";
import RamayanaMap from "./components/RamayanaMap"; // Import your custom map component
import { drawRoute } from "./utils/drawRoute";

// 📍 Map container and center (Ayodhya)
const containerStyle = {
  width: "100%",
  height: "100vh", // full screen height
  minHeight: "500px", // fallback height
};

const center = {
  lat: 21.7996,
  lng: 79.2041,
};

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
  const [movingMarkerPosition, setMovingMarkerPosition] = useState(null);
  const animationInProgressRef = useRef(false);
  const [showDestinationMarker, setShowDestinationMarker] = useState(false);

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

  useEffect(() => {
    if (!selectedChapter || !mapRef.current) return;

    const chapterId =
      selectedChapter.id ||
      selectedChapter.chapterId ||
      `chapter${selectedIndex + 1}`;

    // 📍 If there are no substories yet, default to zoom into the chapter center (fallback if lat/lng exists)
    if (!selectedChapter.lat || !selectedChapter.lng) {
      animateMapTo(mapRef.current, { lat: 20.5937, lng: 78.9629 }, 5); // Center of India
    } else {
      animateMapTo(
        mapRef.current,
        { lat: selectedChapter.lat, lng: selectedChapter.lng },
        9
      );
    }

    const fetchSubstories = async () => {
      try {
        const subRef = collection(
          doc(db, "stories", "ramayana", "chapters", chapterId),
          "substories"
        );
        const snapshot = await getDocs(subRef);
        const data = snapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => a.order - b.order);

        if (data.length > 0) {
          setSubstories(data);
          setActiveSubIndex(0);
        } else {
          setSubstories([]); // No substories, fallback mode
        }
      } catch (error) {
        console.error("❌ Error fetching substories:", error);
        setSubstories([]);
      }
    };

    fetchSubstories();
  }, [selectedChapter]);

  useEffect(() => {
    if (substories.length === 0) return;
    const activeSub = substories[activeSubIndex];

    if (activeSub && activeSub.lat && activeSub.lng && mapRef.current) {
      if (activeSubIndex > 0 && !animationInProgressRef.current) {
        let prevSub = null;
        for (let i = activeSubIndex - 1; i >= 0; i--) {
          if (substories[i]?.lat && substories[i]?.lng) {
            prevSub = substories[i];
            break;
          }
        }

        if (prevSub) {
          animationInProgressRef.current = true;
          setShowDestinationMarker(false);

          drawRoute({
            origin: { lat: Number(prevSub.lat), lng: Number(prevSub.lng) },
            destination: {
              lat: Number(activeSub.lat),
              lng: Number(activeSub.lng),
            },
            mapRef,
            onDone: (path) => {
              if (path) {
                const marker = new window.google.maps.Marker({
                  map: mapRef.current,
                  position: path[0],
                  icon: {
                    path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 5,
                    strokeColor: "blue",
                  },
                });

                console.log("🎯 Animating marker");
                import("./utils/animateMapTo").then(
                  ({ animateMarkerAlongPath }) => {
                    animateMarkerAlongPath(marker, path, 20); // adjust speed as needed
                  }
                );

                setTimeout(() => {
                  marker.setMap(null);
                  animationInProgressRef.current = false;
                  setShowDestinationMarker(true);
                  // 🔍 Zoom in on destination

                  animateMapTo(
                    mapRef.current,
                    {
                      lat: Number(activeSub.lat),
                      lng: Number(activeSub.lng),
                    },
                    10,
                    1300 // zoom duration in ms
                  );
                }, path.length * 20 + 100); // estimate total animation time
              } else {
                animationInProgressRef.current = false;
              }
            },
          });

          return;
        }
      }

      if (!animationInProgressRef.current) {
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
        <RamayanaMap
          center={center}
          locations={locations}
          directions={directions}
          substories={substories}
          activeSubIndex={activeSubIndex}
          routeAnimationInProgress={routeAnimationInProgress}
          showDestinationMarker={showDestinationMarker}
          onMapLoad={(map) => {
            console.log("✅ Google Map Loaded");
            mapRef.current = map;
          }}
          movingMarkerPosition={movingMarkerPosition} // Pass the animated marker position
          activeChapterIndex={selectedIndex}
        />

        {/* Render ChapterViewer and ChapterDetails */}
        <ChapterViewer
          chapters={locations}
          onSelect={(chapter, index) => {
            setSelectedChapter(chapter);
            setSelectedIndex(index);
            if (mapRef.current) {
              // ✅ If there are substories, center on the first one
              if (
                substories.length > 0 &&
                substories[0].lat &&
                substories[0].lng
              ) {
                animateMapTo(
                  mapRef.current,
                  {
                    lat: Number(substories[0].lat),
                    lng: Number(substories[0].lng),
                  },
                  9
                );
              }
            }
          }}
          selectedIndex={locations.indexOf(selectedChapter)}
        />

        <ChapterDetails
          chapter={selectedChapter}
          substories={substories}
          activeIndex={activeSubIndex}
          onPrev={() => setActiveSubIndex((prev) => Math.max(prev - 1, 0))}
          onNext={() => {
            if (activeSubIndex < substories.length - 1) {
              setActiveSubIndex((prev) => prev + 1);
            } else {
              // Go to the next chapter
              const nextChapterIndex = selectedIndex + 1;
              if (nextChapterIndex < locations.length) {
                const nextChapter = locations[nextChapterIndex];
                setSelectedChapter(nextChapter);
                setSelectedIndex(nextChapterIndex);
              }
            }
          }}
        />
      </LoadScript>
    </>
  );
}

export default App;

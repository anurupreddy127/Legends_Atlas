/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { LoadScript } from "@react-google-maps/api";
import { db } from "./firebaseConfig";
import { doc, collection, getDocs } from "firebase/firestore";
import ChapterViewer from "./ChapterViewer";
import ChapterDetails from "./ChapterDetails";
import { animateMapTo } from "./utils/animateMapTo";
import RamayanaMap from "./components/RamayanaMap";
import { drawRoute } from "./utils/drawRoute";

const containerStyle = {
  width: "100%",
  height: "100vh",
  minHeight: "500px",
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
          .sort((a, b) => a.order - b.order);
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

    if (!selectedChapter.lat || !selectedChapter.lng) {
      animateMapTo(mapRef.current, { lat: 20.5937, lng: 78.9629 }, 5);
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

        setSubstories(data);
        setActiveSubIndex(0);
      } catch (error) {
        console.error("❌ Error fetching substories:", error);
        setSubstories([]);
      }
    };

    fetchSubstories();
  }, [selectedChapter]);

  useEffect(() => {
    if (!mapRef.current || substories.length === 0) return;

    const activeSub = substories[activeSubIndex];

    if (!activeSub?.lat || !activeSub?.lng) {
      // 📍 If no coordinates — zoom out to India
      animateMapTo(mapRef.current, { lat: 20.5937, lng: 78.9629 }, 5);
      return;
    }

    // 🔍 Find last substory with coordinates
    const prevSub = [...substories]
      .slice(0, activeSubIndex)
      .reverse()
      .find((s) => s.lat && s.lng);

    if (
      prevSub &&
      Number(prevSub.lat) === Number(activeSub.lat) &&
      Number(prevSub.lng) === Number(activeSub.lng)
    ) {
      // ⛔ Same coordinates — do nothing
      return;
    }

    // ✅ Animate transition only if previous is different
    if (prevSub && !animationInProgressRef.current) {
      animationInProgressRef.current = true;
      setShowDestinationMarker(false);

      drawRoute({
        origin: {
          lat: Number(prevSub.lat),
          lng: Number(prevSub.lng),
        },
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

            import("./utils/animateMapTo").then(
              ({ animateMarkerAlongPath }) => {
                animateMarkerAlongPath(marker, path, 20);
              }
            );

            setTimeout(() => {
              marker.setMap(null);
              animationInProgressRef.current = false;
              setShowDestinationMarker(true);
              animateMapTo(
                mapRef.current,
                {
                  lat: Number(activeSub.lat),
                  lng: Number(activeSub.lng),
                },
                10,
                1300
              );
            }, path.length * 20 + 100);
          } else {
            animationInProgressRef.current = false;
          }
        },
      });
    } else {
      // 🔄 No prevSub (e.g., first substory) — just zoom in
      animateMapTo(
        mapRef.current,
        {
          lat: Number(activeSub.lat),
          lng: Number(activeSub.lng),
        },
        10,
        1300
      );
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
          movingMarkerPosition={movingMarkerPosition}
          activeChapterIndex={selectedIndex}
        />

        <ChapterViewer
          chapters={locations}
          onSelect={(chapter, index) => {
            setSelectedChapter(chapter);
            setSelectedIndex(index);
            if (
              mapRef.current &&
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
          }}
          selectedIndex={locations.indexOf(selectedChapter)}
        />

        <ChapterDetails
          chapter={selectedChapter}
          substories={substories}
          activeIndex={activeSubIndex}
          onPrev={() => setActiveSubIndex((prev) => Math.max(prev - 1, 0))}
          onNext={async () => {
            if (activeSubIndex < substories.length - 1) {
              setActiveSubIndex((prev) => prev + 1);
            } else {
              const nextChapterIndex = selectedIndex + 1;
              if (nextChapterIndex < locations.length) {
                const nextChapter = locations[nextChapterIndex];
                const chapterId =
                  nextChapter.id ||
                  nextChapter.chapterId ||
                  `chapter${nextChapterIndex + 1}`;

                // Use last known coordinates from previous substories
                let lastKnownSub = [...substories]
                  .reverse()
                  .find((s) => s.lat && s.lng);

                const snapshot = await getDocs(
                  collection(
                    doc(db, "stories", "ramayana", "chapters", chapterId),
                    "substories"
                  )
                );
                const nextSubstories = snapshot.docs
                  .map((doc) => doc.data())
                  .sort((a, b) => a.order - b.order);

                const firstNextSub = nextSubstories.find((s) => s.lat && s.lng);

                if (lastKnownSub && firstNextSub) {
                  animationInProgressRef.current = true;

                  drawRoute({
                    origin: {
                      lat: Number(lastKnownSub.lat),
                      lng: Number(lastKnownSub.lng),
                    },
                    destination: {
                      lat: Number(firstNextSub.lat),
                      lng: Number(firstNextSub.lng),
                    },
                    mapRef,
                    onDone: (path) => {
                      if (path) {
                        const marker = new window.google.maps.Marker({
                          map: mapRef.current,
                          position: path[0],
                          icon: {
                            path: window.google.maps.SymbolPath
                              .FORWARD_CLOSED_ARROW,
                            scale: 5,
                            strokeColor: "blue",
                          },
                        });

                        import("./utils/animateMapTo").then(
                          ({ animateMarkerAlongPath }) => {
                            animateMarkerAlongPath(marker, path, 20);
                          }
                        );

                        setTimeout(() => {
                          marker.setMap(null);
                          animationInProgressRef.current = false;
                          setShowDestinationMarker(true);
                          setSelectedChapter(nextChapter);
                          setSelectedIndex(nextChapterIndex);
                          setSubstories(nextSubstories);
                          setActiveSubIndex(0);
                        }, path.length * 20 + 100);
                      } else {
                        animationInProgressRef.current = false;
                        setSelectedChapter(nextChapter);
                        setSelectedIndex(nextChapterIndex);
                        setSubstories(nextSubstories);
                        setActiveSubIndex(0);
                      }
                    },
                  });
                } else {
                  setSelectedChapter(nextChapter);
                  setSelectedIndex(nextChapterIndex);
                  setSubstories(nextSubstories);
                  setActiveSubIndex(0);
                }
              }
            }
          }}
        />
      </LoadScript>
    </>
  );
}

export default App;

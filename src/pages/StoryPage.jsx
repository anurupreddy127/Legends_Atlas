/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { LoadScript } from "@react-google-maps/api";
import { db } from "../firebaseConfig";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import ChapterViewer from "../components/ChapterViewer";
import ChapterDetails from "../components/ChapterDetails";
import { animateMapTo } from "../utils/animateMapTo";
import Map from "../components/Map";
import { drawRoute } from "../utils/drawRoute";
import SubstoryCard from "../components/SubstoryCard";
import { useParams } from "react-router-dom";

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
  const [showSubstoryCard, setShowSubstoryCard] = useState(true);
  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const { storyId } = useParams();

  useEffect(() => {
    async function fetchStoryMetaAndChapters() {
      try {
        const storyRef = doc(db, "stories", storyId);
        const storySnap = await getDoc(storyRef);
        const storyData = storySnap.data();
        if (storyData?.lat && storyData?.lng) {
          setCenter({ lat: Number(storyData.lat), lng: Number(storyData.lng) });
        }
        const chaptersRef = collection(storyRef, "chapters");
        const snapshot = await getDocs(chaptersRef);
        const chapterList = snapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => a.order - b.order);
        setLocations(chapterList);
      } catch (err) {
        console.error("❌ Error loading story:", err);
      }
    }
    fetchStoryMetaAndChapters();
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
          doc(db, "stories", storyId, "chapters", chapterId),
          "substories"
        );
        const snapshot = await getDocs(subRef);
        const data = snapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => a.order - b.order);
        setSubstories(data);
        setActiveSubIndex(0);
        const firstValidSub = data.find((s) => s.lat && s.lng);
        if (firstValidSub && mapRef.current) {
          const marker = new window.google.maps.Marker({
            map: mapRef.current,
            position: {
              lat: Number(firstValidSub.lat),
              lng: Number(firstValidSub.lng),
            },
            icon: {
              path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 5,
              strokeColor: "blue",
            },
            zIndex: 1002,
          });
          setTimeout(() => marker.setMap(null), 3000);
        }
      } catch (error) {
        console.error("❌ Error fetching substories:", error);
        setSubstories([]);
      }
    };
    fetchSubstories();
  }, [selectedChapter, selectedIndex]);

  useEffect(() => {
    if (!mapRef.current || substories.length === 0) return;
    const activeSub = substories[activeSubIndex];
    const destLat = Number(activeSub?.lat);
    const destLng = Number(activeSub?.lng);
    if (isNaN(destLat) || isNaN(destLng)) {
      animateMapTo(mapRef.current, { lat: 20.5937, lng: 78.9629 }, 5);
      return;
    }
    const prevSub = [...substories]
      .slice(0, activeSubIndex)
      .reverse()
      .find((s) => s.lat && s.lng);
    const originLat = Number(prevSub?.lat);
    const originLng = Number(prevSub?.lng);
    if (
      prevSub &&
      !isNaN(originLat) &&
      !isNaN(originLng) &&
      originLat === destLat &&
      originLng === destLng
    ) {
      return;
    }
    if (prevSub && !animationInProgressRef.current) {
      animationInProgressRef.current = true;
      setShowDestinationMarker(false);
      setShowSubstoryCard(false);
      drawRoute({
        origin: { lat: originLat, lng: originLng },
        destination: { lat: destLat, lng: destLng },
        mapRef,
        pathType: activeSub.path || "road",
        onDone: (path) => {
          const marker = new window.google.maps.Marker({
            map: mapRef.current,
            position: path[0],
            icon: {
              path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 5,
              strokeColor: "blue",
            },
          });
          import("../utils/animateMapTo").then(({ animateMarkerAlongPath }) => {
            animateMarkerAlongPath(marker, path, 20);
          });
          setTimeout(() => {
            marker.setMap(null);
            animationInProgressRef.current = false;
            setShowDestinationMarker(true);
            setShowSubstoryCard(true);
            animateMapTo(
              mapRef.current,
              { lat: destLat, lng: destLng },
              10,
              1300
            );
          }, path.length * 20 + 100);
        },
      });
    } else {
      animateMapTo(mapRef.current, { lat: destLat, lng: destLng }, 10, 1300);
    }
  }, [activeSubIndex, substories]);

  return (
    <div className="font-playfair">
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={["geometry"]}
      >
        <Map
          center={center}
          locations={locations}
          directions={directions}
          substories={substories}
          activeSubIndex={activeSubIndex}
          routeAnimationInProgress={routeAnimationInProgress}
          showDestinationMarker={showDestinationMarker}
          onMapLoad={(map) => {
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
        {showSubstoryCard && substories[activeSubIndex] && (
          <SubstoryCard
            chapterTitle={selectedChapter?.title}
            sub={substories[activeSubIndex]}
            onNext={async () => {
              const isLastSubstory = activeSubIndex === substories.length - 1;
              const isNotFinalChapter = selectedIndex < locations.length - 1;
              const lastKnownSub = [...substories]
                .reverse()
                .find((s) => s.lat && s.lng);
              if (!isLastSubstory) {
                setActiveSubIndex((prev) => prev + 1);
                return;
              }
              if (isNotFinalChapter) {
                const nextChapterIndex = selectedIndex + 1;
                const nextChapter = locations[nextChapterIndex];
                const chapterId =
                  nextChapter.id ||
                  nextChapter.chapterId ||
                  `chapter${nextChapterIndex + 1}`;
                const snapshot = await getDocs(
                  collection(
                    doc(db, "stories", storyId, "chapters", chapterId),
                    "substories"
                  )
                );
                const nextSubstories = snapshot.docs
                  .map((doc) => doc.data())
                  .sort((a, b) => a.order - b.order);
                const firstNextSub = nextSubstories.find((s) => s.lat && s.lng);
                const pathType = firstNextSub?.path || "road";
                if (lastKnownSub && firstNextSub) {
                  animationInProgressRef.current = true;
                  setShowSubstoryCard(false);
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
                    pathType,
                    onDone: (path) => {
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
                      import("../utils/animateMapTo").then(
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
                        setShowSubstoryCard(true);
                      }, path.length * 20 + 100);
                    },
                  });
                } else {
                  setSelectedChapter(nextChapter);
                  setSelectedIndex(nextChapterIndex);
                  setSubstories(nextSubstories);
                  setActiveSubIndex(0);
                }
              } else {
                setSelectedChapter(null);
                setSelectedIndex(null);
                setSubstories([]);
                setActiveSubIndex(0);
                setShowSubstoryCard(false);
                animateMapTo(mapRef.current, { lat: 20.5937, lng: 78.9629 }, 5);
              }
            }}
            onPrev={() => setActiveSubIndex((prev) => Math.max(prev - 1, 0))}
            isFirst={activeSubIndex === 0}
            isLast={activeSubIndex === substories.length - 1}
            isFinalChapter={selectedIndex === locations.length - 1}
          />
        )}
      </LoadScript>
    </div>
  );
}

export default App;

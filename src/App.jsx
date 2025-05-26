/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { db } from "./firebaseConfig"; // 👈 Your existing Firebase setup
import { doc, setDoc, getDoc } from "firebase/firestore";
import { seedFirestore } from "./seedFirestore";
import { collection, getDocs } from "firebase/firestore";
import ChapterViewer from "./ChapterViewer";
import ChapterDetails from "./ChapterDetails";

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
  const mapRef = useRef(null);

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
      mapRef.current.panTo({
        lat: selectedChapter.lat,
        lng: selectedChapter.lng,
      });
      mapRef.current.setZoom(8);
    }
  }, [selectedChapter]);

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
          isLast={selectedIndex === locations.length - 1}
          onNext={() => {
            const nextIndex = selectedIndex + 1;
            if (nextIndex < locations.length) {
              const nextChapter = locations[nextIndex];
              setSelectedChapter(nextChapter);
              setSelectedIndex(nextIndex);
              if (mapRef.current) {
                animateMapTo(
                  mapRef.current,
                  { lat: nextChapter.lat, lng: nextChapter.lng },
                  9
                );
              }
            }
          }}
        />
      </LoadScript>
    </>
  );
}

export default App;

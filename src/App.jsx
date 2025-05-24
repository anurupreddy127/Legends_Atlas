import { useEffect } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { db } from "./firebaseConfig"; // 👈 Your existing Firebase setup
import { doc, setDoc, getDoc } from "firebase/firestore";

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

const locations = [
  { name: "Ayodhya", lat: 26.7996, lng: 82.2041 },
  { name: "Kishkindha (Hampi)", lat: 15.335, lng: 76.46 },
  { name: "Rameswaram", lat: 9.2876, lng: 79.3129 },
  { name: "Lanka (Nuwara Eliya)", lat: 6.9497, lng: 80.7891 },
];

function App() {
  useEffect(() => {
    async function testFirestore() {
      try {
        const docRef = doc(db, "testCollection", "testDoc");
        await setDoc(docRef, { message: "Hello from Ramayana Map!" });

        const snapshot = await getDoc(docRef);
        console.log("✅ Firestore Test Read:", snapshot.data());
      } catch (error) {
        console.error("❌ Firestore error:", error);
      }
    }

    testFirestore();
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyBwAKbzz7h3cL9Aq35v-2PFIuEDaF49F1o">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        onLoad={() => console.log("✅ Google Map Loaded")}
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
    </LoadScript>
  );
}

export default App;

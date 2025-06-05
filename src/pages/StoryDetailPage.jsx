import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import RamayanaMap from "../components/Map"; // Adjust the import path as necessary
import { LoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const StoryDetailPage = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // default to India
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    console.log("ID from useParams:", id);

    const fetchStoryDetails = async () => {
      try {
        const storyDocRef = doc(db, "stories", id);
        const storyDoc = await getDoc(storyDocRef);

        console.log("📄 Checking document existence...");
        if (storyDoc.exists()) {
          const storyData = storyDoc.data();
          console.log("✅ Fetched Story:", storyData);
          setStory(storyData);
          setCenter({ lat: storyData.lat, lng: storyData.lng });

          // ✅ Fetch chapters
          const chaptersSnapshot = await getDocs(
            collection(storyDocRef, "chapters")
          );
          const chaptersList = chaptersSnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => a.order - b.order);
          setChapters(chaptersList);
        } else {
          console.error("❌ Document not found for ID:", id);
        }
      } catch (err) {
        console.error("🔥 Firestore error:", err);
      }
    };

    fetchStoryDetails();
  }, [id]);

  if (!story) {
    console.log("🕐 Waiting for story data...");
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="relative h-screen w-full">
      {/* Fullscreen Map (absolute) */}
      <div className="absolute inset-0 z-0">
        <LoadScript googleMapsApiKey="AIzaSyBwAKbzz7h3cL9Aq35v-2PFIuEDaF49F1o">
          <RamayanaMap
            center={center}
            locations={[]}
            directions={null}
            substories={[]}
            activeSubIndex={0}
            onMapLoad={() => {}}
            showDestinationMarker={false}
            movingMarkerPosition={null}
            activeChapterIndex={-1}
          />
        </LoadScript>
      </div>

      {/* Overlay: Chapter Card */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        <div className="bg-white/30 backdrop-blur-md rounded-xl p-6 w-full max-w-md shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-black">
            {story.title}
          </h2>
          <p className="text-sm text-black-200 mb-6 text-center">
            {story.description}
          </p>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="bg-white/40 p-3 rounded text-black"
              >
                <h3 className="font-semibold">{chapter.title}</h3>
                <p className="text-sm">{chapter.description}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate(`/story/${id}/play`)}
            className="mt-6 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 w-full"
          >
            Start Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailPage;

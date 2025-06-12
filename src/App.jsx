import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import HomePage from "./pages/HomePage";
import StoryPage from "./pages/StoryPage";
import StoryDetailPage from "./pages/StoryDetailPage";
import NotFound from "./pages/NotFound";

const LIBRARIES = ["geometry"]; // Add more like "places" if needed

function App() {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={LIBRARIES}
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/story/:id" element={<StoryDetailPage />} />
          <Route path="/story/:storyId/play" element={<StoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </LoadScript>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StoryPage from "./pages/StoryPage";
import StoryDetailPage from "./pages/StoryDetailPage";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/story/:id" element={<StoryDetailPage />} />
        <Route path="/story/:storyId/play" element={<StoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;

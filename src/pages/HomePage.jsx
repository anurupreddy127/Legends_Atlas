// HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig"; // adjust path
import { collection, getDocs } from "firebase/firestore";
import StoryCard from "../components/Storycard";
import AuthorSection from "../components/AuthorSection";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      const storySnapshot = await getDocs(collection(db, "stories"));
      const storyList = storySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStories(storyList);
    };
    fetchStories();
  }, []);

  return (
    <div className="font-playfair scroll-smooth">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section
        id="hero"
        className="h-screen flex items-center justify-center bg-gradient-to-br from-parchment via-goldenrod to-orange-200"
      >
        {/* Background Logo */}
        <img
          src="/logo.png"
          alt="Background Logo"
          className="absolute w-[600px] md:w-[800px] opacity-7 pointer-events-none z-0"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Hero Content */}
        <div className="text-center max-w-2xl px-4 relative z-10">
          <h2 className="text-4xl font-extrabold mb-4 font-playfair">
            Discover Stories Like Never Before
          </h2>
          <p className="text-lg mb-6 font-edu">
            Legends Atlas brings ancient epics and journeys to life using
            interactive maps and animated storytelling.
          </p>
          <a
            href="#stories"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Explore
          </a>
        </div>
      </section>

      {/* Stories Section */}
      <section
        id="stories"
        className="min-h-screen bg-white flex flex-col items-center justify-between px-4 py-35"
      >
        <h3 className="text-3xl font-bold text-center mb-6">Explore Stories</h3>
        <div className="flex flex-wrap justify-evenly gap-8 max-w-6xl mx-auto px-4">
          {stories.map((story) => (
            <div key={story.id} data-aos="fade-up" data-aos-duration="1000">
              <StoryCard story={story} />
            </div>
          ))}
        </div>
      </section>

      {/* Author Section */}
      <AuthorSection />

      <footer className="text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Legends Atlas — Built by Anurup Reddy
        Koduru
      </footer>
    </div>
  );
};

export default HomePage;

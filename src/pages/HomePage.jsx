// HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig"; // adjust path
import { collection, getDocs } from "firebase/firestore";
import StoryCard from "../components/Storycard";

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
    <div className="scroll-smooth">
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Legends Atlas</h1>
          <div className="space-x-4">
            <a href="#hero" className="hover:underline">
              Home
            </a>
            <a href="#stories" className="hover:underline">
              Stories
            </a>
            <a href="#author" className="hover:underline">
              Author
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200 pt-20"
      >
        <div className="text-center max-w-2xl px-4">
          <h2 className="text-4xl font-extrabold mb-4">
            Discover Stories Like Never Before
          </h2>
          <p className="text-lg mb-6">
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
      <section id="author" className="min-h-[60vh] bg-gray-100 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <img
            src="/your-photo.jpg"
            alt="Author"
            className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
          />
          <h3 className="text-2xl font-bold">Anurup Reddy</h3>
          <p className="mt-2">
            Creator of Legends Atlas. Passionate about maps, mythology, and
            immersive digital storytelling.
          </p>
          <div className="mt-4 space-x-4">
            <a
              href="https://github.com/anurup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/anurup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

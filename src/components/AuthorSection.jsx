// src/components/AuthorSection.jsx
import React from "react";
import authorImage from "../assets/author.jpg";

const AuthorSection = () => {
  return (
    <section
      id="author"
      className="min-h-[60vh] bg-gradient-to-br from-white via-gray-100 to-white py-16 px-4 flex items-center justify-center"
    >
      <div className="backdrop-blur-md bg-white/50 border border-gray-200 rounded-2xl shadow-xl p-8 w-full max-w-3xl text-center">
        <img
          src={authorImage}
          alt="Author"
          className="w-32 h-32 mx-auto rounded-full mb-4 object-cover shadow-md border-2 border-white"
        />
        <h3 className="text-2xl font-playfair font-bold text-gray-800">
          Anurup Reddy Koduru
        </h3>
        <p className="mt-2 text-gray-700 font-edu text-lg">
          Creator of Legends Atlas — blending ancient mythology with modern maps
          to bring stories to life.
        </p>
        <div className="mt-6 space-x-6 text-blue-600 text-lg font-semibold">
          <a
            href="https://github.com/anurupreddy127"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/anurupreddy127/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
};

export default AuthorSection;

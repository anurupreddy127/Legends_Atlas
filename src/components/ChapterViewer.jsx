import React from "react";

function ChapterViewer({ chapters, onSelect, selectedIndex, storyTitle }) {
  return (
    <div
      // Main container styling
      className="
        absolute top-13 left-3
    w-[300px]
    bg-white/30 backdrop-blur-md border border-white/40
    p-4 rounded-xl shadow-lg text-white
      "
    >
      {/* Heading styling */}
      <h3 className="mb-4 font-bold text-xl text-gray-800">
        {storyTitle || "Loading "}
        {/* Larger font for prominence, bold, gray text */}
      </h3>
      <ul className="list-none p-0 m-0">
        {chapters.map((chapter, index) => (
          <li key={index} className="mb-2 last:mb-0">
            {" "}
            {/* Margin bottom for spacing, remove for last item */}
            <button
              onClick={() => onSelect(chapter, index)}
              // Button styling based on selection state and hover
              className={`
                w-full py-2.5 px-3.5            
                text-left                      
                rounded-lg                      
                border border-gray-300         
                cursor-pointer                  
                transition-colors duration-200 ease-in-out
                ${
                  selectedIndex === index
                    ? "bg-blue-500 text-white font-semibold shadow-md" /* Selected state: blue background, white text, bold, shadow */
                    : "bg-white text-gray-700 hover:bg-gray-50 font-normal" /* Unselected state: white background, hover effect */
                }
              `}
            >
              {`Chapter ${index + 1}: ${chapter.title}`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChapterViewer;

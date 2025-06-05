// ChapterViewer.jsx
import React from "react"; // React is typically implicitly imported in newer React versions, but good practice to keep it.

function ChapterViewer({ chapters, onSelect, selectedIndex }) {
  return (
    <div
      // Main container styling
      className="
        absolute top-13 left-3              /* Positioning from original */
        w-[300px]                           /* Fixed width for consistency */
        bg-white                            /* White background */
        p-4                                 /* Padding inside the box */
        rounded-xl                          /* Rounded corners */
        shadow-                             /* Larger shadow for depth */
      "
    >
      {/* Heading styling */}
      <h3 className="mb-4 font-bold text-xl text-gray-800">
        {" "}
        {/* Larger font for prominence, bold, gray text */}
        📜 Ramayana Chapters
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
                w-full py-2.5 px-3.5            /* Full width, adjusted padding */
                text-left                       /* Align text to left */
                rounded-lg                      /* Slightly rounded corners */
                border border-gray-300          /* Subtle border */
                cursor-pointer                  /* Pointer on hover */
                transition-colors duration-200 ease-in-out /* Smooth transition for background */
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

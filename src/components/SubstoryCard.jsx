// SubstoryCard.jsx
import React from "react";

function SubstoryCard({
  chapterTitle,
  sub,
  onNext,
  onPrev,
  isFirst,
  isLast,
  isFinalChapter,
}) {
  if (!sub) return null;
  return (
    // Outer positioning wrapper
    // CHANGED: From left-[10px] to right-3, and top-[380px] to top-7 for alignment
    <div className="absolute top-20 right-3 w-[300px]">
      {/* Main card container - adapted from Universe card */}
      <div className="relative flex w-full flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
        {/* Top Graphic / Image section - now showing your image */}
        {/* Top Graphic / Image section - now showing your image */}
        <div className="relative mx-4 -mt-6 overflow-hidden rounded-xl bg-white flex items-center justify-center">
          {sub.imageUrl ? (
            <img
              src={sub.imageUrl}
              alt={sub.title}
              className="w-full h-auto object-contain max-h-64" // Allow image to grow naturally, with a cap
            />
          ) : (
            <div className="h-40 w-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg">
              <span className="font-bold">No Image</span>
            </div>
          )}
        </div>

        {/* Card content section */}
        <div className="p-6">
          {/* Chapter Title - styled closer to Universe h5, but kept as h5 */}
          <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
            {chapterTitle}
          </h5>
          {/* Substory Title - kept as h6, but with updated styling */}
          <h6 className="mb-1 block font-sans text-lg font-medium leading-normal text-blue-gray-800 antialiased">
            {sub.title}
          </h6>
          {/* Substory Description - styled closer to Universe p */}
          <p className="block font-sans text-base font-light leading-relaxed text-gray-700 antialiased mb-2">
            {sub.description}
          </p>
        </div>

        {/* Action buttons section */}
        <div className="flex justify-between p-4 pt-0">
          <button
            disabled={isFirst}
            onClick={onPrev}
            // Styled to match the "Read More" button's general appearance
            className="select-none rounded-lg bg-gray-300 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-800 shadow-md shadow-gray-300/20 transition-all hover:shadow-lg hover:shadow-gray-300/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            ← Prev
          </button>
          <button
            onClick={onNext}
            // Styled to match the "Read More" button from the example
            className="select-none rounded-lg bg-blue-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            {isLast ? (isFinalChapter ? "Done" : "Next Chapter →") : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubstoryCard;

import SubstoryCard from "./components/SubstoryCard";

function ChapterDetails({ chapter, substories, activeIndex, onNext, onPrev }) {
  if (!chapter) return null;

  if (substories.length === 0) {
    return (
      <div className="absolute top-[320px] left-[10px] w-[300px] bg-white p-4 rounded-xl shadow-md">
        <h4 className="font-bold mb-2">{chapter.title}</h4>
        <p className="italic text-gray-600">
          No sub-stories are available for this chapter.
        </p>
      </div>
    );
  }

  const sub = substories[activeIndex];

  if (!sub) {
    return (
      <div className="absolute top-[320px] left-[10px] w-[300px] bg-white p-4 rounded-xl shadow-md">
        <h4 className="font-bold mb-2">{chapter.title}</h4>
        <p className="text-sm text-gray-700">Loading substory...</p>
      </div>
    );
  }

  return (
    <SubstoryCard
      chapterTitle={chapter.title}
      sub={sub}
      onNext={onNext}
      onPrev={onPrev}
      isFirst={activeIndex === 0}
      isLast={activeIndex === substories.length - 1}
    />
  );
}

export default ChapterDetails;

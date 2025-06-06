import SubstoryCard from "./SubstoryCard";

function ChapterDetails({ chapter, substories, activeIndex, onNext, onPrev }) {
  if (!chapter) return null;

  if (substories.length === 0) {
    return (
      <div className="absolute top-[320px] left-[10px] w-[300px] bg-white/30 backdrop-blur-md border border-white/40 text-white p-4 rounded-xl shadow-lg">
        <h4 className="font-bold mb-2">{chapter.title}</h4>
        <p className="italic">No sub-stories are available for this chapter.</p>
      </div>
    );
  }

  const sub = substories[activeIndex];

  if (!sub) {
    return (
      <div className="absolute top-[320px] left-[10px] w-[300px] bg-white/30 backdrop-blur-md border border-white/40 text-white p-4 rounded-xl shadow-lg">
        <h4 className="font-bold mb-2">{chapter.title}</h4>
        <p className="italic">Loading Substories..</p>
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

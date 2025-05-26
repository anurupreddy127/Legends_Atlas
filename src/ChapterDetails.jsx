function ChapterDetails({ chapter, substories, activeIndex, onNext, onPrev }) {
  if (!chapter) return null;

  const sub = substories[activeIndex];

  return (
    <div
      style={{
        position: "absolute",
        top: "320px",
        left: "10px",
        width: "300px",
        backgroundColor: "#ffffff",
        padding: "1rem",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        zIndex: 999,
      }}
    >
      <h4 style={{ margin: "0 0 6px" }}>{chapter.title}</h4>
      {sub && (
        <>
          <h5 style={{ margin: "6px 0", fontSize: "0.95rem" }}>{sub.title}</h5>
          <p style={{ fontSize: "0.9rem", color: "#444" }}>{sub.description}</p>
          {sub.imageUrl && (
            <img
              src={sub.imageUrl}
              alt={sub.title}
              style={{
                width: "100%",
                borderRadius: "8px",
                marginTop: "10px",
                maxHeight: "200px",
                objectFit: "cover",
              }}
            />
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <button
              disabled={activeIndex === 0}
              onClick={onPrev}
              style={{
                padding: "8px",
                backgroundColor: "#ddd",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              ← Prev
            </button>
            <button
              disabled={activeIndex === substories.length - 1}
              onClick={onNext}
              style={{
                padding: "8px",
                backgroundColor: "#1d72b8",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChapterDetails;

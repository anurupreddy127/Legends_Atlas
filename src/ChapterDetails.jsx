function ChapterDetails({ chapter, onNext, isLast }) {
  if (!chapter) return null;

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
      <h4 style={{ margin: "0 0 8px", fontSize: "1rem", fontWeight: "bold" }}>
        {chapter.title}
      </h4>
      <p style={{ fontSize: "0.92rem", color: "#444", marginBottom: "10px" }}>
        {chapter.description}
      </p>
      {chapter.imageUrl && (
        <img
          src={chapter.imageUrl}
          alt={chapter.title}
          style={{
            width: "100%",
            borderRadius: "8px",
            maxHeight: "200px",
            objectFit: "cover",
          }}
        />
      )}

      {!isLast && (
        <button
          onClick={onNext}
          style={{
            marginTop: "14px",
            width: "100%",
            padding: "10px",
            backgroundColor: "#1d72b8",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Next Chapter →
        </button>
      )}
    </div>
  );
}

export default ChapterDetails;

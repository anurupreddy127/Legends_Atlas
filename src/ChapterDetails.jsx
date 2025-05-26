function ChapterDetails({ chapter }) {
  if (!chapter) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "320px", // adjust based on viewer height
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
    </div>
  );
}

export default ChapterDetails;

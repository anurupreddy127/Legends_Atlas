function ChapterViewer({ chapters, onSelect, selectedIndex }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        width: "300px",
        backgroundColor: "#ffffff",
        padding: "1rem",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        zIndex: 1000,
      }}
    >
      <h3
        style={{ marginBottom: "1rem", fontWeight: "bold", fontSize: "1.1rem" }}
      >
        📜 Ramayana Chapters
      </h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {chapters.map((chapter, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <button
              onClick={() => onSelect(chapter, index)}
              style={{
                width: "100%",
                padding: "10px 14px",
                textAlign: "left",
                borderRadius: "8px",
                backgroundColor:
                  selectedIndex === index ? "#f2f2f2" : "#ffffff",
                border: "1px solid #ddd",
                cursor: "pointer",
                fontWeight: selectedIndex === index ? "bold" : "normal",
                transition: "background-color 0.3s ease",
              }}
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

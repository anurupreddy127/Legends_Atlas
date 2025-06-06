import React from "react";
import { Link } from "react-router-dom";
import "../styles/StoryCard.css"; // Adjust the path as necessary

const StoryCard = ({ story }) => {
  return (
    <Link to={`/story/${story.id}`} className="story-card">
      <div className="story-front">
        <img src={story.thumbnail} alt={story.title} className="story-img" />
      </div>
      <div className="story-back">
        <div>
          <div className="story-title">{story.title}</div>
          {story.description && (
            <div className="font-edu story-desc">{story.description}</div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;

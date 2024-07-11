import React from "react";

/**
 * RecordsGrid component for displaying a grid of record keys.
 * @param {Object} props - Component props.
 * @param {Array<string>} props.keys - Array of record keys to display.
 * @param {function} props.handleKeyClick - Function to handle clicking a record key.
 */
const RecordsGrid = ({ keys, handleKeyClick }) => {
  return (
    <div className="records-grid">
      {keys.map((key, index) => (
        <button
          key={index}
          className="record-key"
          onClick={() => handleKeyClick(key)}
        >
          {key}
        </button>
      ))}
    </div>
  );
};

export default RecordsGrid;

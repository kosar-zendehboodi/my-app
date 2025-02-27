import React from "react";
import "./Toolbar.css";

export default function Toolbar({ timeFormatState, onTimeFormatStateChange }) {
  const toggleTimeFormat = () => {
    onTimeFormatStateChange(!timeFormatState);
    localStorage.setItem("timeFormatState", JSON.stringify(!timeFormatState));
  };

  return (
    <div className="time-format-section">
      <h3>Time format:</h3><button
        className={`toggle-button ${timeFormatState ? "checked" : ""}`}
        onClick={toggleTimeFormat}
      >
        <div className="toggle-text">{timeFormatState ? "24h" : "12h"}</div>
        <div className="toggle-ball"></div>
      </button>
    </div>
  );
}

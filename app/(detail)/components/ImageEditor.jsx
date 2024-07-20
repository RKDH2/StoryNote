"use client";

import React, { useState } from "react";

const ImageEditor = ({ imageSrc }) => {
  const [scale, setScale] = useState(1);

  const handleScaleChange = (event) => {
    setScale(event.target.value);
  };

  return (
    <div>
      <div
        style={{
          overflow: "hidden",
          display: "inline-block",
        }}
      >
        <img
          src={imageSrc}
          alt="Editable"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            display: "block",
          }}
        />
      </div>
      <div>
        <label htmlFor="scaleRange">Scale:</label>
        <input
          id="scaleRange"
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={scale}
          onChange={handleScaleChange}
        />
      </div>
    </div>
  );
};

export default ImageEditor;

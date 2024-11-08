import React from "react";
import { useMediaQuery } from "@mui/material";

const MyEditorFeature = ({ value, onChange }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const handleChange = (value) => {
    onChange(value);
  };
  return (
    <div className="mb-3">
      {/* add Text Area */}
      <textarea
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter feature name"
        className="form-control"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        style={{
          height: isSmallScreen ? "70px" : "100px",
          fontFamily: "cerebri-sans, sans-serif",
          fontSize: "16px",
          lineHeight: "1.5",
          color: "#6c757d",
          letterSpacing:"1px",
          width: isSmallScreen ? "100%" : "70%",
        }}
      />
    </div>
  );
};

export default MyEditorFeature;

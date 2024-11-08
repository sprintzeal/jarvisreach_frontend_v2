import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles for snow theme
import "react-quill/dist/quill.bubble.css"; // import styles for bubble theme
import { useMediaQuery } from "@mui/system";

const MyEditorCompose = ({ field, form, handleContentChange }) => {
  const [content, setContent] = useState(field?.value ? field?.value : ""); // Initialize with form value if available

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "super" }, { script: "sub" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }, "blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["direction", { align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleChange = (value) => {
    setContent(value);

    form.setFieldValue(
      field.name,
      `
      <div style="
        font-family: 'Arial', sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #333;
        text-align: left;
        word-wrap: break-word;
      ">
        ${value}
      </div>
      `
    );

    if (handleContentChange) {
      handleContentChange(value);
    }
  };

  return (
    <div className="mb-3">
      <ReactQuill
        value={content}
        onChange={handleChange}
        modules={modules}
        theme="snow"
        style={{
          height: isSmallScreen ? "300px" : "200px",
          borderRadius: "5px",
        }}
      />
    </div>
  );
};

export default MyEditorCompose;

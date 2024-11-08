import React, { useState, useEffect, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import { useMediaQuery } from "@mui/system";
import { useUploadFileMutation } from "../slices/adminSlice";
import debounce from "lodash.debounce"; // Optional: to debounce handleChange

const MyEditorDashboard = ({ value, setValue, disable }) => {
  const [content, setContent] = useState(value || ""); // Initialize with form value if available
  const [uploadFile] = useUploadFileMutation();

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
      ["link", "image", "video"],
      ["clean"],
    ],
    imageResize: {
      modules: ["Resize", "DisplaySize", "Toolbar"], // Options for resizing
    },
  };

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleImageUpload = async (value) => {
    let updatedContent = value;

    // Find image tags and process them
    const imgTags = value.match(/<img[^>]+>/g);
    if (imgTags) {
      for (const imgTag of imgTags) {
        const srcMatch = imgTag.match(/src="([^"]*)"/);
        if (srcMatch && srcMatch[1].startsWith("data:image")) {
          try {
            const src = srcMatch[1];
            const formData = new FormData();
            const file = await fetch(src).then((r) => r.blob());
            formData.append("files", file, "image.png");

            const response = await uploadFile({
              folder: "blog",
              file: formData,
            }).unwrap();

            const url = response.files[0].url;
            updatedContent = updatedContent.replace(src, url);
          } catch (error) {
            console.error("Image upload error:", error);
          }
        }
      }
    }
    return updatedContent;
  };

  const handleChange = async (value) => {
    if (value === content) return; // Prevent unnecessary state updates

    let updatedContent = await handleImageUpload(value);

    // Use regex to find links in the content
    const linkRegex = /<a\s+(?!.*style="color: blue;")([^>]+)>(.*?)<\/a>/g;
    updatedContent = updatedContent.replace(linkRegex, (match, p1, p2) => {
      // Add the blue color style to links that don't already have it
      return `<a ${p1} style="color: blue;">${p2}</a>`;
    });

    // Only update if content has actually changed
    if (updatedContent !== content) {
      setContent(updatedContent);
      setValue(
        `
          <div style="
            font-family: 'Arial', sans-serif;
            font-size: 16px;
            line-height: 1.5;
            color: #333;
            text-align: left;
            word-wrap: break-word;
          ">
            ${updatedContent}
          </div>
        `
      );
    }
  };
  // Debounce the handleChange function to prevent rapid state updates
  const debouncedHandleChange = useCallback(debounce(handleChange, 500), [
    content,
  ]);

  useEffect(() => {
    return () => {
      // Cleanup debounce on unmount
      debouncedHandleChange.cancel();
    };
  }, [debouncedHandleChange]);

  return (
    <div className="mb-3">
      <ReactQuill
        value={content}
        onChange={debouncedHandleChange}
        modules={modules}
        theme="snow"
        style={{
          height: isSmallScreen ? "300px" : "300px",
          borderRadius: "5px",
        }}
        disabled={disable}
      />
    </div>
  );
};

export default MyEditorDashboard;

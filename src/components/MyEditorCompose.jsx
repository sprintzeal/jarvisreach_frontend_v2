import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles for snow theme
import "react-quill/dist/quill.bubble.css"; // import styles for bubble theme
import { useMediaQuery } from "@mui/system";
import { useUploadFileMutation } from "../slices/adminSlice";

const MyEditorCompose = ({ field, form, handleContentChange }) => {
  const [content, setContent] = useState(field?.value ? field?.value : ""); // Initialize with form value if available
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
    // Add the imageResize module
    imageResize: {
      modules: ["Resize", "DisplaySize", "Toolbar"], // Options for resizing
    },
  };

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleChange =async (value) => {
    let updatedContent = value;

    // Find all image tags
    const imgTags = value.match(/<img[^>]+>/g);
    if (imgTags) {
      for (const imgTag of imgTags) {
        const srcMatch = imgTag.match(/src="([^"]*)"/);
        if (srcMatch && srcMatch[1].startsWith("data:image")) {
          const src = srcMatch[1];
          const formData = new FormData();
          const file = await fetch(src).then((r) => r.blob());
          // append viewable file name
          formData.append("files", file, "image.png");

          const response = await uploadFile({
            folder: "blog",
            file: formData,
          }).unwrap();
          const url = response.files[0].url;

          updatedContent = updatedContent.replace(src, url);
        }
      }
    }
    setContent(updatedContent);
    if (form.setFieldValue) {
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

        ${updatedContent}</div>`
      );
    }
    if (handleContentChange) {
      handleContentChange(updatedContent);
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

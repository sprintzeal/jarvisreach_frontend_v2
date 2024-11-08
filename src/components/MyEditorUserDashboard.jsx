import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles for snow theme
import "react-quill/dist/quill.bubble.css"; // import styles for bubble theme
import { useMediaQuery } from "@mui/system";
import { useUploadFileMutation } from "../slices/adminSlice";

const MyEditorUserDashboard = ({ value, setValue, disable }) => {
  const [content, setContent] = useState(value ? value : ""); // Initialize with form value if available
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
      ["link"],
      ["clean"],
    ],
    imageResize: {
      modules: ["Resize", "DisplaySize", "Toolbar"], // Options for resizing
    },
  };

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleChange = async (value) => {
    setContent(value);
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

        ${value}
      </div>
      `
    );

    // Find all image tags
    const imgTags = value.match(/<img[^>]+>/g);
    // add style to the image
    let updatedContent = value;

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

    // Update the content with all the new URLs
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
  };

  return (
    <div className="mb-3">
      <ReactQuill
        value={content}
        onChange={handleChange}
        modules={modules}
        theme="snow"
        style={{
          height: isSmallScreen ? "300px" : "300px",
          borderRadius: "5px",
          overflow: "hidden",
          border: "1px solid #ccc",
        }}
        disabled={disable}
      />
    </div>
  );
};

export default MyEditorUserDashboard;

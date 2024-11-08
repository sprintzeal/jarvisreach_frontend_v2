import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogEditor = ({ setFieldValue }) => {
  const handleImageUpload = async (file) => {
    // Implement image upload to your API
    const formData = new FormData();
    formData.append("image", file);
    // const response = await fetch("/upload-image", {
    //   method: "POST",
    //   body: formData,
    // });
    // const data = await response?.json();

    // return data.imageUrl; // Assuming the API returns the URL of the uploaded image
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const imageUrl = await handleImageUpload(file);
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, "image", imageUrl);
    };
  };

  return (
    <ReactQuill
      modules={{
        toolbar: {
          container: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
          imageResize: {
            modules: ["Resize", "DisplaySize", "Toolbar"],
          },
          handlers: {
            image: imageHandler,
          },
        },
      }}
      onChange={(content) => setFieldValue("blogDescription", content)}
    />
  );
};

export default BlogEditor;

import React, { useEffect, useState } from "react";
import List from "../../../components/blog__help/List";
import {
  useCreateBlogListMutation,
  useDeleteBlogListMutation,
  useGetBlogListQuery,
  useGetBlogQuery,
  useUpdateBlogListMutation,
  useUploadFileMutation,
} from "../../../slices/adminSlice";
import MyEditorDashboard from "../../../components/MyEditorDashboard";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa6";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Scrollbar } from "../../../components/Scrollbar";

const BlogList = ({ collapsed }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [openAddList, setOpenAddList] = useState(true);
  const [editorValue, setEditorValue] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [editorValueAuthor, setEditorValueAuthor] = useState("");
  const [uploadedFilesAuthor, setUploadedFilesAuthor] = useState([]);
  const [editorValueTableOfContents, setEditorValueTableOfContents] =
    useState("");
  const [file, setFile] = useState(null);
  const [fileThumbnail, setFileThumbnail] = useState(null);
  const [fileAuthor, setFileAuthor] = useState(null);
  const [uploadedFilesThumbnail, setUploadedFilesThumbnail] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [expanded, setExpanded] = useState(0);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { data, isLoading, isSuccess } = useGetBlogListQuery({
    page: page,
    limit: limit,
  });
  const {
    data: blogs,
    isLoading: blogsLoading,
    isSuccess: blogsSuccess,
  } = useGetBlogQuery({
    page: 1,
    limit: 100,
    pagination: false,
  });

  const validationSchema = Yup.object({
    blogCategory: Yup.string().required("Blog Category is required"),
    blogSlug: Yup.string()
      .required("Blog slug URL is required")
      .test("unique", "Slug URL already exists", async (value) => {
        const isDuplicate = data?.blogSlugs?.some(
          (blog) => blog?.slugUrl === value
        );
        return !isDuplicate;
      }),
    blogTitle: Yup.string().required("Blog Title is required"),
    blogDescription: Yup.string(),
    metaTitle: Yup.string().required("Meta title is required"),
    metaKeywords: Yup.string().required("Meta Keywords are required"),
    metaDescription: Yup.string().required("Meta Description is required"),
    authorName: Yup.string().required("Author Name is required"),
    tableOfContents: Yup.array().of(
      Yup.object().shape({
        question: Yup.string().required("Question is required"),
        show: Yup.string().required("Show is required"),
        description: Yup.string().required("Description is required"),
      })
    ),
  }).test(
    "description-or-toc",
    "Either blog description or table of contents is required",
    function (value) {
      const { blogDescription, tableOfContents } = value;
      return blogDescription || (tableOfContents && tableOfContents.length > 0);
    }
  );

  const itemsPerPageOptions = [5, 10, 20, 50];
  const totalItems = data?.totalItems || 0;
  const [currentPage, setCurrentPage] = useState(data?.page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    itemsPerPageOptions[
      itemsPerPageOptions.indexOf(data?.limit) !== -1
        ? itemsPerPageOptions.indexOf(data?.limit)
        : 0
    ]
  );

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    setPage(page);
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setPage(currentPage + 1);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
    setPage(1);
    setLimit(Number(event.target.value));
  };

  const getVisiblePages = () => {
    const visiblePages = [];
    const pageRange = 5;
    let startPage = Math.max(currentPage - Math.floor(pageRange / 2), 1);
    let endPage = Math.min(startPage + pageRange - 1, totalPages);

    if (endPage - startPage < pageRange - 1) {
      startPage = Math.max(endPage - pageRange + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  const [uploadFile] = useUploadFileMutation();
  const [createBlogList] = useCreateBlogListMutation();
  const [deleteBlogList, { isLoading: isLoadingDelete }] =
    useDeleteBlogListMutation();
  const [updateBlogList] = useUpdateBlogListMutation();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const handleSubmit = async (values, errors) => {
    const div = document.createElement("div");
    div.innerHTML = editorValue;
    const textss = div.textContent || div.innerText || "";

    if (values.blogTitle === "") {
      document.querySelector(`[name=blogTitle]`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (errors) {
      for (const key in errors) {
        if (
          errors.hasOwnProperty(key) &&
          key !== "tableOfContents" &&
          key !== "blogDescription"
        ) {
          const error = errors[key];

          // Handle object errors
          if (typeof error === "object" && !Array.isArray(error)) {
            for (const subKey in error) {
              if (error.hasOwnProperty(subKey)) {
                document.querySelector(`[name=${key}]`)?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                return toast.error(error[subKey]);
              }
            }
          } else if (Array.isArray(error)) {
            error.forEach((err) => {
              document.querySelector(`[name=${key}]`)?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              return toast.error(` ${Object.keys(err)} of ${key} is required`);
            });
          } else {
            document.querySelector(`[name=${key}]`)?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            return toast.error(error);
          }
        } else if (key === "tableOfContents") {
          let hasEmptyTOC = false;

          values.tableOfContents.forEach((toc) => {
            const div = document.createElement("div");
            div.innerHTML = toc.description;
            const text = div.textContent || div.innerText || "";

            if (
              text.trim().length === 0 &&
              (!toc.question || toc.question.length === 0) &&
              textss.trim().length === 0
            ) {
              hasEmptyTOC = true;
            }
          });

          if (hasEmptyTOC) {
            toast.error(
              "Either blog description or table of contents is required"
            );
            return; // Prevent further execution
          }
        }
      }
    }

    setIsLoadingSubmit(true);

    const formData = new FormData();
    const formDataThumbnail = new FormData();
    const formDataAuthor = new FormData();

    formData.append("files", uploadedFiles[0]);
    formDataThumbnail.append("files", uploadedFilesThumbnail[0]);
    formDataAuthor.append("files", uploadedFilesAuthor[0]);

    const res = await uploadFile({
      folder: "blog",
      file: formData,
    }).unwrap();

    const resThumbnail = await uploadFile({
      folder: "blog",
      file: formDataThumbnail,
    }).unwrap();

    const resAuthor = await uploadFile({
      folder: "blog",
      file: formDataAuthor,
    }).unwrap();

    const blogImage = res?.files?.length > 0 ? res?.files[0].url : "";
    const blogThumbnailImage =
      resThumbnail?.files?.length > 0 ? resThumbnail?.files[0].url : "";
    const authorImage =
      resAuthor?.files?.length > 0 ? resAuthor?.files[0].url : "";

    try {
      const data = {
        category: values.blogCategory,
        blogStatus: values.radioInline ? "Online" : "Offline",
        blogInfo: {
          category: values.blogCategory,
          title: values.blogTitle,
          slugUrl: values.blogSlug,
          h1Tag: values.blogH1Tag,
          description: editorValue,
        },
        blogBannerImage: blogImage,
        blogThumbnailImage: blogThumbnailImage,
        websiteMetadata: {
          title: values.metaTitle,
          keywords: values.metaKeywords,
          description: values.metaDescription,
        },
        authorProfile: {
          authorName: values.authorName,
          authorImage: authorImage,
          authorDescription: editorValueAuthor,
        },
        tableOfContents: values.tableOfContents.map((item) => ({
          question: item.question || "",
          show: item.show || "",
          description: item.description || "",
        })),
        authorSocialLinks: {
          facebook: values.facebook,
          twitter: values.twitter,
          instagram: values.instagram,
          linkedin: values.linkedin,
          skype: values.skype,
          youtube: values.youtube,
        },
      };

      await createBlogList({
        body: data,
      })
        .unwrap()
        .then((res) => {
          toast.success("Blog added successfully");
          setOpenAddList(true);
        });
      setIsLoadingSubmit(false);
      setEditorValue("");
      setEditorValueAuthor("");
      setEditorValueTableOfContents("");
      setUploadedFiles([]);
    } catch (error) {
      console.error("Error uploading data", error);
      toast.error(error.data.message);
      setIsLoadingSubmit(false);
    }
  };

  const [openEdit, setOpenEdit] = useState(false);
  const [blogId, setBlogId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [blogStatus, setBlogStatus] = useState("");
  const [blogInfoSlug, setBlogInfoSlug] = useState("");
  const [blogInfoTitle, setBlogInfoTitle] = useState("");
  const [blogInfoDescription, setBlogInfoDescription] = useState("");
  const [blogBannerImage, setBlogBannerImage] = useState("");
  const [blogThumbnailImage, setBlogThumbnailImage] = useState("");
  const [websiteMetadataTitle, setWebsiteMetadataTitle] = useState("");
  const [websiteMetadataKeywords, setWebsiteMetadataKeywords] = useState("");
  const [websiteMetadataDescription, setWebsiteMetadataDescription] =
    useState("");
  const [authorProfileAuthorName, setAuthorProfileAuthorName] = useState("");
  const [authorProfileAuthorDescription, setAuthorProfileAuthorDescription] =
    useState("");
  const [authorProfileAuthorImage, setAuthorProfileAuthorImage] = useState("");
  const [tableOfContentsQuestion, setTableOfContentsQuestion] = useState("");
  const [tableOfContents, setTableOfContents] = useState([]);
  const [tableOfContentsShow, setTableOfContentsShow] = useState("");
  const [tableOfContentsDescription, setTableOfContentsDescription] =
    useState("");
  const [authorSocialLinksFacebook, setAuthorSocialLinksFacebook] =
    useState("");
  const [authorSocialLinksTwitter, setAuthorSocialLinksTwitter] = useState("");
  const [authorSocialLinksInstagram, setAuthorSocialLinksInstagram] =
    useState("");
  const [authorSocialLinksLinkedin, setAuthorSocialLinksLinkedin] =
    useState("");
  const [authorSocialLinksSkype, setAuthorSocialLinksSkype] = useState("");
  const [authorSocialLinksYoutube, setAuthorSocialLinksYoutube] = useState("");

  const handleEdit = (blog) => {
    setOpenEdit(true);
    setBlogId(blog._id);
    setCategoryId(blog.blogInfo?.category);
    setBlogInfoSlug(blog.blogInfo?.slugUrl);
    setBlogInfoTitle(blog.blogInfo?.title);
    setBlogInfoDescription(blog.blogInfo?.description);
    setBlogBannerImage(blog.blogBannerImage);
    setBlogThumbnailImage(blog.blogThumbnailImage);
    setWebsiteMetadataTitle(blog.websiteMetadata?.title);
    setWebsiteMetadataKeywords(blog.websiteMetadata?.keywords);
    setWebsiteMetadataDescription(
      blog?.websiteMetadata?.description
        ? blog?.websiteMetadata?.description
        : ""
    );
    setAuthorProfileAuthorName(
      blog?.authorProfile?.authorName ? blog?.authorProfile?.authorName : ""
    );
    setAuthorProfileAuthorDescription(
      blog?.authorProfile?.authorDescription
        ? blog?.authorProfile?.authorDescription
        : ""
    );
    setAuthorProfileAuthorImage(blog.authorProfile?.authorImage);
    setTableOfContentsQuestion(blog.tableOfContents[0]?.question);
    setTableOfContents(blog.tableOfContents);
    setTableOfContentsShow(blog.tableOfContents[0]?.show);
    setTableOfContentsDescription(blog.tableOfContents[0]?.description);
    setAuthorSocialLinksFacebook(blog.authorSocialLinks?.facebook);
    setAuthorSocialLinksTwitter(blog.authorSocialLinks?.twitter);
    setAuthorSocialLinksInstagram(blog.authorSocialLinks?.instagram);
    setAuthorSocialLinksLinkedin(blog.authorSocialLinks?.linkedin);
    setAuthorSocialLinksSkype(blog.authorSocialLinks?.skype);
    setAuthorSocialLinksYoutube(blog.authorSocialLinks?.youtube);
    setBlogStatus(blog?.blogStatus);
  };
  const validationSchemaEdit = Yup.object({
    blogCategory: Yup.string().required("Blog Category is required"),
    blogSlug: Yup.string()
      .required("Blog slug URL is required")
      .test("unique", "Slug URL already exists", async (value) => {
        if (value === blogInfoSlug) {
          return true;
        }
        const isDuplicate = data?.blogSlugs?.some(
          (blog) =>
            // take only unique slugs or previous slug
            blog?.slugUrl === value
        );

        return !isDuplicate;
      }),
    blogTitle: Yup.string().required("Blog Title is required"),
    blogDescription: Yup.string(),
    metaTitle: Yup.string().required("Meta title is required"),
    metaKeywords: Yup.string().required("Meta Keywords are required"),
    metaDescription: Yup.string().required("Meta Description is required"),
    authorName: Yup.string().required("Author Name is required"),
    tableOfContents: Yup.array().of(
      Yup.object().shape({
        question: Yup.string().required("Question is required"),
        show: Yup.string().required("Show is required"),
        description: Yup.string().required("Description is required"),
      })
    ),
  });
  const handleSubmitEdit = async (values, errors) => {
    const div = document.createElement("div");
    div.innerHTML = blogInfoDescription ? blogInfoDescription : editorValue;
    const textss = div.textContent || div.innerText || "";

    if (!authorProfileAuthorDescription || !blogInfoDescription) {
      toast.error(
        `Please fill all required fields: ${
          !authorProfileAuthorDescription
            ? "Author Description"
            : !blogInfoDescription
            ? "Blog Description"
            : "Table of Contents"
            ? "Table of Contents"
            : "Description of Table of Contents is required"
        }`
      );
      return;
    }
    if (errors) {
      if (
        errors.blogCategory ||
        errors.blogSlug ||
        errors.blogTitle ||
        errors.metaTitle ||
        errors.metaKeywords ||
        errors.metaDescription ||
        errors.authorName ||
        errors.authorDescription
      ) {
        toast.error(
          `Please fill all required fields: ${Object.keys(errors).join(", ")}`
        );
        return;
      }
    }

    if (values.tableOfContents) {
      let hasEmptyTOC = false;

      values.tableOfContents.forEach((toc) => {
        const div = document.createElement("div");
        div.innerHTML = toc.description;
        const text = div.textContent || div.innerText || "";
        if (
          text.trim().length === 0 &&
          (!toc.question || toc.question.length === 0) &&
          textss?.trim().length === 0
        ) {
          hasEmptyTOC = true;
        }
      });

      if (hasEmptyTOC) {
        toast.error(
          "Either blog description or table of contents is required",
          {
            duration: 5000,
          }
        );
        return;
      }
    }

    setIsLoadingSubmit(true);
    const formData = new FormData();
    const formDataThumbnail = new FormData();
    const formDataAuthor = new FormData();

    formData.append("files", uploadedFiles[0]);
    formDataThumbnail.append("files", uploadedFilesThumbnail[0]);
    formDataAuthor.append("files", uploadedFilesAuthor[0]);

    const res = await uploadFile({
      folder: "blog",
      file: formData,
    }).unwrap();
    const resThumbnail = await uploadFile({
      folder: "blog",
      file: formDataThumbnail,
    }).unwrap();
    const resAuthor = await uploadFile({
      folder: "blog",
      file: formDataAuthor,
    }).unwrap();

    const blogImage = res.files[0] ? res?.files[0]?.url : "";
    const blogThumbnailImages = resThumbnail?.files[0]
      ? resThumbnail?.files[0]?.url
      : "";
    const authorImage = resAuthor?.files[0] ? resAuthor?.files[0]?.url : "";

    try {
      const data = {
        category: values.blogCategory,
        blogStatus: values.radioInline,
        blogInfo: {
          category: values.blogCategory,
          title: values.blogTitle,
          slugUrl: values.blogSlug,
          h1Tag: values.blogH1Tag,
          description: blogInfoDescription ? blogInfoDescription : editorValue,
        },
        blogBannerImage: blogImage ? blogImage : blogBannerImage,
        blogThumbnailImage: blogThumbnailImages
          ? blogThumbnailImage
          : blogThumbnailImage,
        websiteMetadata: {
          title: values.metaTitle,
          keywords: values.metaKeywords,
          description: values.metaDescription,
        },
        authorProfile: {
          authorName: values.authorName,
          authorImage: authorImage ? authorImage : authorProfileAuthorImage,
          authorDescription: authorProfileAuthorDescription,
        },
        tableOfContents: values.tableOfContents.map((item) => ({
          question: item.question || "",
          show: item.show || "",
          description: item.description,
        })),

        authorSocialLinks: {
          facebook: values.facebook,
          twitter: values.twitter,
          instagram: values.instagram,
          linkedin: values.linkedin,
          skype: values.skype,
          youtube: values.youtube,
        },
      };

      await updateBlogList({
        id: blogId,
        body: data,
      }).unwrap();
      toast.success("Blog updated successfully");
      setOpenEdit(false);
      setIsLoadingSubmit(false);
    } catch (error) {
      console.error("Error updating data", error);
      toast.error(error.data.message);
      setIsLoadingSubmit(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
    if (files) {
      setFile(files);
    }
    setBlogBannerImage(URL.createObjectURL(files[0]));
  };

  const handleFileChangeThumnail = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFilesThumbnail(files);
    if (files) {
      setFileThumbnail(files);
    }
    setBlogThumbnailImage(URL.createObjectURL(files[0]));
  };

  const handleFileChangeAuthor = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFilesAuthor(files);
    if (files) {
      setFileAuthor(files);
    }
    setAuthorProfileAuthorImage(URL.createObjectURL(files[0]));
  };

  const handleDeleteSelected = async () => {
    await deleteBlogList({
      ids: selectedItems?.length > 0 ? selectedItems : deletedItems,
    })
      .unwrap()
      .then((res) => {
        toast.success("Blog deleted successfully.");
        setOpenDeleteModal(false);
        setDeletedItems([]);
        setSelectedItems([]);
      })
      .catch((error) => {
        toast.error(error.data.message);
      });
  };

  useEffect(() => {}, []);

  return (
    <div>
      {openAddList ? (
        <div className="content-page">
          <div className="content">
            {/* <!-- Start Content--> */}
            <div className="container-fluid">
              {/* <!-- start page title --> */}
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box">
                    <div className="page-title-right">
                      <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item">
                          <a href="javascript: void(0);">Jarvisreach</a>
                        </li>
                        <li className="breadcrumb-item">
                          <a href="javascript: void(0);">Blog</a>
                        </li>
                        <li className="breadcrumb-item active">Blog List</li>
                      </ol>
                    </div>
                    <h4 className="page-title">Blog List</h4>
                  </div>
                </div>
              </div>
              {/* <!-- end page title -->  */}

              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="row mb-2">
                        <div className="col-sm-4">
                          <a
                            // href="help-support-add.html"
                            className="btn btn-danger waves-effect waves-light"
                            onClick={() => setOpenAddList(false)}
                          >
                            <i className="mdi mdi-plus-circle me-1"></i> Add New
                          </a>
                        </div>
                        {selectedItems.length > 0 && (
                          <div className="col-sm-8">
                            <div className="text-sm-end">
                              <button
                                type="button"
                                className="btn btn-success mb-2 me-1"
                                onClick={() => {
                                  setOpenDeleteModal(true);
                                  setDeletedItems(selectedItems);
                                }}
                              >
                                <i className="mdi mdi-delete me-1"></i> Delete
                              </button>
                            </div>
                          </div>
                        )}
                        {/* <!-- end col--> */}
                      </div>
                      <div className="table-responsive">
                        <Scrollbar>
                          <table
                            className="table table-centered table-nowrap table-striped"
                            id="products-datatable"
                            style={{
                              minWidth: "100%",
                            }}
                          >
                            <thead
                              style={{
                                backgroundColor: "#ffff",
                              }}
                            >
                              <tr>
                                <th>
                                  <div
                                    className="form-check"
                                    style={{
                                      marginLeft: "8px",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="customCheck1"
                                      checked={
                                        selectedItems.length ===
                                        data?.result?.length
                                      }
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedItems(
                                            data?.result?.map(
                                              (blog) => blog._id
                                            )
                                          );
                                        } else {
                                          setSelectedItems([]);
                                        }
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      for="customCheck1"
                                    >
                                      &nbsp;
                                    </label>
                                  </div>
                                </th>
                                <th>Blog Title</th>
                                <th>Category</th>
                                <th>Author</th>
                                <th>Create Date</th>
                                <th>Status</th>
                                <th style={{ width: "85px" }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data?.result?.map((blog) => (
                                <tr
                                  key={blog._id}
                                  // onClick={() => {
                                  //   history.push(`/blog/${blog._id}`);
                                  // }}
                                >
                                  <td>
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="customCheck2"
                                        checked={selectedItems.includes(
                                          blog._id
                                        )}
                                        onChange={() => {
                                          setSelectedItems((prev) => {
                                            if (prev.includes(blog._id)) {
                                              return prev.filter(
                                                (item) => item !== blog._id
                                              );
                                            } else {
                                              return [...prev, blog._id];
                                            }
                                          });
                                        }}
                                      />
                                      <label
                                        className="form-check-label"
                                        for="customCheck2"
                                      >
                                        &nbsp;
                                      </label>
                                    </div>
                                  </td>

                                  <td
                                    className="table-user"
                                    style={{
                                      width: "40%",
                                    }}
                                  >
                                    {blog.blogInfo.title}
                                  </td>
                                  <td
                                    className="table-user"
                                    style={{
                                      width: "20%",
                                    }}
                                  >
                                    {blog?.category?.categoryName}
                                  </td>

                                  <td className="table-user">
                                    {blog.authorProfile.authorName}
                                  </td>
                                  <td>
                                    {new Date(
                                      blog.createdAt
                                    ).toLocaleDateString()}
                                  </td>
                                  <td>
                                    <span
                                      className="badge"
                                      style={{
                                        color:
                                          blog?.blogStatus === "Online"
                                            ? "rgb(26 188 156)"
                                            : "rgb(241 85 108)",
                                        backgroundColor:
                                          blog?.blogStatus === "Online"
                                            ? "rgb(26 188 156 / 25%)"
                                            : "rgb(241 85 108 / 25%)",
                                      }}
                                    >
                                      {blog.blogStatus === "Online"
                                        ? "Active"
                                        : "Deactive"}
                                    </span>
                                  </td>

                                  <td>
                                    <a
                                      href="javascript:void(0);"
                                      className="action-icon"
                                      onClick={() => {
                                        handleEdit(blog);
                                      }}
                                    >
                                      {" "}
                                      <i className="mdi mdi-square-edit-outline"></i>
                                    </a>
                                    <a
                                      href="javascript:void(0);"
                                      className="action-icon"
                                      onClick={() => {
                                        setOpenDeleteModal(true);
                                        setDeletedItems([blog._id]);
                                      }}
                                    >
                                      {" "}
                                      <i className="mdi mdi-delete"></i>
                                    </a>
                                  </td>
                                </tr>
                              ))}
                              {data?.result?.length === 0 && (
                                <tr>
                                  <td colSpan="5" className="text-center">
                                    No data found
                                  </td>
                                </tr>
                              )}
                              {isLoading && (
                                <tr>
                                  <td colSpan="5" className="text-center">
                                    <CircularProgress />
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </Scrollbar>
                      </div>
                      <div
                        className=""
                        style={{
                          maxWidth: "100%",
                          overflowX: "auto",
                          display: "flex",
                          // direction column in small screen
                          flexDirection: isSmallScreen ? "column" : "",
                          justifyContent: "flex-end",
                        }}
                      >
                        <div className="pagination-controls">
                          <label
                            style={{
                              fontSize: "16px",
                              fontWeight: "400",
                            }}
                          >
                            Items per page
                            <select
                              value={itemsPerPage}
                              onChange={handleItemsPerPageChange}
                              style={{
                                // style for select
                                padding: "5px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                marginLeft: "10px",
                                cursor: "pointer",
                              }}
                            >
                              {itemsPerPageOptions?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <ul className="pagination pagination-rounded mb-0 pt-4">
                          {/* first page */}
                          {getVisiblePages()?.length > 3 && currentPage > 3 && (
                            <li
                              className="page-item"
                              onClick={() => handlePageClick(1)}
                              style={{ cursor: "pointer" }}
                            >
                              <a className="page-link">1</a>
                            </li>
                          )}
                          <li
                            className="page-item"
                            onClick={handlePrevClick}
                            style={{ cursor: "pointer" }}
                          >
                            <a className="page-link" aria-label="Previous">
                              <span aria-hidden="true">«</span>
                              <span className="visually-hidden">Previous</span>
                            </a>
                          </li>
                          {getVisiblePages().map((page) => (
                            <li
                              key={page}
                              className={`page-item ${
                                page === (currentPage || pages) ? "active" : ""
                              }`}
                              onClick={() => handlePageClick(page)}
                              style={{ cursor: "pointer" }}
                            >
                              <a className="page-link">{page}</a>
                            </li>
                          ))}
                          <li className="page-item" onClick={handleNextClick}>
                            <a
                              className="page-link"
                              aria-label="Next"
                              style={{ cursor: "pointer" }}
                            >
                              <span aria-hidden="true">»</span>
                              <span className="visually-hidden">Next</span>
                            </a>
                          </li>
                          {totalPages > 5 && currentPage < totalPages - 2 && (
                            <li
                              className="page-item"
                              onClick={() => handlePageClick(totalPages)}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <a className="page-link">...{totalPages}</a>
                            </li>
                          )}
                        </ul>
                      </div>{" "}
                    </div>
                    {/* <!-- end card-body--> */}
                  </div>
                  {/* <!-- end card--> */}
                </div>
                {/* <!-- end col --> */}
              </div>
              {/* <!-- end row --> */}
            </div>
            {/* <!-- container --> */}
          </div>
          {/* <!-- content --> */}
          <Dialog
            open={openDeleteModal}
            onClose={() => {
              setOpenDeleteModal(false);
              setDeletedItems([]);
              setSelectedItems([]);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete Blog List"}
            </DialogTitle>
            <DialogContent>
              <div>
                <p
                  style={{
                    fontSize: "16px",
                    color: "gray",
                    fontWeight: "500",
                  }}
                >
                  Are you sure you want to delete this blog list?
                </p>
                <div className="text-end pl-4 mt-2">
                  <Button
                    variant="text"
                    color="error"
                    disabled={isLoadingDelete}
                    onClick={() => handleDeleteSelected()}
                  >
                    {/* {isLoadingDelete ? (
                      <CircularProgress size={20} />
                    ) : ( */}
                    Delete
                    {/* )} */}
                  </Button>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      setOpenDeleteModal(false);
                      setDeletedItems([]);
                      setSelectedItems([]);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            open={openEdit}
            onClose={() => {
              setOpenEdit(false);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                width: "100%",
                height: "100%",
              }}
            >
              <DialogTitle id="alert-dialog-title">
                {"Edit Blog List"}
              </DialogTitle>
              <Formik
                initialValues={{
                  blogCategory: categoryId,
                  blogSlug: blogInfoSlug,
                  blogTitle: blogInfoTitle,
                  blogDescription: blogInfoDescription,
                  metaTitle: websiteMetadataTitle,
                  metaKeywords: websiteMetadataKeywords[0],
                  metaDescription: websiteMetadataDescription,
                  tableOfContents: tableOfContents,
                  authorName: authorProfileAuthorName,
                  authorDescription: authorProfileAuthorDescription,
                  authorImage: authorProfileAuthorImage,
                  authorSocialMedia: "",
                  radioInline: blogStatus,
                  facebook: authorSocialLinksFacebook,
                  twitter: authorSocialLinksTwitter,
                  instagram: authorSocialLinksInstagram,
                  linkedin: authorSocialLinksLinkedin,
                  skype: authorSocialLinksSkype,
                  youtube: authorSocialLinksYoutube,
                  files: [],
                }}
                validationSchema={validationSchemaEdit}
                onSubmit={handleSubmitEdit}
                enableReinitialize
              >
                {({ values, setFieldValue, errors, touched }) => (
                  <Form>
                    <div className="col">
                      <div className="col-lg-12">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                              Blog Info
                            </h5>

                            <div className="mb-3">
                              <label
                                htmlFor="blogCategory"
                                className="form-label"
                              >
                                Blog Category*
                              </label>
                              <Field
                                as="select"
                                name="blogCategory"
                                className={`form-control select2 ${
                                  errors.blogCategory && touched.blogCategory
                                    ? "is-invalid"
                                    : ""
                                }`}
                              >
                                {blogs?.result?.map((blog) => (
                                  <option value={blog._id} key={blog._id}>
                                    {blog.categoryName}
                                  </option>
                                ))}
                              </Field>
                            </div>

                            <div className="mb-3">
                              <label htmlFor="blogSlug" className="form-label">
                                Blog slug URL*
                              </label>
                              <Field
                                type="text"
                                name="blogSlug"
                                className={`form-control ${
                                  errors.blogSlug && touched.blogSlug
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="blogTitle" className="form-label">
                                Blog Title*
                              </label>
                              <Field
                                type="text"
                                name="blogTitle"
                                className={`form-control ${
                                  errors.blogTitle && touched.blogTitle
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                            </div>

                            <div className="mb-5">
                              <label
                                htmlFor="blogDescription"
                                className="form-label"
                              >
                                Blog Description
                              </label>
                              <MyEditorDashboard
                                value={blogInfoDescription}
                                setValue={setBlogInfoDescription}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-body">
                            <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                              Website Meta Data*
                            </h5>

                            <div className="mb-3">
                              <label htmlFor="metaTitle" className="form-label">
                                Meta title*
                              </label>
                              <Field
                                type="text"
                                name="metaTitle"
                                className={`form-control ${
                                  errors.metaTitle && touched.metaTitle
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                            </div>

                            <div className="mb-3">
                              <label
                                htmlFor="metaKeywords"
                                className="form-label"
                              >
                                Meta Keywords*
                              </label>
                              <Field
                                type="text"
                                name="metaKeywords"
                                className={`form-control ${
                                  errors.metaKeywords && touched.metaKeywords
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="metaDescription"
                                className="form-label"
                              >
                                Meta Description*
                              </label>
                              <Field
                                as="textarea"
                                name="metaDescription"
                                rows="5"
                                className={`form-control ${
                                  errors.metaDescription &&
                                  touched.metaDescription
                                    ? "is-invalid"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-body">
                            <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                              Table of Contents
                            </h5>

                            {/* Accordion to dynamically add and edit items */}
                            <FieldArray name="tableOfContents">
                              {({ push, remove, form }) => (
                                <>
                                  {form.values.tableOfContents.map(
                                    (tocItem, index) => (
                                      <Accordion
                                        expanded={expanded === index}
                                        onChange={handleAccordionChange(index)}
                                        key={index}
                                        sx={{
                                          border: "1px solid #f4f4f4",
                                          borderRadius: "10px",
                                          boxShadow: "none",
                                        }}
                                      >
                                        <AccordionSummary
                                          expandIcon={<ExpandMoreIcon />}
                                        >
                                          {index > 0 ? (
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                marginTop: "10px",
                                              }}
                                            >
                                              <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => remove(index)}
                                                style={{}}
                                              >
                                                Remove
                                              </Button>
                                              {"Content " + (index + 1)}
                                            </div>
                                          ) : (
                                            "Content " + (index + 1)
                                          )}
                                        </AccordionSummary>

                                        <AccordionDetails
                                          style={{
                                            marginBottom: "30px",
                                            marginTop: "10px",
                                          }}
                                        >
                                          <div className="mb-3">
                                            <label
                                              htmlFor={`tableOfContents.${index}.question`}
                                              className="form-label"
                                            >
                                              Question
                                            </label>
                                            <Field
                                              name={`tableOfContents.${index}.question`}
                                              className="form-control"
                                              placeholder="Enter question"
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label
                                              htmlFor={`tableOfContents.${index}.show`}
                                              className="form-label"
                                            >
                                              Show
                                            </label>
                                            <Field
                                              as="select"
                                              name={`tableOfContents.${index}.show`}
                                              className="form-control select2"
                                            >
                                              <option value="Show">Show</option>
                                              <option value="Hide">Hide</option>
                                            </Field>
                                          </div>
                                          <div className="mb-5">
                                            <label
                                              htmlFor={`tableOfContents.${index}.description`}
                                              className="form-label"
                                            >
                                              Description
                                            </label>
                                            <MyEditorDashboard
                                              value={tocItem.description}
                                              setValue={(value) =>
                                                setFieldValue(
                                                  `tableOfContents.${index}.description`,
                                                  value
                                                )
                                              }
                                            />
                                          </div>
                                        </AccordionDetails>
                                      </Accordion>
                                    )
                                  )}
                                  <div className="col-auto mb-4 mt-4 me-3">
                                    <div className="text-lg-end my-lg-0">
                                      <button
                                        type="button"
                                        className="btn btn-success waves-effect waves-light me-1"
                                        onClick={() =>
                                          // remove all except the first one
                                          form.setFieldValue(
                                            "tableOfContents",
                                            [form.values.tableOfContents[0]]
                                          )
                                        }
                                      >
                                        <i className="mdi mdi-cog"></i> Remove
                                        All
                                      </button>
                                      <a
                                        onClick={() => {
                                          push({
                                            question: "",
                                            show: "Show",
                                            description: "",
                                          });
                                          // setExpanded(form.values.tableOfContents.length)
                                        }}
                                        className="btn btn-danger waves-effect waves-light"
                                        style={{ cursor: "pointer" }}
                                      >
                                        <i className="mdi mdi-plus-circle me-1"></i>{" "}
                                        Add More
                                      </a>
                                    </div>
                                  </div>
                                </>
                              )}
                            </FieldArray>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-12">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                              Blog Banner Image*
                            </h5>
                            Recommended thumbnail size 800x400 (px).
                            {!blogBannerImage && (
                              <div
                                onClick={() =>
                                  document.getElementById("fileInput").click()
                                }
                                className="dropzone dz-message needsclick"
                              >
                                <input
                                  id="fileInput"
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={handleFileChange}
                                />
                                <i className="h1 text-muted dripicons-cloud-upload"></i>
                                <h3>Drop files here or click to upload.</h3>
                                <span className="text-muted font-13">
                                  (This is just a demo dropzone. Selected files
                                  are <strong>not</strong> actually uploaded.)
                                </span>
                              </div>
                            )}
                            {/* Preview */}
                            <div
                              className="dropzone-previews mt-3"
                              id="file-previews"
                            >
                              {blogBannerImage && (
                                <div style={{ position: "relative" }}>
                                  {/* cross button to remove image */}
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm remove-preview"
                                    onClick={() => setBlogBannerImage(null)}
                                    style={{
                                      position: "absolute",
                                      right: 5,
                                      top: -30,
                                      zIndex: "1000",
                                      padding: "1px 1px 0px 2px",
                                    }}
                                  >
                                    <i className="mdi mdi-close"></i>
                                  </button>

                                  <img
                                    src={blogBannerImage}
                                    alt="Preview"
                                    style={{
                                      width: "100%",
                                      maxHeight: "300px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="card">
                          <div className="card-body">
                            <h5 className="text-uppercase mt-0 mb-3 bg-light p-2">
                              Blog Thumbnail Image*
                            </h5>
                            Recommended thumbnail size 800x400 (px).
                            {!blogThumbnailImage && (
                              <div
                                onClick={() =>
                                  document
                                    .getElementById("fileInputThumbnail")
                                    .click()
                                }
                                className="dropzone dz-message needsclick"
                              >
                                <input
                                  id="fileInputThumbnail"
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={handleFileChangeThumnail}
                                />
                                <i className="h1 text-muted dripicons-cloud-upload"></i>
                                <h3>Drop files here or click to upload.</h3>
                                <span className="text-muted font-13">
                                  (This is just a demo dropzone. Selected files
                                  are <strong>not</strong> actually uploaded.)
                                </span>
                              </div>
                            )}
                            {/* <!-- Preview --> */}
                            {blogThumbnailImage && (
                              <div style={{ position: "relative" }}>
                                {/* cross button to remove image */}
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm remove-preview"
                                  onClick={() => setBlogThumbnailImage(null)}
                                  style={{
                                    position: "absolute",
                                    right: 5,
                                    top: -30,
                                    zIndex: "1000",
                                    padding: "1px 1px 0px 2px",
                                  }}
                                >
                                  <i className="mdi mdi-close"></i>
                                </button>

                                <img
                                  src={blogThumbnailImage}
                                  alt="Preview"
                                  style={{
                                    width: "100%",
                                    maxHeight: "300px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="card">
                          <div className="card-body">
                            <h5 className="mb-3 text-uppercase bg-light p-2">
                              <i className="mdi mdi-earth me-1"></i> author
                              Profile{" "}
                            </h5>
                            <div className="row">
                              <div className="">
                                <label
                                  for="product-meta-title"
                                  className="form-label"
                                >
                                  Author Name*
                                </label>
                                <Field
                                  type="text"
                                  name="authorName"
                                  className={`form-control ${
                                    errors.authorName && touched.authorName
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                />
                              </div>

                              <div className="card-body">
                                <h5 className="text-uppercase mt-0  bg-light p-2">
                                  Author Image*
                                </h5>
                                Recommended thumbnail size 800x400 (px).
                                {!authorProfileAuthorImage && (
                                  <div
                                    onClick={() =>
                                      document
                                        .getElementById("fileInput1")
                                        .click()
                                    }
                                    className="dropzone dz-message needsclick"
                                  >
                                    <input
                                      id="fileInput1"
                                      type="file"
                                      style={{ display: "none" }}
                                      onChange={handleFileChangeAuthor}
                                    />
                                    <i className="h1 text-muted dripicons-cloud-upload"></i>
                                    <h3>Drop files here or click to upload.</h3>
                                    <span className="text-muted font-13">
                                      (This is just a demo dropzone. Selected
                                      files are <strong>not</strong> actually
                                      uploaded.)
                                    </span>
                                  </div>
                                )}
                                {/* <!-- Preview --> */}
                                {authorProfileAuthorImage && (
                                  <div style={{ position: "relative" }}>
                                    {/* cross button to remove image */}
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm remove-preview"
                                      onClick={() =>
                                        setAuthorProfileAuthorImage(null)
                                      }
                                      style={{
                                        position: "absolute",
                                        right: 5,
                                        top: -30,
                                        zIndex: "1000",
                                        padding: "1px 1px 0px 2px",
                                      }}
                                    >
                                      <i className="mdi mdi-close"></i>
                                    </button>

                                    <img
                                      src={authorProfileAuthorImage}
                                      alt="Preview"
                                      style={{
                                        width: "100%",
                                        maxHeight: "300px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="">
                                <label
                                  for="product-description"
                                  className="form-label"
                                >
                                  Author Description*
                                </label>
                                <MyEditorDashboard
                                  value={authorProfileAuthorDescription}
                                  setValue={setAuthorProfileAuthorDescription}
                                />

                                {/* <!-- end Snow-editor--> */}
                              </div>
                            </div>
                            {/* <!-- end row --> */}
                          </div>
                        </div>
                        {/* <!-- end card --> */}
                      </div>
                      {/* <!-- end col--> */}
                    </div>
                    {/* <!-- end row --> */}

                    <div
                      className="row"
                      style={{
                        marginTop: "160px",
                      }}
                    >
                      <div className="col-lg-12">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="text-uppercase mt-0 mb-3 bg-light p-2">
                              Author Social Media Link
                            </h5>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label for="social-fb" className="form-label">
                                    Facebook
                                  </label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <i className="fab fa-facebook-square"></i>
                                    </span>
                                    <Field
                                      type="text"
                                      className="form-control"
                                      name="facebook"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label for="social-tw" className="form-label">
                                    Twitter
                                  </label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <i className="fab fa-twitter"></i>
                                    </span>
                                    <Field
                                      type="text"
                                      className="form-control"
                                      name="twitter"
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* <!-- end col --> */}
                            </div>
                            {/* <!-- end row --> */}

                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label
                                    for="social-insta"
                                    className="form-label"
                                  >
                                    Instagram
                                  </label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <i className="fab fa-instagram"></i>
                                    </span>
                                    <Field
                                      type="text"
                                      className="form-control"
                                      name="instagram"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label
                                    for="social-lin"
                                    className="form-label"
                                  >
                                    Linkedin
                                  </label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <i className="fab fa-linkedin"></i>
                                    </span>
                                    <Field
                                      type="text"
                                      className="form-control"
                                      name="linkedin"
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* <!-- end col --> */}
                            </div>
                            {/* <!-- end row --> */}

                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label
                                    for="social-sky"
                                    className="form-label"
                                  >
                                    Skype
                                  </label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <i className="fab fa-skype"></i>
                                    </span>
                                    <Field
                                      type="text"
                                      className="form-control"
                                      name="skype"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label for="social-gh" className="form-label">
                                    Youtube
                                  </label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <i className="fab fa-youtube"></i>
                                    </span>
                                    <Field
                                      type="text"
                                      className="form-control"
                                      name="youtube"
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* <!-- end col --> */}
                            </div>
                            {/* <!-- end row --> */}

                            <div className="mb-3">
                              <label className="mb-2">Blog Status</label>
                              <br />
                              <div className="d-flex flex-wrap">
                                <div className="form-check me-2">
                                  <Field
                                    className="form-check-input"
                                    type="radio"
                                    name="radioInline"
                                    value="Online"
                                    checked={values.radioInline === "Online"}
                                  />
                                  <label
                                    className="form-check-label"
                                    for="inlineRadio1"
                                  >
                                    Online
                                  </label>
                                </div>
                                <div className="form-check me-2">
                                  <Field
                                    className="form-check-input"
                                    type="radio"
                                    name="radioInline"
                                    value="Offline"
                                    checked={values.radioInline === "Offline"}
                                  />
                                  <label
                                    className="form-check-label"
                                    for="inlineRadio2"
                                  >
                                    Offline
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <div className="text-center mb-3">
                              <button
                                type="submit"
                                className="btn btn-success waves-effect waves-light me-2"
                                onClick={() => handleSubmitEdit(values, errors)}
                                disabled={isLoadingSubmit}
                              >
                                {isLoadingSubmit ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  "Save"
                                )}
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger waves-effect waves-light me-2"
                                onClick={() => setOpenEdit(false)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                          {/* <!-- end col --> */}
                        </div>

                        {/* <!-- end card --> */}
                      </div>
                      {/* <!-- end col --> */}
                    </div>
                    {/* <!-- end row --> */}
                    <div className="d-none" id="uploadPreviewTemplate">
                      <div className="card mt-1 mb-0 shadow-none border">
                        <div className="p-2">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <img
                                data-dz-thumbnail
                                src="#"
                                className="avatar-sm rounded bg-light"
                                alt=""
                              />
                            </div>
                            <div className="col ps-0">
                              <a
                                href="javascript:void(0);"
                                className="text-muted fw-bold"
                                data-dz-name
                              ></a>
                              <p className="mb-0" data-dz-size></p>
                            </div>
                            <div className="col-auto">
                              {/* <!-- Button --> */}
                              <a
                                href=""
                                className="btn btn-link btn-lg text-muted"
                                data-dz-remove
                              >
                                <i className="dripicons-cross"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </Box>
          </Dialog>

          {/* <!-- Footer Start --> */}
          <footer
            className="footer"
            style={
              collapsed
                ? { left: "50px", transition: "all 0.3s ease", zIndex: "999" }
                : { left: "240px", transition: "all 0.3s ease", zIndex: "999" }
            }
          >
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-6">
                  2024 © All Rights Reserved By Jarvis Reach
                </div>
                <div className="col-md-6">
                  <div className="text-md-end footer-links d-none d-sm-block">
                    <a
                      href={`${
                        import.meta.env.VITE_JARVIS_MARKETING_HELP
                      }/about-us`}
                      target="_blank"
                    >
                      About Us
                    </a>
                    <a
                      href={`${
                        import.meta.env.VITE_JARVIS_MARKETING_HELP
                      }/help-center`}
                      target="_blank"
                    >
                      Help
                    </a>{" "}
                  </div>
                </div>
              </div>
            </div>
          </footer>
          {/* <!-- end Footer --> */}
        </div>
      ) : (
        <div className="content-page">
          <div
            className="content"
            style={{
              marginBottom: "50px",
            }}
          >
            {/* <!-- Start Content--> */}
            <div className="container-fluid">
              {/* <!-- start page title --> */}
              {/* Back Button */}
              <FaArrowLeft
                onClick={() => setOpenAddList(true)}
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  marginTop: "20px",
                }}
              />
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box">
                    <div className="page-title-right">
                      <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item">
                          <a href="javascript: void(0);">Jarvis Reach</a>
                        </li>
                        <li className="breadcrumb-item">
                          <a href="javascript: void(0);">Blog</a>
                        </li>
                        <li className="breadcrumb-item active">Add Blog</li>
                      </ol>
                    </div>
                    <h4 className="page-title">Add Blog</h4>
                  </div>
                </div>
              </div>
              {/* <!-- end page title -->  */}
              <Formik
                initialValues={{
                  blogCategory: blogs?.result[0]?._id || "",
                  blogSlug: "",
                  blogTitle: "",
                  blogDescription: "",
                  metaTitle: "",
                  metaKeywords: "",
                  metaDescription: "",
                  tableOfContents: [
                    {
                      question: "",
                      show: "Show",
                      description: "",
                    },
                  ],
                  authorName: "",
                  authorDescription: "",
                  authorImage: "",
                  authorSocialMedia: "",
                  radioInline: "Online",
                  facebook: "",
                  twitter: "",
                  instagram: "",
                  linkedin: "",
                  skype: "",
                  youtube: "",
                  files: [],
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, isSubmitting, errors, touched }) => (
                  <Form>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="card">
                          <div className="card-body mb-5">
                            <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                              Blog Info
                            </h5>

                            <div className="mb-3">
                              <label
                                htmlFor="blogCategory"
                                className="form-label"
                              >
                                Blog Category*
                              </label>
                              <Field
                                as="select"
                                name="blogCategory"
                                className={`form-control select2 
                                ${
                                  errors.blogCategory &&
                                  touched.blogCategory &&
                                  "is-invalid"
                                }
                                  `}
                              >
                                {blogs?.result?.map((blog) => (
                                  <option value={blog._id} key={blog._id}>
                                    {blog.categoryName}
                                  </option>
                                ))}
                              </Field>
                              {errors.blogCategory && touched.blogCategory && (
                                <div className="invalid-feedback">
                                  {errors.blogCategory}
                                </div>
                              )}
                            </div>

                            <div className="mb-3">
                              <label htmlFor="blogSlug" className="form-label">
                                Blog slug URL*
                              </label>
                              <Field
                                type="text"
                                name="blogSlug"
                                className={`form-control 
                                  ${
                                    errors.blogSlug &&
                                    touched.blogSlug &&
                                    "is-invalid"
                                  }
                                  `}
                              />
                              {errors.blogSlug && touched.blogSlug && (
                                <div className="invalid-feedback">
                                  {errors.blogSlug}
                                </div>
                              )}
                            </div>

                            <div className="mb-3">
                              <label htmlFor="blogTitle" className="form-label">
                                Blog Title*
                              </label>
                              <Field
                                type="text"
                                name="blogTitle"
                                className={`form-control
                                  ${
                                    errors.blogTitle &&
                                    touched.blogTitle &&
                                    "is-invalid"
                                  }
                                  `}
                              />

                              {errors.blogTitle && touched.blogTitle && (
                                <div className="invalid-feedback">
                                  {errors.blogTitle}
                                </div>
                              )}
                            </div>

                            <div
                              className="mb-5"
                              style={{
                                borderRadius: "10px",
                                boxShadow: "none",
                              }}
                            >
                              <label
                                htmlFor="blogDescription"
                                className="form-label"
                              >
                                Blog Description
                              </label>
                              <MyEditorDashboard
                                value={editorValue}
                                setValue={setEditorValue}
                              />
                              {!editorValue
                                ? errors.blogDescription &&
                                  touched.blogDescription && (
                                    <div className="invalid-feedback">
                                      {errors.blogDescription}
                                    </div>
                                  )
                                : null}
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-body">
                            <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                              Website Meta Data*
                            </h5>

                            <div className="mb-3">
                              <label htmlFor="metaTitle" className="form-label">
                                Meta title*
                              </label>
                              <Field
                                type="text"
                                name="metaTitle"
                                className={`form-control
                                  ${
                                    errors.metaTitle &&
                                    touched.metaTitle &&
                                    "is-invalid"
                                  }
                                  `}
                              />
                              {errors.metaTitle && touched.metaTitle && (
                                <div className="invalid-feedback">
                                  {errors.metaTitle}
                                </div>
                              )}
                            </div>

                            <div className="mb-3">
                              <label
                                htmlFor="metaKeywords"
                                className="form-label"
                              >
                                Meta Keywords*
                              </label>
                              <Field
                                type="text"
                                name="metaKeywords"
                                className={`form-control
                                  ${
                                    errors.metaKeywords &&
                                    touched.metaKeywords &&
                                    "is-invalid"
                                  }
                                  `}
                              />
                              {errors.metaKeywords && touched.metaKeywords && (
                                <div className="invalid-feedback">
                                  {errors.metaKeywords}
                                </div>
                              )}
                            </div>

                            <div>
                              <label
                                htmlFor="metaDescription"
                                className="form-label"
                              >
                                Meta Description*
                              </label>
                              <Field
                                as="textarea"
                                name="metaDescription"
                                rows="5"
                                className={`form-control
                                  ${
                                    errors.metaDescription &&
                                    touched.metaDescription &&
                                    "is-invalid"
                                  }
                                  `}
                              />
                              {errors.metaDescription &&
                                touched.metaDescription && (
                                  <div className="invalid-feedback">
                                    {errors.metaDescription}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-body">
                            <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                              Table of Contents
                            </h5>

                            {/* Accordion to dynamically add and edit items */}
                            <FieldArray name="tableOfContents">
                              {({ push, remove, form }) => (
                                <>
                                  {form.values.tableOfContents.map(
                                    (tocItem, index) => (
                                      <Accordion
                                        expanded={expanded === index}
                                        onChange={handleAccordionChange(index)}
                                        key={index}
                                        sx={{
                                          border: "1px solid #f4f4f4",
                                          borderRadius: "10px",
                                          boxShadow: "none",
                                        }}
                                      >
                                        <AccordionSummary
                                          expandIcon={<ExpandMoreIcon />}
                                        >
                                          {index > 0 ? (
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                marginTop: "10px",
                                              }}
                                            >
                                              <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => remove(index)}
                                                style={{}}
                                              >
                                                Remove
                                              </Button>
                                              {"Content " + (index + 1)}
                                            </div>
                                          ) : (
                                            "Content " + (index + 1)
                                          )}
                                        </AccordionSummary>

                                        <AccordionDetails
                                          style={{
                                            marginBottom: "30px",
                                            marginTop: "10px",
                                          }}
                                        >
                                          <div className="mb-3">
                                            <label
                                              htmlFor={`tableOfContents.${index}.question`}
                                              className="form-label"
                                            >
                                              Question
                                            </label>
                                            <Field
                                              name={`tableOfContents.${index}.question`}
                                              className="form-control"
                                              placeholder="Enter question"
                                            />
                                          </div>
                                          <div className="mb-3">
                                            <label
                                              htmlFor={`tableOfContents.${index}.show`}
                                              className="form-label"
                                            >
                                              Show
                                            </label>
                                            <Field
                                              as="select"
                                              name={`tableOfContents.${index}.show`}
                                              className="form-control select2"
                                            >
                                              <option value="Show">Show</option>
                                              <option value="Hide">Hide</option>
                                            </Field>
                                          </div>
                                          <div className="mb-5">
                                            <label
                                              htmlFor={`tableOfContents.${index}.description`}
                                              className="form-label"
                                            >
                                              Description
                                            </label>
                                            <MyEditorDashboard
                                              value={tocItem.description}
                                              setValue={(value) =>
                                                setFieldValue(
                                                  `tableOfContents.${index}.description`,
                                                  value
                                                )
                                              }
                                            />
                                          </div>
                                        </AccordionDetails>
                                      </Accordion>
                                    )
                                  )}
                                  <div className="col-auto mb-4 mt-4 me-3">
                                    <div className="text-lg-end my-lg-0">
                                      <button
                                        type="button"
                                        className="btn btn-success waves-effect waves-light me-1"
                                        onClick={() =>
                                          // remove all except the first one
                                          form.setFieldValue(
                                            "tableOfContents",
                                            [form.values.tableOfContents[0]]
                                          )
                                        }
                                      >
                                        <i className="mdi mdi-cog"></i> Remove
                                        All
                                      </button>
                                      <a
                                        onClick={() => {
                                          push({
                                            question: "",
                                            show: "Show",
                                            description: "",
                                          });
                                          // setExpanded(form.values.tableOfContents.length)
                                        }}
                                        className="btn btn-danger waves-effect waves-light"
                                        style={{ cursor: "pointer" }}
                                      >
                                        <i className="mdi mdi-plus-circle me-1"></i>{" "}
                                        Add More
                                      </a>
                                    </div>
                                  </div>
                                </>
                              )}
                            </FieldArray>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                              Blog Banner Image
                            </h5>
                            Recommended thumbnail size 800x400 (px).
                            {!file && (
                              <div
                                onClick={() =>
                                  document.getElementById("fileInput").click()
                                }
                                className="dropzone dz-message needsclick"
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <input
                                  id="fileInput"
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={handleFileChange}
                                />
                                <i className="h1 text-muted dripicons-cloud-upload"></i>
                                <h3>Drop files here or click to upload.</h3>
                                <span className="text-muted font-13">
                                  (This is just a demo dropzone. Selected files
                                  are <strong>not</strong> actually uploaded.)
                                </span>
                              </div>
                            )}
                            {/* Preview */}
                            <div
                              className="dropzone-previews mt-3"
                              id="file-previews"
                            >
                              {file && (
                                <div style={{ position: "relative" }}>
                                  {/* cross button to remove image */}
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm remove-preview"
                                    onClick={() => setFile(null)}
                                    style={{
                                      position: "absolute",
                                      right: 5,
                                      top: -30,
                                      zIndex: "1000",
                                      padding: "1px 1px 0px 2px",
                                    }}
                                  >
                                    <i className="mdi mdi-close"></i>
                                  </button>

                                  <img
                                    src={URL.createObjectURL(file[0])}
                                    alt="Preview"
                                    style={{
                                      width: "100%",
                                      maxHeight: "300px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="card">
                          <div className="card-body">
                            <h5 className="text-uppercase mt-0 mb-3 bg-light p-2">
                              Blog Thumbnail Image
                            </h5>
                            Recommended thumbnail size 800x400 (px).
                            {!fileThumbnail && (
                              <div
                                onClick={() =>
                                  document
                                    .getElementById("fileInputThumbnail")
                                    .click()
                                }
                                className="dropzone dz-message needsclick"
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <input
                                  id="fileInputThumbnail"
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={handleFileChangeThumnail}
                                />
                                <i className="h1 text-muted dripicons-cloud-upload"></i>
                                <h3>Drop files here or click to upload.</h3>
                                <span className="text-muted font-13">
                                  (This is just a demo dropzone. Selected files
                                  are <strong>not</strong> actually uploaded.)
                                </span>
                              </div>
                            )}
                            {/* <!-- Preview --> */}
                            {fileThumbnail && (
                              <div style={{ position: "relative" }}>
                                {/* cross button to remove image */}
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm remove-preview"
                                  onClick={() => setFileThumbnail(null)}
                                  style={{
                                    position: "absolute",
                                    right: 5,
                                    top: -30,
                                    zIndex: "1000",
                                    padding: "1px 1px 0px 2px",
                                  }}
                                >
                                  <i className="mdi mdi-close"></i>
                                </button>

                                <img
                                  src={URL.createObjectURL(fileThumbnail[0])}
                                  alt="Preview"
                                  style={{
                                    width: "100%",
                                    maxHeight: "300px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="card">
                          <div className="card-body">
                            <h5 className="mb-3 text-uppercase bg-light p-2">
                              <i className="mdi mdi-earth me-1"></i> author
                              Profile{" "}
                            </h5>
                            <div className="row">
                              <div className="">
                                <label
                                  for="product-meta-title"
                                  className="form-label"
                                >
                                  Author Name*
                                </label>
                                <Field
                                  type="text"
                                  name="authorName"
                                  className={`form-control
                                    ${
                                      errors.authorName &&
                                      touched.authorName &&
                                      "is-invalid"
                                    }
                                  `}
                                />
                                {errors.authorName && touched.authorName && (
                                  <div className="invalid-feedback">
                                    {errors.authorName}
                                  </div>
                                )}
                              </div>

                              <div className="card-body">
                                <h5 className="text-uppercase mt-0  bg-light p-2">
                                  Author Image
                                </h5>
                                Recommended thumbnail size 800x400 (px).
                                {!fileAuthor && (
                                  <div
                                    onClick={() =>
                                      document
                                        .getElementById("fileInput1")
                                        .click()
                                    }
                                    className="dropzone dz-message needsclick"
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <input
                                      id="fileInput1"
                                      type="file"
                                      style={{ display: "none" }}
                                      onChange={handleFileChangeAuthor}
                                    />
                                    <i className="h1 text-muted dripicons-cloud-upload"></i>
                                    <h3>Drop files here or click to upload.</h3>
                                    <span className="text-muted font-13">
                                      (This is just a demo dropzone. Selected
                                      files are <strong>not</strong> actually
                                      uploaded.)
                                    </span>
                                  </div>
                                )}
                                {/* <!-- Preview --> */}
                                {fileAuthor && (
                                  <div style={{ position: "relative" }}>
                                    {/* cross button to remove image */}
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm remove-preview"
                                      onClick={() => setFileAuthor(null)}
                                      style={{
                                        position: "absolute",
                                        right: 5,
                                        top: -30,
                                        zIndex: "1000",
                                        padding: "1px 1px 0px 2px",
                                      }}
                                    >
                                      <i className="mdi mdi-close"></i>
                                    </button>

                                    <img
                                      src={URL.createObjectURL(fileAuthor[0])}
                                      alt="Preview"
                                      style={{
                                        width: "100%",
                                        maxHeight: "300px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="mb-5">
                                <label
                                  for="product-description"
                                  className="form-label"
                                >
                                  Author Description
                                </label>
                                <MyEditorDashboard
                                  value={editorValueAuthor}
                                  setValue={setEditorValueAuthor}
                                />

                                {/* <!-- end Snow-editor--> */}
                              </div>
                            </div>
                            {/* <!-- end row --> */}
                          </div>
                        </div>
                        {/* <!-- end card --> */}
                      </div>
                      {/* <!-- end col--> */}
                    </div>
                    {/* <!-- end row --> */}

                    <div className="row">
                      <div className="col-lg-12">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="text-uppercase mt-0 mb-3 bg-light p-2">
                              Author Social Media Link
                            </h5>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label for="social-fb" className="form-label">
                                    Facebook
                                  </label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <i className="fab fa-facebook-square"></i>
                                    </span>
                                    <Field
                                      type="text"
                                      className="form-control"
                                      name="facebook"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label for="social-tw" className="form-label">
                                    Twitter
                                  </label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <i className="fab fa-twitter"></i>
                                    </span>
                                    <Field
                                      type="text"
                                      className="form-control"
                                      name="twitter"
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* <!-- end col --> */}
                            </div>
                            {/* <!-- end row --> */}

                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label
                                    for="social-insta"
                                    className="form-label"
                                  >
                                    Instagram
                                  </label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <i className="fab fa-instagram"></i>
                                    </span>
                                    <Field
                                      type="text"
                                      className="form-control"
                                      name="instagram"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label
                                    for="social-lin"
                                    className="form-label"
                                  >
                                    Linkedin
                                  </label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <i className="fab fa-linkedin"></i>
                                    </span>
                                    <Field
                                      type="text"
                                      className="form-control"
                                      name="linkedin"
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* <!-- end col --> */}
                            </div>
                            {/* <!-- end row --> */}

                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label
                                    for="social-sky"
                                    className="form-label"
                                  >
                                    Skype
                                  </label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <i className="fab fa-skype"></i>
                                    </span>
                                    <Field
                                      type="text"
                                      className="form-control"
                                      name="skype"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label for="social-gh" className="form-label">
                                    Youtube
                                  </label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <i className="fab fa-youtube"></i>
                                    </span>
                                    <Field
                                      type="text"
                                      className="form-control"
                                      name="youtube"
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* <!-- end col --> */}
                            </div>
                            {/* <!-- end row --> */}

                            <div className="mb-3">
                              <label className="mb-2">Blog Status</label>
                              <br />
                              <div className="d-flex flex-wrap">
                                <div className="form-check me-2">
                                  <Field
                                    className="form-check-input"
                                    type="radio"
                                    name="radioInline"
                                    value="option1"
                                    checked
                                  />
                                  <label
                                    className="form-check-label"
                                    for="inlineRadio1"
                                  >
                                    Online
                                  </label>
                                </div>
                                <div className="form-check me-2">
                                  <Field
                                    className="form-check-input"
                                    type="radio"
                                    name="radioInline"
                                    value="option2"
                                  />
                                  <label
                                    className="form-check-label"
                                    for="inlineRadio2"
                                  >
                                    Offline
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <div className="text-center mb-3">
                              <button
                                type="submit"
                                className="btn btn-success waves-effect waves-light"
                                onClick={() => handleSubmit(values, errors)}
                                disabled={isLoadingSubmit}
                              >
                                {isLoadingSubmit ? (
                                  <div
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                  ></div>
                                ) : (
                                  "Save"
                                )}
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger waves-effect waves-light"
                                style={{
                                  marginLeft: "10px",
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                          {/* <!-- end col --> */}
                        </div>

                        {/* <!-- end card --> */}
                      </div>
                      {/* <!-- end col --> */}
                    </div>
                    {/* <!-- end row --> */}
                    <div className="d-none" id="uploadPreviewTemplate">
                      <div className="card mt-1 mb-0 shadow-none border">
                        <div className="p-2">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <img
                                data-dz-thumbnail
                                src="#"
                                className="avatar-sm rounded bg-light"
                                alt=""
                              />
                            </div>
                            <div className="col ps-0">
                              <a
                                href="javascript:void(0);"
                                className="text-muted fw-bold"
                                data-dz-name
                              ></a>
                              <p className="mb-0" data-dz-size></p>
                            </div>
                            <div className="col-auto">
                              {/* <!-- Button --> */}
                              <a
                                href=""
                                className="btn btn-link btn-lg text-muted"
                                data-dz-remove
                              >
                                <i className="dripicons-cross"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>

            {/* <!-- content --> */}

            {/* <!-- Footer Start --> */}
            <footer
              className="footer"
              style={
                collapsed
                  ? { left: "50px", transition: "all 0.3s ease", zIndex: "999" }
                  : {
                      left: "240px",
                      transition: "all 0.3s ease",
                      zIndex: "999",
                    }
              }
            >
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-6">
                    2024 © All Rights Reserved By Jarvis Reach
                  </div>
                  <div className="col-md-6">
                    <div className="text-md-end footer-links d-none d-sm-block">
                      <a
                        href={`${
                          import.meta.env.VITE_JARVIS_MARKETING_HELP
                        }/about-us`}
                        target="_blank"
                      >
                        About Us
                      </a>
                      <a
                        href={`${
                          import.meta.env.VITE_JARVIS_MARKETING_HELP
                        }/help-center`}
                        target="_blank"
                      >
                        Help
                      </a>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </footer>

            {/* <!-- end Footer --> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;

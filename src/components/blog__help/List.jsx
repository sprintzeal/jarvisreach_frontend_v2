import React, { useEffect, useState } from "react";
import MyEditor from "../MyEditor";
import { useNavigate } from "react-router";
import {
  useAddHelpMutation,
  useGetHelpQuery,
  useUploadFileMutation,
} from "../../slices/adminSlice";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { format, set } from "date-fns";
import toast from "react-hot-toast";

const List = ({
  name,
  title,
  list,
  categoryData,
  isGetCategory,
  getHelpSupportSuccess,
  getHelpSupportLoading,
  handleDeleteHelp,
  openDeleteHelp,
  getHelpSupport,
  setOpenDeleteHelp,
  setDeleteHelpId,
  handleRowSelect,
  selectedRows,
  showDeleteButton,
  openDeleteModal,
  setOpenDeleteModal,
  handleDeleteSelected,
  handleSelectAll,
  handleEditClick,
  setEditDialog,
  editDialog,
  formik,
  page,
  setPage,
  limit,
  setLimit,
  itemsPerPageOptions,
  totalItems,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalPages,
  handlePageClick,
  handleNextClick,
  handlePrevClick,
  handleItemsPerPageChange,
  getVisiblePages,
  isSmallScreen,
  collapsed,
  updateHelpLoading,
  deleteHelpLoading,
}) => {
  const [openAddList, setOpenAddList] = useState(true);
  // const [categoryData, setCategoryData]=useState(null);
  const [formValues, setFormValues] = useState({
    category: "",
    status: "Active",
    question: "",
    answer: "",
  });
  const [editorKey, setEditorKey] = useState(0);
  const [AddHelp, { isLoading: AddHelpLoading }] = useAddHelpMutation();
  const [uploadFile] = useUploadFileMutation();

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categoryData.result.find(
      (category) => category._id === selectedCategoryId
    );
    setFormValues({
      ...formValues,
      category: selectedCategory._id
        ? selectedCategory._id
        : categoryData?.result[0]?._id,
    });
  };

  const handleQuestionChange = (e) => {
    setFormValues({
      ...formValues,
      question: e.target.value,
    });
  };

  const handleContentChange = (content) => {
    setFormValues({
      ...formValues,
      answer: content,
    });
  };

  const handleStatusChange = (e) => {
    setFormValues({
      ...formValues,
      status: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formValues.question ||
      !formValues.answer ||
      formValues.answer.replace(/<[^>]*>?/gm, "").trim() === "" ||
      formValues.answer.trim().length === 0
    ) {
      // if formValues.answer includes only spaces or empty
      toast.error(
        `Please fill all the fields: ${
          !formValues.question ? "Question" : "Answer"
        }`
      );
      return;
    }
    try {
      let data = formValues;
      await AddHelp({
        body: {
          ...data,
          category: data.category ? data.category : categoryData.result[0]._id,
        },
      }).unwrap();
      toast.success("Help added successfully");
      setFormValues({
        category: "",
        status: "Active",
        question: "",
        answer: "",
      });
      // Increment the key to reset the editor
      setEditorKey((prevKey) => prevKey + 1);
      setOpenAddList(true);
    } catch (error) {
      console.log("error", error);
      if (
        error.data.message.includes("answer") ||
        error.data.message.includes("Answer")
      ) {
        toast.error(error.data.message);
      } else {
        toast.error("Error creating help");
      }
    }
  };

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
  };

  const handleChange = async (value) => {
    let updatedContent = value;

    // Find all image tags
    const imgTags = value.match(/<img[^>]+>/g);
    if (imgTags) {
      for (const imgTag of imgTags) {
        const srcMatch = imgTag.match(/src="([^"]*)"/);

        if (srcMatch && srcMatch[1].startsWith("data:")) {
          // Only upload if the image src is a data URL (i.e., a newly added image)
          const src = srcMatch[1];
          const formData = new FormData();
          const file = await fetch(src).then((r) => r.blob());
          formData.append("files", file, "image.png");

          // Call the upload API
          const response = await uploadFile({
            folder: "blog",
            file: formData,
          }).unwrap();
          const url = response.files[0].url;

          // Replace the local src with the uploaded URL
          updatedContent = updatedContent.replace(src, url);
        }
      }
    }

    // Update Formik field value with the final content
    formik.setFieldValue("answer", updatedContent);
  };

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
                          <a href="javascript: void(0);">{name}</a>
                        </li>
                        <li className="breadcrumb-item active">Help List</li>
                      </ol>
                    </div>
                    <h4 className="page-title">{list}</h4>
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
                        <div className="col-sm-4"></div>
                        <div className="col-sm-4 d-flex justify-content-end">
                          {showDeleteButton && (
                            <button
                              type="button"
                              className="btn btn-danger waves-effect waves-light"
                              onClick={
                                () => setOpenDeleteModal(true)
                                // handleDeleteSelected
                              } // Handle delete action
                            >
                              <i className="mdi mdi-delete me-1"></i> Delete
                              Selected
                            </button>
                          )}
                        </div>
                        {/* <!-- end col--> */}
                      </div>
                      {!getHelpSupportSuccess ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "20px",
                            backgroundColor: "transparent",
                            // height: "100vh",
                          }}
                        >
                          <CircularProgress
                            style={{ color: "red", fontSize: "100px" }}
                          />
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table
                            className="table table-centered table-nowrap table-striped"
                            id="products-datatable"
                          >
                            <thead
                              style={{
                                backgroundColor: "#f5f6fa",
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
                                      onChange={handleSelectAll}
                                    />
                                    <label
                                      className="form-check-label"
                                      for="customCheck1"
                                    >
                                      &nbsp;
                                    </label>
                                  </div>
                                </th>
                                <th>{title}</th>
                                <th>Create Date</th>
                                <th>Status</th>
                                <th style={{ width: "85px" }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getHelpSupportSuccess &&
                              getHelpSupport &&
                              getHelpSupport?.result
                                ? getHelpSupport?.result?.map(
                                    (helpData, index) => {
                                      // Format the date
                                      const formattedDate = format(
                                        new Date(helpData.createdAt),
                                        "yyyy-MM-dd"
                                      );
                                      return (
                                        <tr key={index}>
                                          <td>
                                            <div className="form-check">
                                              <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="customCheck2"
                                                checked={selectedRows.includes(
                                                  helpData._id
                                                )}
                                                onChange={() => {
                                                  handleRowSelect(helpData._id);
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

                                          <td className="table-user">
                                            <a
                                              href="javascript:void(0);"
                                              className="text-body fw-semibold"
                                            >
                                              {helpData?.question}
                                            </a>
                                          </td>

                                          <td>{formattedDate}</td>
                                          <td>
                                            <span
                                              className="badge "
                                              style={{
                                                color:
                                                  helpData?.status === "Active"
                                                    ? "rgb(26 188 156)"
                                                    : "rgb(241 85 108)",
                                                backgroundColor:
                                                  helpData?.status === "Active"
                                                    ? "rgb(26 188 156 / 25%)"
                                                    : "rgb(241 85 108 / 25%)",
                                              }}
                                            >
                                              {helpData?.status}
                                            </span>
                                          </td>

                                          <td>
                                            <a
                                              href="javascript:void(0);"
                                              className="action-icon"
                                              onClick={() => {
                                                handleEditClick(helpData);
                                              }}
                                            >
                                              {" "}
                                              <i className="mdi mdi-square-edit-outline"></i>
                                            </a>
                                            <a
                                              href="javascript:void(0);"
                                              className="action-icon"
                                              onClick={() => {
                                                setOpenDeleteHelp(true);
                                                setDeleteHelpId(helpData._id);
                                                // console.log(
                                                //   "Helle",
                                                //   openDeleteHelp
                                                // );
                                              }}
                                            >
                                              {" "}
                                              <i className="mdi mdi-delete"></i>
                                            </a>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )
                                : null}
                            </tbody>
                          </table>
                        </div>
                      )}
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
                              {itemsPerPageOptions.map((option) => (
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
          {/* Delete Dialog */}
          <Dialog
            open={openDeleteHelp}
            onClose={() => {
              setOpenDeleteHelp(false);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete Category"}
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
                  Are you sure you want to delete this Question?
                </p>
                <div className="text-end pl-4 mt-2">
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => handleDeleteHelp()}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      setOpenDeleteHelp(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Multiple select Modal for Delete */}
          <Dialog
            open={openDeleteModal}
            onClose={() => {
              setOpenDeleteModal(false);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete Category"}
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
                  Are you sure you want to delete this Questions?
                </p>
                <div className="text-end pl-4 mt-2">
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => handleDeleteSelected()}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      setOpenDeleteModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {/* Edit Category Dialog */}
          <Dialog
            open={editDialog}
            onClose={() => {
              setEditDialog(false);
              setFormValues({
                category: "",
                status: "Active",
                question: "",
                answer: "",
              });
              formik.resetForm();
            }}
          >
            {" "}
            <div
              className="modal-dialog modal-dialog-centered"
              style={{
                width: "500px",
                maxWidth: "100%",
              }}
            >
              <div className="modal-content">
                <div
                  className="modal-header "
                  style={{
                    background: "rgb(243 247 249)",
                    padding: "10px 20px",
                  }}
                >
                  <h4
                    className="modal-title"
                    id="myCenterModalLabel"
                    style={{
                      fontSize: "18px",
                      fontWeight: 500,
                      color: "#343a40",
                    }}
                  >
                    Edit Help
                  </h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-hidden="true"
                    onClick={() => {
                      setEditDialog(false);
                      formik.resetForm();
                    }}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <form onSubmit={formik.handleSubmit}>
                    {/* Question */}
                    <div className="mb-3">
                      <label htmlFor="categoryName" className="form-label">
                        Question
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          formik.touched.question && formik.errors.question
                            ? "is-invalid"
                            : ""
                        }`}
                        id="categoryName"
                        placeholder="Name"
                        {...formik.getFieldProps("question")}
                      />
                      {formik.touched.question && formik.errors.question ? (
                        <div className="invalid-feedback">
                          {formik.errors.question}
                        </div>
                      ) : null}
                    </div>

                    {/* Answer */}
                    <div className="mb-3">
                      <label htmlFor="categoryName" className="form-label">
                        Answer
                      </label>
                      <ReactQuill
                        value={formik.values.answer}
                        onChange={handleChange}
                        modules={modules}
                        className={`${
                          formik.touched.answer && formik.errors.answer
                            ? "is-invalid"
                            : ""
                        }`}
                        id="answer"
                      />

                      {formik.touched.answer && formik.errors.answer ? (
                        <div className="invalid-feedback">
                          {formik.errors.answer}
                        </div>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="select-code-language"
                        className="form-label"
                      >
                        Status
                      </label>
                      <select
                        id="select-code-language"
                        className={`form-control ${
                          formik.touched.status && formik.errors.status
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("status")}
                      >
                        <option value="Active">Active</option>
                        <option value="Deactive">Deactive</option>
                      </select>
                      {formik.touched.status && formik.errors.status ? (
                        <div className="invalid-feedback">
                          {formik.errors.status}
                        </div>
                      ) : null}
                    </div>

                    <div
                      className="text-end"
                      style={{
                        margin: "20px",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                      }}
                    >
                      <button
                        type="submit"
                        className="btn btn-success waves-effect waves-light"
                        disabled={updateHelpLoading}
                      >
                        {updateHelpLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          "Save"
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger waves-effect waves-light"
                        onClick={() => {
                          setEditDialog(false);
                          formik.resetForm();
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
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
                          <a href="javascript: void(0);">Help</a>
                        </li>
                        <li className="breadcrumb-item active">Add Help</li>
                      </ol>
                    </div>
                    <h4 className="page-title">Add Help</h4>
                  </div>
                </div>
              </div>
              {/* <!-- end page title -->  */}

              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <h5
                        className="text-uppercase bg-light mb-4"
                        style={{
                          marginLeft: "-5px",
                        }}
                      >
                        {" "}
                        <span
                          style={{ marginRight: "10px", cursor: "pointer" }}
                          onClick={() => setOpenAddList(true)}
                        >
                          <ArrowBackIcon />
                        </span>{" "}
                        Help
                      </h5>

                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label for="product-category" className="form-label">
                            Support Category
                          </label>
                          <select
                            className="form-control select2"
                            id="product-category"
                            value={formValues.category}
                            onChange={handleCategoryChange}
                            required={true}
                          >
                            {isGetCategory &&
                              categoryData?.result &&
                              categoryData.result.map((category, index) => (
                                <option key={index} value={category._id}>
                                  {category.categoryName}
                                </option>
                              ))}

                            {/* <option value="Contact Management">Contact Management</option>
                                                    <option value="Team">Team</option>
                                                    <option value="Integrations">Integrations</option>
                                                    <option value="Data Sources and Quality">Data Sources and Quality</option>
                                                    <option value="Plans and Pricing">Plans and Pricing</option> */}
                          </select>
                        </div>

                        <div className="mb-3">
                          <label for="product-name" className="form-label">
                            Question
                          </label>
                          <input
                            type="text"
                            id="product-name"
                            className="form-control"
                            placeholder="e.g : Your first contact - Jarvis Reach on LinkedIn"
                            value={formValues.question}
                            onChange={handleQuestionChange}
                            required={true}
                            aria-required="true"
                          />
                        </div>

                        <div className="mb-3">
                          <label
                            for="product-description"
                            className="form-label"
                          >
                            Answer
                          </label>
                          <MyEditor
                            key={editorKey}
                            handleContentChange={handleContentChange}
                          />
                        </div>
                        {/* <button type="submit" className="btn btn-primary">
                          Submit
                        </button> */}
                        <div className="row">
                          {/* <div className="col-3"> */}
                          <div className="mb-3">
                            <label className="mb-1">Status</label>
                            <br />
                            <div className="d-flex flex-wrap">
                              <div className="form-check me-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="radioInline"
                                  value="Active"
                                  id="inlineRadio1"
                                  checked={formValues.status === "Active"}
                                  onChange={handleStatusChange}
                                />
                                <label
                                  className="form-check-label"
                                  for="inlineRadio1"
                                >
                                  Active
                                </label>
                              </div>
                              <div className="form-check me-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="radioInline"
                                  value="Deactive"
                                  id="inlineRadio2"
                                  checked={formValues.status === "Deactive"}
                                  onChange={handleStatusChange}
                                />
                                <label
                                  className="form-check-label"
                                  for="inlineRadio2"
                                >
                                  Disable
                                </label>
                              </div>
                            </div>
                          </div>
                          {/* </div> */}
                          <div className="row">
                            <div className="text-center mb-3 d-flex gap-2">
                              <button
                                type="button"
                                className="btn w-sm btn-dark waves-effect"
                                onClick={() => setOpenAddList(true)}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="btn w-sm btn-blue waves-effect waves-light"
                                disabled={AddHelpLoading}
                              >
                                {AddHelpLoading ? (
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                ) : (
                                  "Save"
                                )}
                              </button>
                            </div>
                          </div>
                          {/* <!-- end col --> */}
                          {/* <div className="col-6">
                          <div className="col-auto">
                            <div className="text-lg-end my-1 my-lg-0">
                              <button
                                type="button"
                                className="btn btn-success waves-effect waves-light me-1"
                              >
                                <i className="mdi mdi-cog"></i>Remove
                              </button>
                              <a
                                href=""
                                className="btn btn-danger waves-effect waves-light"
                              >
                                <i className="mdi mdi-plus-circle me-1"></i> Add
                                More
                              </a>
                            </div>
                          </div>
                        </div> */}
                        </div>
                      </form>
                    </div>
                  </div>
                  {/* <!-- end card --> */}
                </div>
                {/* <!-- end col --> */}
              </div>
              {/* <!-- end row --> */}

              {/* <!-- end row --> */}

              {/* <!-- file preview template --> */}
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
            </div>
            {/* <!-- container --> */}
          </div>
          {/* <!-- content --> */}

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
      )}
    </div>
  );
};

export default List;

import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";

const Category = ({
  name,
  title,
  list,
  formik,
  activeDialog,
  setActiveDialog,
  editDialog,
  setEditDialog,
  handleEditClick,
  handleDeleteCategory,
  openDeletePlan,
  setOpenDeletePlan,
  deletePlanId,
  setDeletePlanId,
  deletePlanLoading,
  selectedRows,
  handleSelectAll,
  handleRowSelect,
  handleDeleteSelected,
  isDeletingCategories,
  showDeleteButton,
  openDeleteModal,
  setOpenDeleteModal,
  collapsed,
  data,
  isSuccess,
  setEditCategory,
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
  deleteHelpCategory,
}) => {
  return (
    <div>
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
                      <li className="breadcrumb-item active">{list}</li>
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
                        <button
                          type="button"
                          className="btn btn-danger waves-effect waves-light"
                          data-bs-toggle="modal"
                          data-bs-target="#custom-modal"
                          onClick={() => {
                            setActiveDialog(true);
                          }}
                        >
                          <i className="mdi mdi-plus-circle me-1"></i> Add New
                        </button>
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
                    <div className="table-responsive">
                      <table
                        className="table table-centered table-nowrap table-striped"
                        id="products-datatable"
                      >
                        <thead>
                          <tr
                            style={{
                              backgroundColor: "#ffff",
                              color: "#495057",
                            }}
                          >
                            <th style={{ width: "20px" }}>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="customCheck1"
                                  onChange={handleSelectAll}
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "-15px",
                                  }}
                                />
                              </div>
                            </th>
                            <th>{title}</th>

                            <th>Status</th>
                            <th>Create Date</th>
                            <th style={{ width: "85px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {!isSuccess ? (
                            <tr>
                              <td
                                colSpan="5"
                                style={{
                                  /* Adjust colSpan based on the number of columns in your table */
                                  textAlign: "center",
                                  verticalAlign: "middle",
                                  padding: "20px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: "20px",
                                    backgroundColor: "transparent",
                                  }}
                                >
                                  <CircularProgress
                                    style={{ color: "red", fontSize: "100px" }}
                                  />
                                </div>
                              </td>
                            </tr>
                          ) : (
                            data &&
                            data?.result?.map((category, index) => {
                              const formattedDate = format(
                                new Date(category?.createdAt),
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
                                          category._id
                                        )}
                                        onChange={() =>
                                          handleRowSelect(category._id)
                                        }
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
                                      {category?.categoryName}
                                    </a>
                                  </td>

                                  <td>
                                    <span
                                      className="badge "
                                      style={{
                                        color:
                                          category?.status === "Active"
                                            ? "rgb(26 188 156)"
                                            : "rgb(241 85 108)",
                                        backgroundColor:
                                          category?.status === "Active"
                                            ? "rgb(26 188 156 / 25%)"
                                            : "rgb(241 85 108 / 25%)",
                                      }}
                                    >
                                      {category?.status}
                                    </span>
                                  </td>
                                  <td>{formattedDate}</td>
                                  <td>
                                    <a
                                      href="javascript:void(0);"
                                      className="action-icon"
                                      onClick={() => handleEditClick(category)}
                                    >
                                      {" "}
                                      <i className="mdi mdi-square-edit-outline"></i>
                                    </a>
                                    <a
                                      href="javascript:void(0);"
                                      className="action-icon"
                                      onClick={() => {
                                        setOpenDeletePlan(true);
                                        setDeletePlanId(category._id);
                                      }}
                                    >
                                      {" "}
                                      <i className="mdi mdi-delete"></i>
                                    </a>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                          {data?.result?.length === 0 && (
                            <tr>
                              <td colSpan="5">
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  No data found
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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
        {/* Add Category Dialog */}
        <Dialog
          open={activeDialog}
          onClose={() => {
            setActiveDialog(false);
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
                  Category
                </h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-hidden="true"
                  onClick={() => {
                    setActiveDialog(false);
                  }}
                ></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="categoryName" className="form-label">
                      Category Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        formik.touched.categoryName &&
                        formik.errors.categoryName
                          ? "is-invalid"
                          : ""
                      }`}
                      id="categoryName"
                      placeholder="Name"
                      {...formik.getFieldProps("categoryName")}
                    />
                    {formik.touched.categoryName &&
                    formik.errors.categoryName ? (
                      <div className="invalid-feedback">
                        {formik.errors.categoryName}
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
                      disabled={formik.isSubmitting}
                    >
                      {formik.isSubmitting ? "Saving" : "Save"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger waves-effect waves-light"
                      onClick={() => {
                        setActiveDialog(false);
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

        {/* Edit Category Dialog */}
        <Dialog
          open={editDialog}
          onClose={() => {
            setEditDialog(false);
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
                  Edit Category
                </h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-hidden="true"
                  onClick={() => {
                    setEditDialog(false);
                  }}
                ></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="categoryName" className="form-label">
                      Category Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        formik.touched.categoryName &&
                        formik.errors.categoryName
                          ? "is-invalid"
                          : ""
                      }`}
                      id="categoryName"
                      placeholder="Name"
                      {...formik.getFieldProps("categoryName")}
                    />
                    {formik.touched.categoryName &&
                    formik.errors.categoryName ? (
                      <div className="invalid-feedback">
                        {formik.errors.categoryName}
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
                      disabled={formik.isSubmitting}
                    >
                      {formik.isSubmitting ? "Saving" : "Save"}
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
        {/* Delete Category Dialog */}
        <Dialog
          open={openDeleteModal}
          onClose={() => {
            setOpenDeleteModal(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Category"}</DialogTitle>
          <DialogContent>
            <div>
              <p
                style={{
                  fontSize: "16px",
                  color: "gray",
                  fontWeight: "500",
                }}
              >
                Are you sure you want to delete this Category?
              </p>
              <div className="text-end pl-4 mt-2">
                <Button
                  variant="text"
                  color="error"
                  onClick={() => handleDeleteSelected()}
                  disabled={selectedRows.length === 0 || isDeletingCategories}
                >
                  {isDeletingCategories ? "Deleting" : "Delete"}
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

        <Dialog
          open={openDeletePlan}
          onClose={() => {
            setOpenDeletePlan(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Category"}</DialogTitle>
          <DialogContent>
            <div>
              <p
                style={{
                  fontSize: "16px",
                  color: "gray",
                  fontWeight: "500",
                }}
              >
                Are you sure you want to delete this Category?
              </p>
              <div className="text-end pl-4 mt-2">
                <Button
                  variant="text"
                  color="error"
                  onClick={() => handleDeleteCategory()}
                  disabled={deleteHelpCategory}
                >
                  Delete
                </Button>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => {
                    setOpenDeletePlan(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
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
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/* <!-- end Footer --> */}
      </div>
    </div>
  );
};

export default Category;

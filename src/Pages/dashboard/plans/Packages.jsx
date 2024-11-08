import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import {
  useCreatePackageMutation,
  useGetAllPlansQuery,
} from "../../../slices/adminSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
  useDeletePlanMutation,
  useUpdatePlanMutation,
} from "../../../slices/customerSlice";

const Packages = ({ collapsed }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [activeDialog, setActiveDialog] = useState(false);
  const [openDeletePlan, setOpenDeletePlan] = useState(false);
  const [deletePlanId, setDeletePlanId] = useState(null);
  const [limit, setLimit] = useState(5);
  const [pages, setPage] = useState(1);
  const [deletePlan, { isLoading: deletePlanLoading }] =
    useDeletePlanMutation();
  const [createPlans, { isLoading: createPlansLoading }] =
    useCreatePackageMutation();

  const [openEditPlan, setOpenEditPlan] = useState(false);
  const [editPlanId, setEditPlanId] = useState(null);
  const [editPlanName, setEditPlanName] = useState(null);
  const [editPlanStatus, setEditPlanStatus] = useState(null);

  const {
    data: getPackages,
    error: getProfilesError,
    isLoading: getProfilesLoading,
  } = useGetAllPlansQuery({
    page: pages,
    limit: limit,
  });

  const itemsPerPageOptions = [5, 10, 20, 50];
  const totalItems = getPackages?.totalRecord || 0;
  const [currentPage, setCurrentPage] = useState(getPackages?.currentPage || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    itemsPerPageOptions[
      itemsPerPageOptions.indexOf(getPackages?.limit) !== -1
        ? itemsPerPageOptions.indexOf(getPackages?.limit)
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

  const formik = useFormik({
    initialValues: {
      name: "",
      status: "Active",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values) => {
      // if name has space at the beginning or end, dont create
      if (values.name.trim() !== values.name) {
        toast.error("Name cannot have space at the beginning or end");
        return;
      }
      try {
        await createPlans({ body: values }).unwrap();
        setActiveDialog(false);
        toast.success("Package created successfully");
      } catch (error) {
        console.error(error);
        toast.error(error.data.message);
      }
    },
  });
  // console.log("getPackages", getPackages);

  const handleDeletePlan = async () => {
    await deletePlan({
      id: deletePlanId,
    })
      .unwrap()
      .then((res) => {
        toast.success("Plan Successfully Deleted");
        setOpenDeletePlan(false);
        setDeletePlanId(null);
      })
      .catch((error) => {
        toast.error(error.data.message);
      });
  };
  const [updatePlan, { isLoading: updatePlanLoading }] =
    useUpdatePlanMutation();
  const handleUpdatePlan = async (e) => {
    e.preventDefault();

    if (
      editPlanId.trim() !== editPlanId ||
      editPlanId.trim() === "" ||
      editPlanName.trim() !== editPlanName ||
      editPlanName.trim() === ""
    ) {
      toast.error("Name cannot be empty or have space at the beginning or end");
      return;
    }

    await updatePlan({
      id: editPlanId,
      body: {
        name: editPlanName,
        status: editPlanStatus,
      },
    })
      .unwrap()
      .then((res) => {
        toast.success("Plan Successfully Updated");
        setOpenEditPlan(false);
        setEditPlanId(null);
        setEditPlanName(null);
        setEditPlanStatus(null);
      })
      .catch((error) => {
        toast.error("Error updating plan");
        setOpenEditPlan(false);
        setEditPlanId(null);
        setEditPlanName(null);
        setEditPlanStatus(null);
      });
  };

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
                        <a href="javascript: void(0);">Plan</a>
                      </li>
                      <li className="breadcrumb-item active">Package</li>
                    </ol>
                  </div>
                  <h4 className="page-title">Package</h4>
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
                      <div className="col-sm-8">
                        {/* </div><!-- end col--> */}
                      </div>
                      <div
                        className="table-responsive"
                        style={{
                          overflowX: "auto",
                          whiteSpace: "nowrap",
                          marginTop: "20px",
                        }}
                      >
                        <table
                          className="table table-centered table-nowrap table-striped"
                          id="products-datatable"
                        >
                          <thead>
                            <tr
                              style={{
                                background: "#fff",
                              }}
                            >
                              <th>Package Name</th>
                              <th>Status</th>
                              <th>Create Date</th>
                              <th style={{ width: "85px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!getProfilesLoading ? (
                              getPackages?.result?.map((plan) => {
                                return (
                                  <tr>
                                    <td className="table-user">
                                      <a
                                        href="javascript:void(0);"
                                        className="text-body fw-semibold"
                                      >
                                        {plan.name}
                                      </a>
                                    </td>
                                    <td>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <span
                                          className="badge "
                                          style={{
                                            backgroundColor:
                                              plan.status === "Deactive" ||
                                              plan.otherPackage?.status ===
                                                "Deactive"
                                                ? "rgb(241 85 108 / 25%)"
                                                : "rgb(26 188 156 / 25%)",
                                            color:
                                              plan.status === "Deactive" ||
                                              plan.otherPackage?.status ===
                                                "Deactive"
                                                ? "rgb(241 85 108)"
                                                : "rgb(26 188 156)",
                                          }}
                                        >
                                          {plan.status === "Deactive"
                                            ? plan.status
                                            : plan.otherPackage?.status ===
                                              "Deactive"
                                            ? plan.otherPackage?.status
                                            : "Active"}
                                        </span>
                                        <p
                                          style={{
                                            fontSize: "12px",
                                            fontWeight: "500",
                                            marginLeft: "4px",
                                          }}
                                        >
                                          {plan.status === "Deactive" &&
                                          plan.otherPackage?.status ===
                                            "Deactive"
                                            ? ""
                                            : plan.status === "Deactive"
                                            ? `(${plan.interval}ly)`
                                            : plan.otherPackage?.status ===
                                              "Deactive"
                                            ? `(${plan.otherPackage.interval}ly)`
                                            : ""}
                                        </p>
                                      </div>
                                    </td>
                                    <td>
                                      {new Date(
                                        plan.createdAt
                                      ).toLocaleDateString({
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </td>
                                    {plan?.name !== "Free" ? (
                                      <td>
                                        <a
                                          href="javascript:void(0);"
                                          className="action-icon"
                                          onClick={() => {
                                            setOpenEditPlan(true);
                                            setEditPlanId(plan._id);
                                            setEditPlanName(plan.name);
                                            setEditPlanStatus(plan.status);
                                          }}
                                        >
                                          {" "}
                                          <i className="mdi mdi-square-edit-outline"></i>
                                        </a>
                                        <a
                                          href="javascript:void(0);"
                                          className="action-icon"
                                          onClick={() => {
                                            setOpenDeletePlan(true);
                                            setDeletePlanId(plan._id);
                                          }}
                                        >
                                          {" "}
                                          <i className="mdi mdi-delete"></i>
                                        </a>
                                      </td>
                                    ) : (
                                      <td></td>
                                    )}{" "}
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>
                                  {/* <div
                                    className="spinner-border"
                                    role="status"
                                  ></div> */}
                                  <CircularProgress />
                                </td>
                              </tr>
                            )}
                            {getPackages?.result?.length === 0 && (
                              <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>
                                  No Data Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div
                        className="pagination-container"
                        style={{
                          maxWidth: "100%",
                          overflowX: "auto",
                          display: "flex",
                          // direction column in small screen
                          flexDirection: isSmallScreen ? "column" : "",
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
                    Package
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
                      <label htmlFor="name" className="form-label">
                        Plan Name
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          formik.touched.name && formik.errors.name
                            ? "is-invalid"
                            : ""
                        }`}
                        id="name"
                        placeholder="Name"
                        {...formik.getFieldProps("name")}
                      />
                      {formik.touched.name && formik.errors.name ? (
                        <div className="invalid-feedback">
                          {formik.errors.name}
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
                        disabled={createPlansLoading}
                      >
                        {createPlansLoading ? "Saving" : "Save"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger waves-effect waves-light"
                        onClick={() => {
                          setActiveDialog(false);
                        }}
                      >
                        cancel
                      </button>
                    </div>
                  </form>{" "}
                </div>
              </div>
            </div>
          </Dialog>
          {/* <!-- content --> */}
          <Dialog
            open={openDeletePlan}
            onClose={() => {
              setOpenDeletePlan(false);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Delete Plan"}</DialogTitle>
            <DialogContent>
              <div>
                <p
                  style={{
                    fontSize: "16px",
                    color: "gray",
                    fontWeight: "500",
                  }}
                >
                  Are you sure you want to delete this Plan?
                </p>
                <div className="text-end pl-4 mt-2">
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => handleDeletePlan()}
                    disabled={deletePlanLoading}
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
          <Dialog
            open={openEditPlan}
            onClose={() => {
              setOpenEditPlan(false);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
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
                Edit Plan
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-hidden="true"
                onClick={() => {
                  setOpenEditPlan(false);
                }}
              ></button>
            </div>
            {/* <DialogTitle id="alert-dialog-title">{"Edit Plan"}</DialogTitle> */}
            <DialogContent>
              <div>
                <div
                  className="modal-dialog modal-dialog-centered"
                  style={{
                    width: "500px",
                    maxWidth: "100%",
                  }}
                >
                  <div className="modal-content">
                    <div className="modal-body p-4">
                      <form>
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            Plan Name
                          </label>
                          <input
                            type="text"
                            className={`form-control`}
                            id="name"
                            placeholder="Name"
                            value={editPlanName}
                            onChange={(e) => setEditPlanName(e.target.value)}
                          />
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
                            className={`form-control`}
                            value={editPlanStatus}
                            onChange={(e) => setEditPlanStatus(e.target.value)}
                          >
                            <option value="Active">Active</option>
                            <option value="Deactive">Deactive</option>
                          </select>
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
                            onClick={(e) => handleUpdatePlan(e)}
                            disabled={updatePlanLoading}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger waves-effect waves-light"
                            onClick={() => {
                              setOpenEditPlan(false);
                            }}
                          >
                            cancel
                          </button>
                        </div>
                      </form>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* <!-- Footer Start --> */}
          {/* <!-- end Footer --> */}
        </div>
      </div>
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
    </div>
  );
};
export default Packages;

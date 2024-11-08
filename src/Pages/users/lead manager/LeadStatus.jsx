import React, { useState } from "react";
import {
  useCreateLeadManagerStatusMutation,
  useDeleteLeadManagerStatusMutation,
  useGetLeadManagerStatusesQuery,
  useUpdateLeadManagerStatusMutation,
} from "../../../slices/customerSlice";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SketchPicker } from "react-color";
import { useSelector } from "react-redux";
import Restrict from "../../../components/Restrict";

const LeadStatus = ({ collapsed }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { userData } = useSelector((state) => state.userData);
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("#4fc6e1");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [openAddStatus, setOpenAddStatus] = useState(false);
  const [leadIds, setLeadIds] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const handleClickOpen = (id) => {
    setOpen(true);
    setLeadIds(id);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedItems([]);
    setLeadIds([]);
  };

  const {
    data: leadStatus,
    isLoading: leadStatusLoading,
    error: leadStatusError,
  } = useGetLeadManagerStatusesQuery({
    page: page,
    limit: limit,
  });

  const handleAddStatus = () => {
    if (
      leadStatus?.userTotalActiveStatuses >=
        userData?.plan?.planFeatures.activeLeadStatusLimit &&
      userData?.plan?.planFeatures.activeLeadStatusLimit !== -1
    ) {
      setUpgradeDialogOpen(true);
    } else {
      setOpenAddStatus(true);
    }
  };
  const handleCloseAddStatus = () => {
    setOpenAddStatus(false);
  };

  const [leadStatusId, setLeadStatusId] = useState("");
  const [leadStatusName, setLeadStatusName] = useState("");
  const [leadStatusColor, setLeadStatusColor] = useState("");
  const [leadStatusStatus, setLeadStatusStatus] = useState("");
  const [openEditStatus, setOpenEditStatus] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const handleUpgradeDialogClose = () => {
    setUpgradeDialogOpen(false);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;

    // If trying to set status to Active
    if (
      value === "Active" &&
      leadStatus?.userTotalActiveStatuses >=
        userData?.plan?.planFeatures.activeLeadStatusLimit &&
      userData?.plan?.planFeatures.activeLeadStatusLimit !== -1
    ) {
      setUpgradeDialogOpen(true);
    } else {
      setLeadStatusStatus(value);
      formikUpdate.setFieldValue("status", value);
    }
  };

  const handleCloseEditStatus = () => {
    setOpenEditStatus(false);
    setLeadStatusId("");
    setLeadStatusName("");
    setLeadStatusColor("");
    setLeadStatusStatus("");
  };

  const itemsPerPageOptions = [5, 10, 20, 50];
  const totalItems = leadStatus?.totalItems || 0;
  const [currentPage, setCurrentPage] = useState(leadStatus?.page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    itemsPerPageOptions[
      itemsPerPageOptions.indexOf(leadStatus?.limit) !== -1
        ? itemsPerPageOptions.indexOf(leadStatus?.limit)
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
  // console.log(leadStatus);
  const [updateLeadStatus] = useUpdateLeadManagerStatusMutation();
  const [createLeadStatus] = useCreateLeadManagerStatusMutation();
  const [deleteLeadStatus] = useDeleteLeadManagerStatusMutation();

  const handleDelete = async () => {
    try {
      await deleteLeadStatus({
        body: {
          ids: selectedItems.length > 0 ? selectedItems : [leadIds],
        },
      }).unwrap();
      toast.success("Lead Status deleted successfully");
      handleClose();
      setSelectedItems([]);
      setLeadIds([]);
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const handleEditStatus = (status) => {
    setLeadStatusId(status._id);
    setLeadStatusName(status.name);
    setLeadStatusColor(status.color);
    setLeadStatusStatus(status.status);
    setOpenEditStatus(true);
    formikUpdate.setFieldValue("name", status.name);
    formikUpdate.setFieldValue("color", status.color);
    formikUpdate.setFieldValue("status", status.status);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      color: color,
      status: "Active",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required")
        .test("unique", "Name already exists", (value) => {
          return (
            !leadStatus?.result?.some(
              (status) => status.name.toLowerCase() === value.toLowerCase()
            ) || leadStatus?.result?.length === 0
          );
        }),
      color: Yup.string().required("Color is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values) => {
      try {
        await createLeadStatus({
          body: values,
        }).unwrap();
        toast.success("Lead Status created successfully");
        formik.resetForm();
        handleCloseAddStatus();
      } catch (error) {
        toast.error(error.data.message);
      }
    },
  });

  const formikUpdate = useFormik({
    initialValues: {
      name: leadStatusName,
      color: leadStatusColor,
      status: leadStatusStatus,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      color: Yup.string().required("Color is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values) => {
      try {
        await updateLeadStatus({
          id: leadStatusId,
          body: {
            name: leadStatusName,
            color: leadStatusColor,
            status: leadStatusStatus,
          },
        }).unwrap();

        toast.success("Lead Status updated successfully");
        formik.resetForm();
        handleCloseEditStatus();
      } catch (error) {
        toast.error(error.data.message);
      }
    },
  });

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
    formik.setFieldValue("color", newColor.hex);
    setShowColorPicker(false);
    setLeadStatusColor(newColor.hex);
    formikUpdate.setFieldValue("color", newColor.hex);
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
                        <a href="javascript: void(0);">Lead</a>
                      </li>
                      <li className="breadcrumb-item active">Lead Status</li>
                    </ol>
                  </div>
                  <h4 className="page-title">Lead Status</h4>
                </div>
              </div>
            </div>
            {/* <!-- end page title -->  */}

            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div
                      className="row mb-2
                      justify-content-between 
                      gap-2
                    "
                    >
                      <div className="col-sm-4">
                        <button
                          type="button"
                          className="btn btn-danger waves-effect waves-light"
                          data-bs-toggle="modal"
                          data-bs-target="#custom-modal"
                          onClick={handleAddStatus}
                        >
                          <i className="mdi mdi-plus-circle me-1"></i> Add New
                        </button>
                      </div>

                      <div className="col-sm-2 ">
                        {" "}
                        <div>
                          {selectedItems.length > 0 && (
                            <div>
                              <div className="">
                                <button
                                  type="button"
                                  className="btn btn-danger waves-effect waves-light"
                                  onClick={handleClickOpen}
                                  style={{
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <i className="mdi mdi-delete me-1"></i> Delete
                                </button>
                              </div>
                              {/* <!-- end col--> */}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* <!-- end col--> */}
                    </div>
                    {/* <!-- end row--> */}
                    <div className="table-responsive">
                      <table
                        className="table table-centered table-nowrap table-striped"
                        id="products-datatable"
                      >
                        <thead
                          style={{
                            backgroundColor: "#f5f6fa",
                            color: "#495057",
                          }}
                        >
                          <tr>
                            <th style={{ width: "20px" }}>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="customCheck1"
                                  checked={
                                    selectedItems.length !== 0 &&
                                    selectedItems.length ===
                                      leadStatus?.result?.length
                                  }
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedItems(
                                        leadStatus?.result?.map(
                                          (status) => status._id
                                        )
                                      );
                                    } else {
                                      setSelectedItems([]);
                                    }
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "-15px",
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
                            <th>Lead Status</th>
                            <th>Create Date</th>
                            <th>Status</th>
                            <th style={{ width: "85px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leadStatus?.result?.length > 0 &&
                            leadStatus?.result?.map((status) => (
                              <tr>
                                <td>
                                  <div className="form-check">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="customCheck2"
                                      checked={selectedItems.includes(
                                        status._id
                                      )}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedItems([
                                            ...selectedItems,
                                            status._id,
                                          ]);
                                        } else {
                                          setSelectedItems(
                                            selectedItems.filter(
                                              (id) => id !== status._id
                                            )
                                          );
                                        }
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
                                    {status.name}
                                  </a>
                                </td>
                                <td>
                                  {status.createdAt
                                    ? new Date(
                                        status.createdAt
                                      ).toLocaleDateString()
                                    : new Date().toLocaleDateString()}
                                </td>
                                <td>
                                  <span
                                    className="badge"
                                    style={{
                                      backgroundColor:
                                        status.status === "Active"
                                          ? "#34c38f"
                                          : "#f46a6a",
                                      color:
                                        status.status === "Active"
                                          ? "white"
                                          : "white",
                                    }}
                                  >
                                    {status.status}
                                  </span>
                                </td>

                                <td>
                                  <a
                                    href="javascript:void(0);"
                                    className="action-icon"
                                    onClick={() => handleEditStatus(status)}
                                  >
                                    {" "}
                                    <i className="mdi mdi-square-edit-outline"></i>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="action-icon"
                                    onClick={() => handleClickOpen(status._id)}
                                  >
                                    {" "}
                                    <i className="mdi mdi-delete"></i>
                                  </a>
                                </td>
                              </tr>
                            ))}
                          {leadStatus?.result?.length === 0 && (
                            <tr>
                              <td colSpan="5" className="text-center">
                                No data available
                              </td>
                            </tr>
                          )}
                          {leadStatusLoading && (
                            <tr>
                              <td colSpan="5" className="text-center">
                                <CircularProgress />
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
        {/* <!-- content --> */}

        {/* Delete Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete Lead Status"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this lead status?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} color="error" autoFocus>
              Delete
            </Button>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Status Dialog */}
        <Dialog
          open={openAddStatus}
          onClose={handleCloseAddStatus}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div
            className="modal-content"
            style={{
              width: isSmallScreen ? "400px" : "500px",
              maxWidth: "500px",
              minWidth: "300px",
            }}
          >
            <div
              className="modal-header px-4 py-2"
              style={{
                backgroundColor: "rgb(243 247 249)",
              }}
            >
              <h4
                className="modal-title"
                style={{
                  fontWeight: "600",
                }}
              >
                Create Lead Status
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-hidden="true"
                onClick={handleCloseAddStatus}
              ></button>
            </div>
            <div className="modal-body p-4">
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <TextField
                    id="name"
                    name="name"
                    variant="outlined"
                    fullWidth
                    {...formik.getFieldProps("name")}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    sx={{
                      "& .MuiFormHelperText-root": {
                        color: "red",
                        fontSize: "10px",
                      },
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="color" className="form-label">
                    Color
                  </label>
                  <TextField
                    id="color"
                    name="color"
                    variant="outlined"
                    fullWidth
                    value={formik.values.color}
                    onClick={() => setShowColorPicker(true)}
                    InputProps={{
                      readOnly: true,
                    }}
                    error={formik.touched.color && Boolean(formik.errors.color)}
                    helperText={formik.touched.color && formik.errors.color}
                    sx={{
                      "& .MuiFormHelperText-root": {
                        color: "red",
                        fontSize: "10px",
                      },
                      "& .MuiInputBase-root": {
                        cursor: "pointer",
                      },
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "20%",
                      zIndex: 10,
                      display: showColorPicker ? "block" : "none",
                    }}
                  >
                    {showColorPicker && (
                      <SketchPicker
                        color={color}
                        onChangeComplete={handleColorChange}
                        disableAlpha
                      />
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <TextField
                    name="status"
                    select
                    variant="outlined"
                    fullWidth
                    {...formik.getFieldProps("status")}
                    error={
                      formik.touched.status && Boolean(formik.errors.status)
                    }
                    helperText={formik.touched.status && formik.errors.status}
                    SelectProps={{
                      displayEmpty: true,
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 300, // Set a max height if needed
                          },
                        },
                      },
                    }}
                    sx={{
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "left !important",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        padding: "8px 15px",
                        width: "100%",
                        cursor: "pointer",
                      },
                      "& .MuiInputBase-root": {
                        width: "100%",
                        padding: "8px",
                        minWidth: 0, // Ensure it doesn’t overflow or truncate
                        textAlign: "left",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "left",
                      },
                    }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Deactive">Deactive</MenuItem>
                  </TextField>
                </div>

                <div className="text-end">
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
                    style={{ marginLeft: "8px" }}
                    onClick={handleCloseAddStatus}
                  >
                    Cancel
                  </button>
                </div>
              </form>{" "}
            </div>
          </div>
          {/* <!-- /.modal-content --> */}
        </Dialog>
        <Dialog
          open={openEditStatus}
          onClose={handleCloseEditStatus}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div
            className="modal-content"
            style={{
              width: isSmallScreen ? "400px" : "500px",
              maxWidth: "500px",
              minWidth: "300px",
            }}
          >
            <div
              className="modal-header px-4 py-2"
              style={{
                backgroundColor: "rgb(243 247 249)",
              }}
            >
              <h4
                className="modal-title"
                style={{
                  fontWeight: "600",
                }}
              >
                Update Lead Status
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-hidden="true"
                onClick={handleCloseEditStatus}
              ></button>
            </div>
            <div className="modal-body p-4">
              <form onSubmit={formikUpdate.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <TextField
                    id="name"
                    name="name"
                    variant="outlined"
                    value={leadStatusName}
                    fullWidth
                    onChange={(e) => {
                      setLeadStatusName(e.target.value);
                      formikUpdate.setFieldValue("name", e.target.value);
                    }}
                    error={
                      formikUpdate.touched.name &&
                      Boolean(formikUpdate.errors.name)
                    }
                    helperText={
                      formikUpdate.touched.name && formikUpdate.errors.name
                    }
                    sx={{
                      "& .MuiFormHelperText-root": {
                        color: "red",
                        fontSize: "10px",
                      },
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="color" className="form-label">
                    Color
                  </label>
                  <TextField
                    id="color"
                    name="color"
                    variant="outlined"
                    fullWidth
                    value={leadStatusColor}
                    onClick={() => setShowColorPicker(true)}
                    InputProps={{
                      readOnly: true,
                    }}
                    error={
                      formikUpdate.touched.color &&
                      Boolean(formikUpdate.errors.color)
                    }
                    helperText={
                      formikUpdate.touched.color && formikUpdate.errors.color
                    }
                    sx={{
                      "& .MuiFormHelperText-root": {
                        color: "red",
                        fontSize: "10px",
                      },
                      "& .MuiInputBase-root": {
                        cursor: "pointer",
                      },
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "20%",
                      zIndex: 10,
                      display: showColorPicker ? "block" : "none",
                    }}
                  >
                    {showColorPicker && (
                      <SketchPicker
                        color={leadStatusColor}
                        onChangeComplete={handleColorChange}
                        disableAlpha
                      />
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <TextField
                    name="status"
                    select
                    variant="outlined"
                    fullWidth
                    value={leadStatusStatus}
                    onChange={handleStatusChange} // Handle status change here
                    error={
                      formikUpdate.touched.status &&
                      Boolean(formikUpdate.errors.status)
                    }
                    helperText={
                      formikUpdate.touched.status && formikUpdate.errors.status
                    }
                    SelectProps={{
                      displayEmpty: true,
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 300, // Set a max height if needed
                          },
                        },
                      },
                    }}
                    sx={{
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "left !important",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        padding: "8px 14px",
                        width: "100%",
                        cursor: "pointer",
                      },
                      "& .MuiInputBase-root": {
                        width: "100%",
                        padding: "8px",
                        minWidth: 0, // Ensure it doesn’t overflow or truncate
                        textAlign: "left",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "left",
                      },
                    }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Deactive">Deactive</MenuItem>
                  </TextField>
                </div>

                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-success waves-effect waves-light"
                    disabled={formikUpdate.isSubmitting}
                  >
                    {formikUpdate.isSubmitting ? "Saving" : "Save"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger waves-effect waves-light"
                    style={{ marginLeft: "8px" }}
                    onClick={handleCloseEditStatus}
                  >
                    Cancel
                  </button>
                </div>
              </form>{" "}
            </div>
          </div>
          {/* <!-- /.modal-content --> */}
        </Dialog>
        <Dialog open={upgradeDialogOpen} onClose={handleUpgradeDialogClose}>
          {/* cross button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "10px",
            }}
          >
            <button
              onClick={handleUpgradeDialogClose}
              style={{
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              <i className="mdi mdi-close"></i>
            </button>
          </div>
          <Restrict
            width={isSmallScreen ? "100%" : "500px"}
            height={isSmallScreen ? "100%" : "200px"}
            color={"black"}
            title={"You have reached the total limit of active lead statuses,"}
            setRestricts={setUpgradeDialogOpen}
          />
        </Dialog>
        {/* <!-- Footer Start --> */}
        <footer
          className="footer"
          style={
            collapsed
              ? { left: "50px", transition: "all 0.3s ease", zIndex: "999" }
              : { left: "250px", transition: "all 0.3s ease", zIndex: "999" }
          }
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <script>document.write(new Date().getFullYear())</script> &copy;
                Javirs Reach by <a href="">Sprint</a>
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
  );
};

export default LeadStatus;

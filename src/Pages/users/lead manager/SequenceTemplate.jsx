import React, { useEffect, useState } from "react";
import MyEditor from "../../../components/MyEditor";
import MyEditorDashboard from "../../../components/MyEditorDashboard";
import { FaArrowLeft } from "react-icons/fa6";
import { Formik, Field, FieldArray, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  useCreateSequenceTemplateMutation,
  useDeleteSequenceTemplateMutation,
  useGetSequenceTemplatesQuery,
  useUpdateSequenceTemplateMutation,
} from "../../../slices/customerSlice";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
} from "@mui/material";
import toast from "react-hot-toast";
import { Box } from "@mui/system";
import { Error } from "@mui/icons-material";
import Restrict from "../../../components/Restrict";
import { useSelector } from "react-redux";
const validationSchema = Yup.object({
  name: Yup.string().required("Template name is required"),
  subject: Yup.string().required("Template subject is required"),
  followUps: Yup.array().of(
    Yup.object({
      templateContent: Yup.string().required("Content is required"),
      daysUntilNext: Yup.number().optional(),
    })
  ),
});

const SequenceTemplate = ({ collapsed }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { userData } = useSelector((state) => state.userData);
  const [search, setSearch] = useState("");
  const [sequenceAdd, setSequenceAdd] = useState(false);
  const [limit, setLimit] = useState(5);
  const [pages, setPage] = useState(1);
  const [fieldValue, setFieldValue] = useState();
  const [templateId, setTemplateId] = useState();
  const [editField, setEditField] = useState();
  const [expanded, setExpanded] = useState("panel0");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteSequence, setOpenDeleteSequence] = useState(false);
  const [openEditSequence, setOpenEditSequence] = useState(false);
  const [editSequenceId, setEditSequenceId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [createSequenceTemplate, { isLoading: createSequenceTemplateLoading }] =
    useCreateSequenceTemplateMutation();
  const [deleteSequenceId, setDeleteSequenceId] = useState(null);
  const [loadingTemplateId, setLoadingTemplateId] = useState(null);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [deleteSequenceTemplate, { isLoading: deleteTemplateLoading }] =
    useDeleteSequenceTemplateMutation();
  const {
    data: templateData,
    isLoading: templateLoading,
    error: templateError,
  } = useGetSequenceTemplatesQuery({
    page: pages,
    limit: limit,
    search: search,
  });
  const [realTimeChangeToggle, setRealTimeChangeToggle] = useState({});

  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const handleUpgradeDialogClose = () => {
    setUpgradeDialogOpen(false);
  };

  const itemsPerPageOptions = [5, 10, 20, 50];
  const totalItems = templateData?.totalItems ? templateData.totalItems : 0;
  const [currentPage, setCurrentPage] = useState(templateData?.page || 3);
  const [itemsPerPage, setItemsPerPage] = useState(
    itemsPerPageOptions[
      itemsPerPageOptions.indexOf(templateData?.limit) !== -1
        ? itemsPerPageOptions.indexOf(templateData?.limit)
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

  const handleSubmit = async (values, errors) => {
    if (
      values.followUps.length > 0 &&
      !values.followUps
        .slice(0, values.followUps.length - 1)
        .every((followUp) => followUp.daysUntilNext) &&
      values.followUps.some((followUp) => followUp.daysUntilNext)
    ) {
      toast.error(
        "All follow-ups, except the last one, should have `Reminder Interval Day` value"
      );
      return;
    }
    if (values.followUps.length > 0) {
      let emptyTag;
      values.followUps.filter((followUp) => {
        emptyTag = followUp.templateContent.replace(/<[^>]*>/g, "").trim();
      });
      if (emptyTag === "") {
        toast.error("Content is required");
        return;
      }
    }

    const trimmedName = values.name.trim();
    const trimmedSubject = values.subject.trim();

    const followUpsData = values.followUps
      .filter((followUp) => {
        const trimmedContent = followUp.templateContent.trim();

        return trimmedContent !== "";
      })
      .map((followUp) => {
        let content = followUp.templateContent;
        return {
          templateContent: content,
          daysUntilNext: followUp.daysUntilNext,
        };
      });

    // Prevent submission if name or subject are just spaces
    if (trimmedName === "") {
      toast.error("Name cannot contain only spaces");
      return;
    }

    if (trimmedSubject === "") {
      toast.error("Subject cannot contain only spaces");
      return;
    }

    // Prevent submission if any follow-up's templateContent or daysUntilNext are only spaces
    if (followUpsData.length === 0) {
      toast.error(
        "Follow-up Content and DaysUntilNext cannot contain only spaces or empty"
      );
      return;
    }

    try {
      const finalData = {
        name: trimmedName, // Use the trimmed name
        subject: trimmedSubject, // Use the trimmed subject
        followUps: followUpsData, // Use the filtered follow-ups
      };

      const res = await createSequenceTemplate({
        body: finalData,
      }).unwrap();

      toast.success(res.message);
      setSequenceAdd(false);
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const handleDeleteSequence = async () => {
    try {
      await deleteSequenceTemplate({
        body: {
          ids: deleteSequenceId ? deleteSequenceId : selectedRows,
        },
      }).unwrap();
      toast.success("Template Deleted Successfully");
      setOpenDeleteSequence(false);
      setDeleteSequenceId(null);
      setSelectedRows([]);
      setDeleteSequenceId(null);
    } catch (error) {
      toast.error("Error Deleting Sequence");
    }
  };

  const handleEdit = (template) => {
    setEditField({ name: template.name, enabled: template.enabled });
    setFieldValue({
      followUps: template.followUps.map((followUp) => ({
        templateContent: followUp.templateContent,
        daysUntilNext: followUp.daysUntilNext,
      })),
    });
    // console.log("template", fieldValue);
    setTemplateId(template._id);
  };

  const [updateSequenceTemplate, { isLoading: updateSequenceLoading }] =
    useUpdateSequenceTemplateMutation();

  const handleEditSequence = async (values) => {
    try {
      if (
        values.followUps.length > 0 &&
        !values.followUps
          .slice(0, values.followUps.length - 1)
          .every((followUp) => followUp.daysUntilNext) &&
        values.followUps.some((followUp) => followUp.daysUntilNext)
      ) {
        toast.error(
          "All follow-ups, except the last one, should have `Reminder Interval Day` value"
        );
        return;
      }
      if (values.followUps.length > 0) {
        let emptyTag;
        values.followUps.filter((followUp) => {
          emptyTag = followUp.templateContent.replace(/<[^>]*>/g, "").trim();
        });
        if (emptyTag === "") {
          toast.error("Content is required");
          return;
        }
      }
      const trimmedName = editField?.name.trim();

      const followUpsData = values.followUps
        .filter((followUp) => {
          const trimmedContent = followUp.templateContent.trim();

          return trimmedContent !== "";
        })
        .map((followUp) => {
          let content = followUp.templateContent;
          return {
            templateContent: content,
            daysUntilNext: followUp.daysUntilNext,
          };
        });

      if (trimmedName === "") {
        toast.error("Name cannot contain only spaces or empty");
        return;
      }

      if (followUpsData.length === 0) {
        toast.error(
          "Follow-up Content and DaysUntilNext cannot contain only spaces or empty"
        );
        return;
      }

      const finalData = {
        updates: {
          name: trimmedName,
          enabled: editField?.enabled,
          noOfFollowUps: values.followUps.length,
          followUps: followUpsData,
        },
      };

      await updateSequenceTemplate({
        id: templateId,
        body: finalData,
      }).unwrap();

      toast.success("Template Updated Successfully");
      setOpenEditSequence(false);
      setEditSequenceId(null);
    } catch (error) {
      console.log("error", error);
      toast.error("Error Updating Template");
    }
  };
  const handleSwitchChange = async (e, template) => {
    if (updateSequenceLoading) return;

    const checked = e.target.checked;

    // Immediately update the toggle state locally
    setRealTimeChangeToggle((prev) => ({
      ...prev,
      [template._id]: {
        id: template._id,
        checked: checked ? true : false,
      },
    }));

    // Check if user limit is exceeded for enabling templates
    if (
      checked &&
      (userData?.userActiveTemplates ===
        userData?.plan?.planFeatures?.activeSequencesLimit ||
        userData?.userActiveTemplates >
          userData?.plan?.planFeatures?.activeSequencesLimit) &&
      userData?.plan?.planFeatures?.activeSequencesLimit !== -1
    ) {
      // Revert the toggle state since the limit is exceeded
      setRealTimeChangeToggle((prev) => ({
        ...prev,
        [template._id]: {
          id: template._id,
          checked: !checked, // revert change
        },
      }));
      setUpgradeDialogOpen(true);
      return;
    }

    setLoadingTemplateId(template._id);

    try {
      // Update the template via the API
      await updateSequenceTemplate({
        id: template._id,
        body: {
          updates: {
            enabled: checked, // use the actual checked value
          },
        },
      }).unwrap();

      toast.success("Template FollowUp Updated Successfully");
    } catch (err) {
      // On error, revert the toggle state back to its previous value
      toast.error(err.data.message || "An error occurred");

      setRealTimeChangeToggle((prev) => ({
        ...prev,
        [template._id]: {
          id: template._id,
          checked: !checked, // revert change
        },
      }));
    } finally {
      setLoadingTemplateId(null);
    }
  };

  useEffect(() => {
    if (templateData?.result) {
      const toggleObject = templateData.result.reduce((acc, template) => {
        acc[template._id] = { checked: template?.enabled };
        return acc;
      }, {});
      setRealTimeChangeToggle(toggleObject);
    }
  }, [templateData]);

  return (
    <div id="wrapper">
      {!sequenceAdd ? (
        <div
          className="content-page"
          style={{
            width: collapsed ? "95vw" : "81vw",
            transition: "0.5s ease",
          }}
        >
          {/* {
             updateSequenceLoading && (
              <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </div>
            )
          } */}
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
                          <a href="javascript: void(0);">Sequence</a>
                        </li>
                        <li className="breadcrumb-item active">
                          Sequence Templates
                        </li>
                      </ol>
                    </div>
                    <h4 className="page-title">Sequence Templates</h4>
                  </div>
                </div>
              </div>
              {/* <!-- end page title -->    */}
              {/* <!-- end page title -->  */}
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="row justify-content-between">
                        <div className="col-sm-4">
                          <form className="d-flex flex-wrap align-items-center">
                            <label
                              for="inputPassword2"
                              className="visually-hidden"
                            >
                              Search
                            </label>
                            <div className="me-3">
                              <input
                                type="search"
                                className="form-control my-1 my-lg-0"
                                id="inputPassword2"
                                placeholder="Search Name"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                              />
                            </div>
                          </form>
                        </div>
                        <div className="col-auto">
                          <div className="text-lg-end my-1 my-lg-0">
                            <a
                              className="btn btn-danger waves-effect waves-light"
                              onClick={() => setSequenceAdd(true)}
                            >
                              <i className="mdi mdi-plus-circle me-1"></i> Add
                              New
                            </a>
                          </div>
                        </div>
                        {/* <!-- end col--> */}
                      </div>
                      {/* <!-- end row --> */}
                    </div>
                  </div>
                  {/* <!-- end card --> */}
                </div>
                {/* <!-- end col--> */}
              </div>
              {/* <!-- end row--> */}

              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive">
                        {selectedRows.length !== 0 && (
                          <div className="mb-3">
                            <div
                              className="d-flex gap-2"
                              style={{ justifyContent: "flex-end" }}
                            >
                              <button
                                className="btn btn-danger waves-effect waves-light"
                                onClick={() => {
                                  setOpenDeleteSequence(true);
                                }}
                              >
                                Delete Selected Templates
                              </button>
                            </div>
                          </div>
                        )}
                        <table className="table table-centered table-nowrap mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>
                                <div
                                  className="form-check "
                                  style={{ marginLeft: "8px" }}
                                >
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="customCheck1"
                                    checked={
                                      selectedRows.length !== 0 &&
                                      selectedRows.length ===
                                        templateData?.result?.length
                                    }
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        const allCheck =
                                          templateData?.result.map(
                                            (template) => template._id
                                          );
                                        setSelectedRows(allCheck);
                                      } else {
                                        setSelectedRows([]);
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
                              <th>SI No.</th>
                              <th>Template Name</th>
                              <th>No Of FollowUp</th>
                              <th>Template FollowUp</th>
                              <th style={{ width: "125px" }}>Action</th>
                              <th>Created Date</th>
                              <th>Updated Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!templateLoading &&
                              templateData &&
                              templateData?.result?.map((template, index) => (
                                <tr>
                                  <td>
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="customCheck2"
                                        checked={selectedRows.includes(
                                          template._id
                                        )}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          if (checked) {
                                            setSelectedRows((prev) => [
                                              ...prev,
                                              template._id,
                                            ]);
                                          } else {
                                            setSelectedRows((prev) =>
                                              prev.filter(
                                                (id) => id !== template._id
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
                                  <td>{index + 1}</td>
                                  <td className="table-user">
                                    <a
                                      href="javascript:void(0);"
                                      className="text-body fw-semibold"
                                    >
                                      {template?.name}
                                    </a>
                                  </td>

                                  <td>
                                    <p>
                                      <div className="input-group bootstrap-touchspin bootstrap-touchspin-injected">
                                        <input
                                          data-toggle="touchspin"
                                          value={template?.followUps?.length}
                                          type="text"
                                          disabled="disabled"
                                          data-bts-button-down-className="btn btn-danger"
                                          data-bts-button-up-className="btn btn-info"
                                          className="form-control"
                                        />
                                      </div>
                                    </p>
                                  </td>

                                  <td>
                                    <div
                                      className="form-check form-switch"
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="customSwitch1"
                                        checked={
                                          realTimeChangeToggle?.[template?._id]
                                            ?.checked ?? template?.enabled
                                        }
                                        style={{
                                          cursor: "pointer",
                                          marginTop: "-1px",
                                        }}
                                        onChange={(e) =>
                                          handleSwitchChange(e, template)
                                        }
                                        disabled={
                                          loadingTemplateId === template._id
                                        }
                                        // onChange={ async () => {
                                        //   try {
                                        //    await  updateSequenceTemplate({
                                        //       id: template._id,
                                        //       body: {
                                        //         updates: {
                                        //           enabled: !template.enabled,
                                        //         },
                                        //       },
                                        //     }).unwrap();
                                        //     toast.success(
                                        //       "Template FollowUp Updated Successfully"
                                        //     )
                                        //   } catch (err) {
                                        //     toast.error(err.data.message);
                                        //   }
                                        // }}
                                      />
                                      <label
                                        className="form-check-label"
                                        for="customSwitch1"
                                      >
                                        {loadingTemplateId === template._id ? (
                                          "Loading"
                                        ) : realTimeChangeToggle[template._id]
                                            ?.checked ? (
                                          <span
                                            className=""
                                            style={{
                                              cursor: "pointer",
                                              fontSize: "12px",
                                            }}
                                          >
                                            Enabled
                                          </span>
                                        ) : (
                                          <span
                                            className=""
                                            style={{
                                              cursor: "pointer",
                                              fontSize: "12px",
                                            }}
                                          >
                                            Disabled
                                          </span>
                                        )}
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center button-list">
                                      <a
                                        className="btn btn-xs btn-primary waves-effect waves-light"
                                        onClick={() => {
                                          setOpenEditSequence(true);
                                          setEditSequenceId(template._id);
                                          handleEdit(template);
                                        }}
                                      >
                                        Edit
                                      </a>
                                      <a
                                        className="btn btn-xs btn-primary waves-effect waves-light"
                                        onClick={() => {
                                          setOpenDeleteSequence(true);
                                          setDeleteSequenceId(template._id);
                                        }}
                                      >
                                        Remove
                                      </a>
                                    </div>
                                  </td>
                                  <td>
                                    {new Date(
                                      template?.created_at
                                    ).toDateString()}{" "}
                                    <small className="text-muted">
                                      {new Date(
                                        template?.created_at
                                      ).toLocaleTimeString()}
                                    </small>
                                  </td>
                                  <td>
                                    {new Date(
                                      template?.updated_at
                                    ).toDateString()}{" "}
                                    <small className="text-muted">
                                      {new Date(
                                        template?.updated_at
                                      ).toLocaleTimeString()}
                                    </small>
                                  </td>
                                </tr>
                              ))}
                            {templateData?.result?.length === 0 && (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  No Templates Found
                                </td>
                              </tr>
                            )}
                            {templateLoading && (
                              <tr>
                                <td colSpan="8" className="text-center">
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
          <Dialog
            open={openDeleteSequence}
            onClose={() => {
              setOpenDeleteSequence(false);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete Sequence Template"}
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
                  Are you sure you want to delete this Sequence Template?
                </p>
                <div className="text-end pl-4 mt-2">
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => handleDeleteSequence()}
                    disabled={deleteTemplateLoading}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      setOpenDeleteSequence(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            open={openEditSequence}
            onClose={() => {
              setOpenEditSequence(false);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Update Sequence Template"}
            </DialogTitle>
            <DialogContent>
              <div
                style={{
                  minWidth: "500px",
                  maxWidth: "800px",
                  minHeight: "200px",
                  maxHeight: "800px",
                }}
              >
                <Formik
                  initialValues={{
                    name: editField?.name,
                    followUps: fieldValue?.followUps || [],
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleEditSequence}
                  enableReinitialize
                >
                  {({ values, setFieldValue, isSubmitting }) => (
                    <Form>
                      <div className="mb-3">
                        <label htmlFor="template-name" className="form-label">
                          Template name <span className="text-danger">*</span>
                        </label>
                        <Field
                          name="name"
                          type="text"
                          id="template-name"
                          className="form-control"
                          value={editField?.name}
                          onChange={(e) =>
                            setEditField({ name: e.target.value })
                          }
                        />
                      </div>

                      <FieldArray name="followUps">
                        {({ push, remove }) => (
                          <>
                            {values.followUps?.map((followUp, index) => (
                              <Accordion
                                key={index}
                                expanded={expanded === `panel${index}`}
                                onChange={handleAccordionChange(
                                  `panel${index}`
                                )}
                                sx={{
                                  boxShadow: "none",
                                  borderBottom: "1px solid #f1f1f1",
                                  borderTop: "none",
                                }}
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls={`panel${index}bh-content`}
                                  id={`panel${index}bh-header`}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                    }}
                                  >
                                    <IconButton
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        remove(index); // Remove follow-up at this index
                                      }}
                                      aria-label="delete"
                                    >
                                      <DeleteIcon color="error" />
                                    </IconButton>
                                    <Typography
                                      sx={{
                                        width: "100%",
                                        flexShrink: 0,
                                        fontWeight: "500",
                                        fontSize: "16px",
                                        color: "#87949b",
                                      }}
                                    >
                                      FollowUp {index + 1}
                                    </Typography>
                                  </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <Box>
                                    <MyEditorDashboard
                                      value={followUp.templateContent}
                                      setValue={(value) =>
                                        setFieldValue(
                                          `followUps.${index}.templateContent`,
                                          value
                                        )
                                      }
                                    />
                                  </Box>
                                  <div
                                    className="mb-3"
                                    style={{ marginTop: "120px" }}
                                  >
                                    <label
                                      htmlFor={`followUps.${index}.daysUntilNext`}
                                      className="form-label"
                                    >
                                      Reminder Interval Day
                                    </label>
                                    <Field
                                      name={`followUps.${index}.daysUntilNext`}
                                      type="number"
                                      className="form-control"
                                      value={followUp.daysUntilNext}
                                      onChange={(e) =>
                                        setFieldValue(
                                          `followUps.${index}.daysUntilNext`,
                                          e.target.value
                                        )
                                      }
                                      // only positive numbers
                                      min="0"
                                    />
                                  </div>
                                </AccordionDetails>
                              </Accordion>
                            ))}

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: "10px",
                              }}
                            >
                              <div className="col-6">
                                <div className="col-auto">
                                  <div className="text-lg-end my-1 my-lg-0">
                                    <button
                                      type="button"
                                      className="btn btn-success waves-effect waves-light me-1"
                                      onClick={() =>
                                        setFieldValue(
                                          "followUps",
                                          values.followUps.slice(-1)
                                        )
                                      }
                                    >
                                      <i className="mdi mdi-cog"></i> Remove All
                                    </button>
                                    <button
                                      className="btn btn-danger waves-effect waves-light"
                                      onClick={() => {
                                        if (
                                          values.followUps.length === 5 &&
                                          userData?.plan?.planFeatures
                                            ?.activeFollowUpEmails ===
                                            values.followUps.length &&
                                          userData?.plan?.planFeatures
                                            ?.activeFollowUpEmails !== -1
                                        ) {
                                          setUpgradeDialogOpen(true);
                                          return;
                                        }
                                        push({
                                          templateContent: "",
                                          daysUntilNext: "",
                                        });
                                        setExpanded(
                                          `panel${values.followUps.length}`
                                        );
                                        toast.success(
                                          "FollowUp Created! Now you can add more followups."
                                        );
                                      }}
                                    >
                                      <i className="mdi mdi-plus-circle me-1"></i>{" "}
                                      Add More
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </FieldArray>

                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleEditSequence(values)}
                        disabled={updateSequenceLoading}
                        style={{
                          marginBottom: "20px",
                          backgroundColor: "#f1f1f1",
                          border: "none",
                        }}
                      >
                        {updateSequenceLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          "Update"
                        )}
                      </Button>
                      <Button
                        variant="text"
                        style={{
                          color: "black",
                          backgroundColor: "#f1f1f1",
                          marginBottom: "20px",
                          marginLeft: "10px",
                        }}
                        onClick={() => {
                          setOpenEditSequence(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </Form>
                  )}
                </Formik>
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
                    </a>{" "}
                  </div>
                </div>
              </div>
            </div>
          </footer>
          {/* <!-- end Footer --> */}
        </div>
      ) : (
        <div className="content-page mb-5">
          <div className="content">
            {/* <!-- Start Content--> */}
            <div className="container-fluid">
              {/* <!-- start page title --> */}
              <div className="row">
                <div className="col-12">
                  <FaArrowLeft
                    style={{ cursor: "pointer" }}
                    onClick={() => setSequenceAdd(false)}
                  />

                  <div className="page-title-box">
                    <div className="page-title-right">
                      <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item">
                          <a href="javascript: void(0);">Jarvisreach</a>
                        </li>
                        <li className="breadcrumb-item">
                          <a href="javascript: void(0);">Sequence</a>
                        </li>
                        <li className="breadcrumb-item active">
                          {/* back button */}
                          Sequence Template Editor
                        </li>
                      </ol>
                    </div>

                    <h4 className="page-title">Sequence Template Editor</h4>
                  </div>
                </div>
              </div>
              {/* <!-- end page title -->  */}

              <div className="row">
                <div className="col-12">
                  <div
                    className="card"
                    style={{
                      padding: "20px",
                    }}
                  >
                    <Formik
                      initialValues={{
                        name: "",
                        subject: "",
                        followUps: [{ templateContent: "", daysUntilNext: "" }],
                      }}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ values, setFieldValue, errors }) => {
                        return (
                          <Form>
                            <div className="mb-3">
                              <label
                                htmlFor="template-name"
                                className="form-label"
                              >
                                Template name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                name="name"
                                type="text"
                                id="template-name"
                                className="form-control"
                              />
                              <ErrorMessage
                                name="name"
                                component="div"
                                style={{ color: "red", fontSize: "12px" }}
                              />
                            </div>
                            <p style={{ fontSize: "16px" }}>
                              <b>
                                Dynamic Variables {"{{"}lead_name{"}}"}
                              </b>
                            </p>
                            <p style={{ color: "grey", fontSize: "14px" }}>
                              Copy paste these variables where it is required.
                            </p>
                            <div className="mb-3">
                              <label
                                htmlFor="template-name"
                                className="form-label"
                              >
                                Template Subject{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                name="subject"
                                type="text"
                                id="template-name"
                                className="form-control"
                              />
                              <ErrorMessage
                                name="subject"
                                component="div"
                                style={{ color: "red", fontSize: "12px" }}
                              />
                            </div>

                            <FieldArray name="followUps">
                              {({ push, remove }) => (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                  }}
                                >
                                  <Box>
                                    {values.followUps.map((followUp, index) => (
                                      <Accordion
                                        key={index}
                                        expanded={expanded === `panel${index}`}
                                        onChange={handleAccordionChange(
                                          `panel${index}`
                                        )}
                                        sx={{
                                          boxShadow: "none",
                                          borderBottom: "1px solid #f1f1f1",
                                          borderTop: "none",
                                        }}
                                      >
                                        <AccordionSummary
                                          expandIcon={<ExpandMoreIcon />}
                                          aria-controls={`panel${index}bh-content`}
                                          id={`panel${index}bh-header`}
                                        >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "flex-start",
                                              alignItems: "center",
                                            }}
                                          >
                                            <IconButton
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                remove(index);
                                              }}
                                              aria-label="delete"
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                            <Typography
                                              sx={{
                                                width: "100%",
                                                flexShrink: 0,
                                                fontWeight: "500",
                                                fontSize: "16px",
                                                color: "#87949b",
                                              }}
                                            >
                                              <p> FollowUp {index + 1}</p>
                                            </Typography>
                                          </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: "column",
                                              gap: isSmallScreen
                                                ? "180px"
                                                : "40px",
                                            }}
                                          >
                                            <Box>
                                              <Field
                                                name={`followUps.${index}.templateContent`}
                                                component={MyEditor}
                                              />
                                            </Box>
                                            {errors.followUps && (
                                              <ErrorMessage
                                                name={`followUps.${index}.templateContent`}
                                                component="div"
                                                style={{
                                                  color: "red",
                                                  fontSize: "12px",
                                                }}
                                              />
                                            )}
                                            <div
                                              className="mb-3"
                                              style={{ marginTop: "50px" }}
                                            >
                                              <label
                                                htmlFor={`followUps.${index}.daysUntilNext`}
                                                className="form-label"
                                              >
                                                Reminder Interval Day
                                              </label>
                                              <Field
                                                name={`followUps.${index}.daysUntilNext`}
                                                type="number"
                                                className="form-control"
                                                min="0"
                                              />
                                              <ErrorMessage
                                                name={`followUps.${index}.daysUntilNext`}
                                                component="div"
                                                style={{
                                                  color: "red",
                                                  fontSize: "12px",
                                                }}
                                              />
                                            </div>
                                          </Box>
                                        </AccordionDetails>
                                      </Accordion>
                                    ))}
                                  </Box>

                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <div className="col-6">
                                      <div className="col-auto">
                                        <div
                                          className="text-end my-1 my-lg-0 d-flex gap-2 flex-column flex-lg-row
                                      align-items-end
                                      justify-content-end
                                      "
                                        >
                                          <button
                                            type="button"
                                            className="btn btn-success waves-effect waves-light"
                                            onClick={() => {
                                              remove(0);
                                            }}
                                          >
                                            <i className="mdi mdi-cog me-1"></i>
                                            Remove
                                          </button>
                                          <button
                                            className="btn btn-danger waves-effect waves-light"
                                            onClick={() => {
                                              if (
                                                values.followUps.length === 5 &&
                                                userData?.plan?.planFeatures
                                                  ?.activeFollowUpEmails ===
                                                  values.followUps.length &&
                                                userData?.plan?.planFeatures
                                                  ?.activeFollowUpEmails !== -1
                                              ) {
                                                setUpgradeDialogOpen(true);
                                                return;
                                              }

                                              push({
                                                templateContent: "",
                                                daysUntilNext: "",
                                              });
                                              setExpanded(
                                                `panel${values.followUps.length}`
                                              );
                                              toast.success(
                                                "FollowUp Created! Now you can add more followups."
                                              );
                                            }}
                                          >
                                            <i className="mdi mdi-plus-circle me-1"></i>{" "}
                                            Add More
                                          </button>
                                        </div>
                                      </div>
                                      {/* <!-- end col--> */}
                                    </div>
                                  </div>
                                </Box>
                              )}
                            </FieldArray>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: "10px",
                              }}
                            >
                              <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={createSequenceTemplateLoading}
                              >
                                <p>Save Template</p>
                              </Button>
                            </div>
                          </Form>
                        );
                      }}
                    </Formik>

                    {/* <!-- end card-body--> */}
                  </div>
                  {/* <!-- end card--> */}
                </div>
                {/* <!-- end col --> */}
              </div>
              {/* <!-- end row -->   */}
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
          title={
            "You have reached the limit of active sequences for your current plan, "
          }
          setRestricts={setUpgradeDialogOpen}
        />
      </Dialog>
    </div>
  );
};

export default SequenceTemplate;

import React, { useState } from "react";
import MyEditor from "../../../components/MyEditor";
import { Box, maxWidth, minWidth, useMediaQuery, width } from "@mui/system";
import {
  useCreatePlanMutation,
  useDeleteAllPlanPackagesMutation,
  useGetAllPackageFeaturesQuery,
  useGetAllPlansQuery,
} from "../../../slices/adminSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { LoaderIcon } from "react-hot-toast";
import MyEditorFeature from "../../../components/MyEditorFeature";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDeletePlanMutation } from "../../../slices/customerSlice";
import { FaChevronLeft } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";

const PackageFeatures = ({ collapsed }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [marketingFeatures, setMarketingFeatures] = useState([""]);
  const [addFeature, setAddFeature] = useState(false);
  const [expanded, setExpanded] = useState(0); // First accordion open by default
  const [openDeletePlan, setOpenDeletePlan] = useState(false);
  const [openFeatureEdit, setOpenFeatureEdit] = useState(false);
  const [deletePlanId, setDeletePlanId] = useState(null);
  const [deletePlan] = useDeleteAllPlanPackagesMutation();
  const [limit, setLimit] = useState(5);
  const [pages, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [planId, setPlanId] = useState("");
  const [planInterval, setPlanInterval] = useState("");
  const [planName, setPlanName] = useState("");
  const [planPrice, setPlanPrice] = useState(0);
  const [planCredits, setPlanCredits] = useState(0);
  const [planCurrency, setPlanCurrency] = useState("");
  const [planStatus, setPlanStatus] = useState("");
  const {
    data: getPackages,
    error: getProfilesError,
    isLoading: getProfilesLoading,
  } = useGetAllPlansQuery({
    page: 1,
    limit: 100,
  });

  // console.log("getPackages", getPackages);

  const {
    data: getAllPackages,
    error: getAllPackagesError,
    isLoading: getAllPackagesLoading,
  } = useGetAllPackageFeaturesQuery({
    page: pages,
    limit: limit,
    search: search,
  });
  const {
    data: getAllPackageAll,
    error: getAllPackage,
    isLoading: getAllPackageLoading,
  } = useGetAllPackageFeaturesQuery({
    page: 1,
    limit: 100,
    search: search,
  });
  // console.log("getAllPackages", getAllPackages);

  const itemsPerPageOptions = [5, 10, 20, 50];
  const totalItems = getAllPackages?.totalRecord || 0;
  const [currentPage, setCurrentPage] = useState(
    getAllPackages?.currentPage || 1
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    itemsPerPageOptions[
      itemsPerPageOptions.indexOf(getAllPackages?.limit) !== -1
        ? itemsPerPageOptions.indexOf(getAllPackages?.limit)
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

  const [createPlan, { isLoading: createPlanLoading }] =
    useCreatePlanMutation();

  const formik = useFormik({
    initialValues: {
      packagePeriod: "month",
      packageName: "Free",
      packageId: "",
      price: 0,
      currency: "usd",
      credits: 0,
      features: [],
      status: "Active",
    },
    validationSchema: Yup.object({
      packagePeriod: Yup.string().required("Package Period is required"),
      packageName: Yup.string().required("Package Name is required"),
      currency: Yup.string().required("Currency is required"),
      features: Yup.array().of(
        Yup.object({ value: Yup.string().required("Feature is required") })
      ),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values) => {
      try {
        await createPlan({
          body: {
            name: values.packageName,
            packageId: values.packageId,
            price: values.packageName === "Free" ? 0 : values.price,
            currency: values.currency,
            credits: values.credits,
            marketingFeatures: marketingFeatures?.map((feature) => ({
              name: feature,
            })),
            status:
              values.packageName === "Free"
                ? "Active"
                : values.status === "Active"
                ? "Active"
                : "Deactive",
            description: "Description",
            period: values.packagePeriod,
          },
        }).unwrap();
        toast.success("Plan created successfully");
        setExpanded(0);
        setMarketingFeatures([""]);
        formik.resetForm();
      } catch (error) {
        console.log(error);
        toast.error(error?.data?.message);
      }
    },
  });

  const featureUpdate = async () => {
    try {
      await createPlan({
        id: planId,
        body: {
          name: planName,
          packageId: planId,
          price: planName === "Free" ? 0 : planPrice,
          currency: planCurrency,
          credits: planCredits,
          marketingFeatures: marketingFeatures?.map((feature) => ({
            name: feature,
          })),
          status: planStatus === "Active" ? "Active" : "Deactive",
          period: planInterval,
        },
      }).unwrap();
      toast.success("Plan Edited successfully");
      setExpanded(0);

      setMarketingFeatures([""]);
      setOpenFeatureEdit(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message);
    }
  };
  const handleEditPlan = (plan) => {
    // console.log("Plan", plan);
    setPlanId(plan?._id);
    setPlanInterval(plan?.interval);
    setPlanName(plan?.name);
    setPlanPrice(plan?.price);
    setPlanCredits(plan?.credits);
    setPlanCurrency(plan?.currency ? plan?.currency : "usd");
    setMarketingFeatures(
      plan?.features ? plan?.features?.map((feature) => feature?.name) : []
    );
    setPlanStatus(plan?.status);
  };

  const handleAddFeature = () => {
    setMarketingFeatures([...marketingFeatures, ""]);
    setExpanded(marketingFeatures.length); // Automatically expand the new accordion
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = marketingFeatures.filter((_, i) => i !== index);
    setMarketingFeatures(newFeatures);
    setExpanded((prev) => (index === prev ? 0 : prev - 1)); // Adjust expanded state
  };

  const handleFeatureChange = (value, index) => {
    // console.log("value", value);
    const newFeatures = marketingFeatures.map((feature, i) =>
      i === index ? value : feature
    );
    setMarketingFeatures(newFeatures);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const currency = [
    { name: "usd", value: "usd" },
    { name: "aed", value: "aed" },
    { name: "afn", value: "afn" },
    { name: "all", value: "all" },
    { name: "amd", value: "amd" },
    { name: "ang", value: "ang" },
    { name: "aoa", value: "aoa" },
    { name: "ars", value: "ars" },
    { name: "aud", value: "aud" },
    { name: "awg", value: "awg" },
    { name: "azn", value: "azn" },
    { name: "bam", value: "bam" },
    { name: "bbd", value: "bbd" },
    { name: "bdt", value: "bdt" },
    { name: "bgn", value: "bgn" },
    { name: "bhd", value: "bhd" },
    { name: "bif", value: "bif" },
    { name: "bmd", value: "bmd" },
    { name: "bnd", value: "bnd" },
    { name: "bob", value: "bob" },
    { name: "brl", value: "brl" },
    { name: "bsd", value: "bsd" },
    { name: "bwp", value: "bwp" },
    { name: "byn", value: "byn" },
    { name: "bzd", value: "bzd" },
    { name: "cad", value: "cad" },
    { name: "cdf", value: "cdf" },
    { name: "chf", value: "chf" },
    { name: "clp", value: "clp" },
    { name: "cny", value: "cny" },
    { name: "cop", value: "cop" },
    { name: "crc", value: "crc" },
    { name: "cve", value: "cve" },
    { name: "czk", value: "czk" },
    { name: "djf", value: "djf" },
    { name: "dkk", value: "dkk" },
    { name: "dop", value: "dop" },
    { name: "dzd", value: "dzd" },
    { name: "egp", value: "egp" },
    { name: "etb", value: "etb" },
    { name: "eur", value: "eur" },
    { name: "fjd", value: "fjd" },
    { name: "fkp", value: "fkp" },
    { name: "gbp", value: "gbp" },
    { name: "gel", value: "gel" },
    { name: "gip", value: "gip" },
    { name: "gmd", value: "gmd" },
    { name: "gnf", value: "gnf" },
    { name: "gtq", value: "gtq" },
    { name: "gyd", value: "gyd" },
    { name: "hkd", value: "hkd" },
    { name: "hnl", value: "hnl" },
    { name: "hrk", value: "hrk" },
    { name: "htg", value: "htg" },
    { name: "huf", value: "huf" },
    { name: "idr", value: "idr" },
    { name: "ils", value: "ils" },
    { name: "inr", value: "inr" },
    { name: "isk", value: "isk" },
    { name: "jmd", value: "jmd" },
    { name: "jod", value: "jod" },
    { name: "jpy", value: "jpy" },
    { name: "kes", value: "kes" },
    { name: "kgs", value: "kgs" },
    { name: "khr", value: "khr" },
    { name: "kmf", value: "kmf" },
    { name: "krw", value: "krw" },
    { name: "kwd", value: "kwd" },
    { name: "kyd", value: "kyd" },
    { name: "kzt", value: "kzt" },
    { name: "lak", value: "lak" },
    { name: "lbp", value: "lbp" },
    { name: "lkr", value: "lkr" },
    { name: "lrd", value: "lrd" },
    { name: "lsl", value: "lsl" },
    { name: "mad", value: "mad" },
    { name: "mdl", value: "mdl" },
    { name: "mga", value: "mga" },
    { name: "mkd", value: "mkd" },
    { name: "mmk", value: "mmk" },
    { name: "mnt", value: "mnt" },
    { name: "mop", value: "mop" },
    { name: "mur", value: "mur" },
    { name: "mvr", value: "mvr" },
    { name: "mwk", value: "mwk" },
    { name: "mxn", value: "mxn" },
    { name: "myr", value: "myr" },
    { name: "mzn", value: "mzn" },
    { name: "nad", value: "nad" },
    { name: "ngn", value: "ngn" },
    { name: "nio", value: "nio" },
    { name: "nok", value: "nok" },
    { name: "npr", value: "npr" },
    { name: "nzd", value: "nzd" },
    { name: "omr", value: "omr" },
    { name: "pab", value: "pab" },
    { name: "pen", value: "pen" },
    { name: "pgk", value: "pgk" },
    { name: "php", value: "php" },
    { name: "pkr", value: "pkr" },
    { name: "pln", value: "pln" },
    { name: "pyg", value: "pyg" },
    { name: "qar", value: "qar" },
    { name: "ron", value: "ron" },
    { name: "rsd", value: "rsd" },
    { name: "rub", value: "rub" },
    { name: "rwf", value: "rwf" },
    { name: "sar", value: "sar" },
    { name: "sbd", value: "sbd" },
    { name: "scr", value: "scr" },
    { name: "sek", value: "sek" },
    { name: "sgd", value: "sgd" },
    { name: "shp", value: "shp" },
    { name: "sle", value: "sle" },
    { name: "sos", value: "sos" },
    { name: "srd", value: "srd" },
    { name: "std", value: "std" },
    { name: "szl", value: "szl" },
    { name: "thb", value: "thb" },
    { name: "tjs", value: "tjs" },
    { name: "tnd", value: "tnd" },
    { name: "top", value: "top" },
    { name: "try", value: "try" },
    { name: "ttd", value: "ttd" },
    { name: "twd", value: "twd" },
    { name: "tzs", value: "tzs" },
    { name: "uah", value: "uah" },
    { name: "ugx", value: "ugx" },
    { name: "uyu", value: "uyu" },
    { name: "uzs", value: "uzs" },
    { name: "vnd", value: "vnd" },
    { name: "vuv", value: "vuv" },
    { name: "wst", value: "wst" },
    { name: "xaf", value: "xaf" },
    { name: "xcd", value: "xcd" },
    { name: "xof", value: "xof" },
    { name: "xpf", value: "xpf" },
    { name: "yer", value: "yer" },
    { name: "zar", value: "zar" },
    { name: "zmw", value: "zmw" },
    { name: "usdc", value: "usdc" },
    { name: "btn", value: "btn" },
    { name: "ghs", value: "ghs" },
    { name: "eek", value: "eek" },
    { name: "lvl", value: "lvl" },
    { name: "svc", value: "svc" },
    { name: "vef", value: "vef" },
    { name: "ltl", value: "ltl" },
    { name: "sll", value: "sll" },
    { name: "mro", value: "mro" },
  ];

  const handleDeletePlan = async () => {
    await deletePlan({
      id: deletePlanId ? deletePlanId : formik.values.packageId,
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

  const handleRowSelect = (id) => {
    const newSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter((row) => row !== id)
      : [...selectedRows, id];
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelectedRows = getAllPackages?.result?.map((plan) => plan._id);
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <div
      style={{
        marginBottom: "100px",
      }}
    >
      {!addFeature && (
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
                          <a href="javascript: void(0);">Package Feature</a>
                        </li>
                        <li className="breadcrumb-item active">List</li>
                      </ol>
                    </div>
                    <h4 className="page-title">Package Feature</h4>
                  </div>
                </div>
              </div>
              {/* <!-- end page title -->  */}

              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div
                        className="row justify-content-between mb-2 gap-4
                      "
                      >
                        <div className="col-auto">
                          <form className="search-bar position-relative mb-sm-0 mb-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search..."
                              onChange={(e) => setSearch(e.target.value)}
                              value={search}
                            />
                            <span className="mdi mdi-magnify"></span>
                          </form>
                        </div>
                        <div className="col-md-6">
                          <div className="text-md-end">
                            <a
                              className="btn btn-danger waves-effect waves-light mb-2 me-2"
                              onClick={() => setAddFeature(true)}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <i className="mdi mdi-basket me-1"></i> Add
                              Features
                            </a>
                          </div>
                        </div>
                        {/* <!-- end col--> */}
                      </div>
                      <div className="table-responsive">
                        <table
                          className="table table-centered table-nowrap table-striped"
                          id="products-datatable"
                        >
                          <thead className="table-light">
                            <tr>
                              <th style={{ width: "20px" }}>
                                {/* <div
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
                                      selectedRows.length ===
                                      getAllPackages?.result?.length
                                    }
                                    onChange={handleSelectAll}
                                  />
                                  <label
                                    className="form-check-label"
                                    for="customCheck1"
                                  >
                                    &nbsp;
                                  </label>
                                </div> */}
                              </th>

                              <th>Package Name</th>
                              <th>Package Period</th>
                              <th>Credit</th>
                              <th>Price</th>
                              <th>Status</th>
                              <th>Create Date</th>
                              <th style={{ width: "82px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getAllPackages?.result?.map((plan) => {
                              return (
                                <tr key={plan._id}>
                                  <td>
                                    {/* <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="customCheck2"
                                        checked={selectedRows.includes(
                                          plan._id
                                        )}
                                        onChange={() =>
                                          handleRowSelect(plan._id)
                                        }
                                      />
                                      <label
                                        className="form-check-label"
                                        for="customCheck2"
                                      >
                                        &nbsp;
                                      </label>
                                    </div> */}
                                  </td>

                                  <td>{plan?.name}</td>
                                  <td>{plan?.interval}</td>
                                  <td>{plan?.credits}</td>
                                  <td>${plan?.price}</td>
                                  <td>
                                    <span
                                      className="badge"
                                      style={{
                                        backgroundColor:
                                          plan?.status === "Active"
                                            ? "rgba(26, 188, 156, 0.25)"
                                            : "#f4516c",
                                        color:
                                          plan?.status === "Active"
                                            ? "rgb(26, 188, 156)"
                                            : "white",
                                      }}
                                    >
                                      {plan?.status}
                                    </span>
                                  </td>

                                  <td>
                                    {new Date(
                                      plan?.createdAt
                                    ).toLocaleDateString()}
                                  </td>

                                  <td>
                                    <a
                                      onClick={() => {
                                        handleEditPlan(plan);
                                        setOpenFeatureEdit(true);
                                      }}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      className="action-icon"
                                    >
                                      {" "}
                                      <i className="mdi mdi-square-edit-outline"></i>
                                    </a>
                                    {/* <a
                                        onClick={() => {
                                          setOpenDeletePlan(true);
                                          setDeletePlanId(plan._id);
                                        }}
                                        style={{
                                          cursor: "pointer",
                                        }}
                                        className="action-icon"
                                      >
                                        {" "}
                                        <i className="mdi mdi-delete"></i>
                                      </a> */}
                                  </td>
                                </tr>
                              );
                            })}
                            {getAllPackagesLoading && (
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
            open={openFeatureEdit}
            onClose={() => {
              setOpenFeatureEdit(false);
              setMarketingFeatures([""]);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Box
              style={{
                width: "600px",
                minWidth: "300px",
                overflowX: "hidden",
              }}
            >
              <form>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-body">
                        <h5
                          className="text-uppercase p-2 mt-0 mb-3"
                          style={{
                            backgroundColor: "#f4f4f4",
                            fontWeight: "600",
                          }}
                        >
                          Package Features
                        </h5>

                        <div className="mb-3">
                          <label htmlFor="packagePeriod" className="form-label">
                            Package Period
                          </label>
                          <select
                            className={`form-control`}
                            id="packagePeriod"
                            value={planInterval}
                            onChange={(e) => setPlanInterval(e.target.value)}
                            disabled={true}
                          >
                            <option value="month">Monthly</option>
                            <option value="year">Annually</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="packageName" className="form-label">
                            Package Name
                          </label>
                          <select
                            className={`form-control`}
                            id="packageName"
                            name="packageName"
                            value={planId}
                            disabled={true}
                            onChange={(e) => {
                              setPlanId(e.target.value);
                              setPlanName(
                                e.target.options[e.target.selectedIndex].text
                              );
                            }}
                          >
                            {getAllPackages?.result?.map((item, index) => (
                              <option value={item?._id} key={index}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="price" className="form-label">
                            Price
                          </label>
                          <input
                            type="text"
                            id="price"
                            className={`form-control`}
                            value={planName === "Free" ? 0 : planPrice}
                            onChange={(e) => setPlanPrice(e.target.value)}
                            disabled={true}
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="currency" className="form-label">
                            Currency
                          </label>
                          <select
                            className={`form-control`}
                            id="currency"
                            value={planCurrency}
                            onChange={(e) => setPlanCurrency(e.target.value)}
                            disabled={true}
                          >
                            {currency.map((item) => (
                              <option value={item.value} key={item.value}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="credits" className="form-label">
                            Credits
                          </label>
                          <input
                            type="text"
                            id="credits"
                            className={`form-control `}
                            value={planCredits}
                            onChange={(e) => setPlanCredits(e.target.value)}
                          />
                        </div>
                        <label
                          htmlFor="product-description"
                          className="form-label"
                        >
                          Features
                        </label>

                        {marketingFeatures?.map((feature, index) => (
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
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              {" "}
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleRemoveFeature(index)}
                                style={{
                                  marginTop: "10px",
                                }}
                              >
                                Remove
                              </Button>
                            </AccordionSummary>
                            <AccordionDetails
                              sx={{
                                marginBottom: "30px",
                              }}
                            >
                              <div>
                                <MyEditorFeature
                                  value={feature}
                                  onChange={(value) =>
                                    handleFeatureChange(value, index)
                                  }
                                />
                              </div>
                              {!feature && (
                                <p style={{ color: "red" }}>
                                  Feature is required
                                </p>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        ))}

                        {/* <!-- end Snow-editor--> */}

                        <div className="col-auto" style={{ marginTop: "80px" }}>
                          <div
                            className="text-lg-end my-1 my-lg-0"
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <button
                              type="button"
                              className="btn btn-success waves-effect waves-light me-1"
                              onClick={() => setMarketingFeatures([""])}
                            >
                              <i className="mdi mdi-cog"></i> Remove All
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger waves-effect waves-light"
                              onClick={handleAddFeature}
                              disabled={
                                marketingFeatures.length === 15
                                  ? true
                                  : false ||
                                    marketingFeatures.some(
                                      (feature) => !feature
                                    )
                                  ? true
                                  : false
                              }
                            >
                              <i className="mdi mdi-plus-circle me-1"></i> Add
                              More
                            </button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="mb-2">Status</label>
                          <br />
                          <div className="d-flex flex-wrap">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="status"
                                value="Active"
                                id="inlineRadio1"
                                checked={planStatus === "Active"}
                                onChange={() => setPlanStatus("Active")}
                                disabled={planName === "Free" ? true : false}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="inlineRadio1"
                              >
                                Active
                              </label>
                            </div>
                            <div className="form-check me-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="status"
                                value="Deactive"
                                id="inlineRadio2"
                                checked={
                                  planStatus === "Deactive" ? true : false
                                }
                                onChange={() => setPlanStatus("Deactive")}
                                disabled={planName === "Free" ? true : false}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="inlineRadio2"
                              >
                                Deactive
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <!-- end card --> */}
                  </div>
                  {/* <!-- end col --> */}
                </div>
                {/* <!-- end row --> */}

                <div className="row">
                  <div className="col-12">
                    <div
                      className="text-center mb-3"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <button
                        type="button"
                        className="btn w-sm btn-dark waves-effect"
                        onClick={() => {
                          setOpenFeatureEdit(false);
                          setMarketingFeatures([""]);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn w-sm btn-success waves-effect waves-light"
                        onClick={(e) => {
                          e.preventDefault();
                          featureUpdate();
                        }}
                        disabled={
                          createPlanLoading || marketingFeatures.length > 15
                            ? true
                            : false ||
                              marketingFeatures.some((feature) => !feature)
                            ? true
                            : false
                        }
                      >
                        Save
                      </button>
                      {/* <button
                        type="button"
                        className="btn w-sm btn-danger waves-effect waves-light"
                        onClick={() => handleDeletePlan()}
                      >
                        Delete
                      </button> */}
                    </div>
                  </div>
                  {/* <!-- end col --> */}
                </div>
              </form>{" "}
            </Box>
          </Dialog>

          {/* Delete Feature */}
          <Dialog
            open={openDeletePlan}
            onClose={() => setOpenDeletePlan(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Delete Plan"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this plan?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeletePlan(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeletePlan} color="primary" autoFocus>
                Delete
              </Button>
            </DialogActions>
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
      )}
      {addFeature && (
        <div className="content-page">
          {createPlanLoading && (
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
          )}
          <div className="content">
            {/* <!-- Start Content--> */}
            <div className="container-fluid">
              {/* <!-- start page title --> */}
              <div className="row">
                <div className="col-12">
                  {/* Back Button */}
                  <div className="d-flex">
                    <div>
                      <FaArrowLeft
                        onClick={() => setAddFeature(false)}
                        style={{
                          fontSize: "1rem",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                  <div className="page-title-box">
                    <div className="page-title-right">
                      <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item">
                          <a href="javascript: void(0);">Jarvisreach</a>
                        </li>
                        <li className="breadcrumb-item">
                          <a href="javascript: void(0);">Package Feature</a>
                        </li>
                        <li className="breadcrumb-item active">Add Features</li>
                      </ol>
                    </div>
                    <h4 className="page-title">Add Features</h4>
                  </div>
                </div>
              </div>
              {/* <!-- end page title -->  */}
              <form onSubmit={formik.handleSubmit}>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-body">
                        <h5
                          className="text-uppercase p-2 mt-0 mb-3"
                          style={{
                            backgroundColor: "#f4f4f4",
                            fontWeight: "600",
                          }}
                        >
                          Package Features
                        </h5>

                        <div className="mb-3">
                          <label htmlFor="packagePeriod" className="form-label">
                            Package Period
                          </label>
                          <select
                            className={`form-control ${
                              formik.touched.packagePeriod &&
                              formik.errors.packagePeriod
                                ? "is-invalid"
                                : ""
                            }`}
                            id="packagePeriod"
                            {...formik.getFieldProps("packagePeriod")}
                          >
                            <option value="month">Monthly</option>
                            <option value="year">Annually</option>
                          </select>
                          {formik.touched.packagePeriod &&
                          formik.errors.packagePeriod ? (
                            <div className="invalid-feedback">
                              {formik.errors.packagePeriod}
                            </div>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="packageName" className="form-label">
                            Package Name
                          </label>
                          <select
                            className={`form-control ${
                              formik.touched.packageName &&
                              formik.errors.packageName
                                ? "is-invalid"
                                : ""
                            }`}
                            id="packageName"
                            name="packageName"
                            value={formik.values.packageId}
                            onChange={(e) => {
                              formik.setFieldValue(
                                "packageName",
                                e.target.options[e.target.selectedIndex].text
                              );
                              formik.setFieldValue("packageId", e.target.value);
                            }}
                          >
                            <option value="" disabled>
                              Select Package
                            </option>
                            {getPackages?.result?.map((item) => (
                              <option
                                value={item._id}
                                key={item._id}
                                disabled={getAllPackageAll?.result?.find(
                                  (plan) =>
                                    plan.name === item.name &&
                                    plan.interval ===
                                      formik.values.packagePeriod
                                )}
                                style={{
                                  color: getAllPackageAll?.result?.find(
                                    (plan) =>
                                      plan.name === item.name &&
                                      plan.interval ===
                                        formik.values.packagePeriod
                                  )
                                    ? "lightgray"
                                    : "",
                                }}
                              >
                                {item.name}
                              </option>
                            ))}
                          </select>

                          {formik.touched.packageName &&
                          formik.errors.packageName ? (
                            <div className="invalid-feedback">
                              {formik.errors.packageName}
                            </div>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="price" className="form-label">
                            Price
                          </label>
                          <input
                            type="number"
                            id="price"
                            className={`form-control`}
                            {...formik.getFieldProps("price")}
                            // default price 0, if getPackages name is equal to "Free"
                            value={
                              formik.values.packageName === "Free"
                                ? 0
                                : formik.values.price
                            }
                            disabled={formik.values.packageName === "Free"}
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="currency" className="form-label">
                            Currency
                          </label>
                          <select
                            className={`form-control ${
                              formik.touched.currency && formik.errors.currency
                                ? "is-invalid"
                                : ""
                            }`}
                            id="currency"
                            {...formik.getFieldProps("currency")}
                            value={formik.values.currency}
                            onChange={formik.handleChange}
                          >
                            {currency.map((item) => (
                              <option value={item.value} key={item.value}>
                                {item.name}
                              </option>
                            ))}
                          </select>

                          {formik.touched.currency && formik.errors.currency ? (
                            <div className="invalid-feedback">
                              {formik.errors.currency}
                            </div>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="credits" className="form-label">
                            Credits
                          </label>
                          <input
                            type="number"
                            id="credits"
                            className={`form-control `}
                            {...formik.getFieldProps("credits")}
                            value={formik.values.credits}
                          />
                        </div>
                        <label
                          htmlFor="product-description"
                          className="form-label"
                        >
                          Features
                        </label>

                        {marketingFeatures?.map((feature, index) => (
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
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              {" "}
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleRemoveFeature(index)}
                                style={{
                                  marginTop: "10px",
                                }}
                              >
                                Remove
                              </Button>
                            </AccordionSummary>
                            <AccordionDetails
                              sx={{
                                marginBottom: "30px",
                              }}
                            >
                              <MyEditorFeature
                                value={feature}
                                onChange={(value) =>
                                  handleFeatureChange(value, index)
                                }
                              />
                            </AccordionDetails>
                          </Accordion>
                        ))}

                        {/* <!-- end Snow-editor--> */}

                        <div className="col-auto" style={{ marginTop: "80px" }}>
                          <div
                            className="text-lg-end my-1 my-lg-0"
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <button
                              type="button"
                              className="btn btn-success waves-effect waves-light me-1"
                              onClick={() => setMarketingFeatures([""])}
                            >
                              <i className="mdi mdi-cog"></i>&nbsp; Remove All
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger waves-effect waves-light"
                              onClick={handleAddFeature}
                              disabled={
                                marketingFeatures.length === 15
                                  ? true
                                  : false ||
                                    marketingFeatures.some(
                                      (feature) => !feature
                                    )
                                  ? true
                                  : false
                              }
                            >
                              <i className="mdi mdi-plus-circle me-1"></i> Add
                              More
                            </button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="mb-2">Status</label>
                          <br />
                          <div className="d-flex flex-wrap">
                            <div className="form-check me-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="status"
                                value="Active"
                                id="inlineRadio1"
                                checked={
                                  formik.values.status === "Active" ||
                                  formik.values.packageName === "Free"
                                }
                                onChange={() =>
                                  formik.setFieldValue("status", "Active")
                                }
                                disabled={formik.values.packageName === "Free"}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="inlineRadio1"
                              >
                                Active
                              </label>
                            </div>
                            <div className="form-check me-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="status"
                                value="Deactive"
                                id="inlineRadio2"
                                checked={formik.values.status === "Deactive"}
                                onChange={() =>
                                  formik.setFieldValue("status", "Deactive")
                                }
                                disabled={formik.values.packageName === "Free"}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="inlineRadio2"
                              >
                                Deactive
                              </label>
                            </div>
                          </div>
                          {formik.touched.status && formik.errors.status ? (
                            <div className="invalid-feedback d-block">
                              {formik.errors.status}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {/* <!-- end card --> */}
                  </div>
                  {/* <!-- end col --> */}
                </div>
                {/* <!-- end row --> */}

                <div className="row">
                  <div className="col-12">
                    <div
                      className="text-center mb-3"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <button
                        type="button"
                        className="btn w-sm btn-dark waves-effect"
                        onClick={() => {
                          formik.resetForm();
                          setAddFeature(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn w-sm btn-success waves-effect waves-light"
                        disabled={
                          createPlanLoading || marketingFeatures.length === 15
                            ? true
                            : false ||
                              marketingFeatures.some((feature) => !feature)
                            ? true
                            : false
                        }
                      >
                        {createPlanLoading ? "Saving" : "Save"}
                      </button>
                      <button
                        type="button"
                        className="btn w-sm btn-danger waves-effect waves-light"
                        onClick={() => handleDeletePlan()}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {/* <!-- end col --> */}
                </div>
              </form>{" "}
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

export default PackageFeatures;

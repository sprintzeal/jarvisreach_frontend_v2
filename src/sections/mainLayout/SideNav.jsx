import {
  ChevronRight,
  Folder,
  Logout,
  Shield,
  ShieldMoon,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Popover,
  Skeleton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box, maxHeight } from "@mui/system";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiFolderPlus, BiPlus } from "react-icons/bi";
import { FaEnvelope, FaRegFileAlt, FaShieldAlt } from "react-icons/fa";
import {
  FaDownload,
  FaEllipsisVertical,
  FaEnvelopeCircleCheck,
  FaGear,
  FaHandHoldingDollar,
  FaHeadphones,
  FaList,
  FaListCheck,
  FaLock,
  FaMoneyCheckDollar,
  FaObjectUngroup,
  FaRectangleList,
  FaRegSquarePlus,
  FaRotate,
  FaShield,
} from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Scrollbar } from "../../components/Scrollbar";
import { logout } from "../../slices/authSlice";
import {
  useDeleFolderMutation,
  useEditFolderMutation,
  useGetProfileFolderNameQuery,
  useGetSubscriptionInfoQuery,
  usePostProfileFolderMutation,
} from "../../slices/customerSlice";
import { setFolder } from "../../slices/folderSlice";
import { sendMessageToExtension } from "../../utils/timeAgo";
import "./SideNav.css";
import { useSelector } from "react-redux";
import Restrict from "../../components/Restrict";

const useStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "white",
  boxShadow: 24,
  padding: 4,
  outline: "none",
};
const SideNav = ({ collapsed, toggleCollapse, setFolderId }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const { userData } = useSelector((state) => state.userData);
  const [activeItem, setActiveItem] = useState("/");
  const [activeFolder, setActiveFolder] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [deletefolderId, setDeleteFolderId] = useState(null);
  const [editedFolderId, setEditedFolderId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openEditPopOver, setOpenEditPopOver] = useState(false);
  const [leadManagerOpen, setLeadManagerOpen] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [defaultFolder, setDefaultFolder] = useState(false);
  const handleUpgradeDialogClose = () => {
    setUpgradeDialogOpen(false);
  };
  const [
    deleteFolder,
    {
      isLoading: deleteFolderLoading,

      isSuccess: deleteFolderSuccess,
    },
  ] = useDeleFolderMutation();
  const [editFolder, { isLoading: editFolderLoading, error: editFolderError }] =
    useEditFolderMutation();
  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };
  const handleConfirmDelete = async () => {
    try {
      await deleteFolder({ id: deletefolderId }).unwrap();
      handleClose();
      setConfirmOpen(false);
      toast.success("Folder deleted successfully");
    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message);
    }
  };
  const [name, setName] = useState("");
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const handleTooltipOpen = () => setActiveTooltip(true);
  const handleTooltipClose = () => setActiveTooltip(false);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleDeleteClick = (folder) => {
    setConfirmOpen(true);
  };

  const {
    data: subscriptionInfoData,
    isLoading: subscriptionInfoLoading,
    error: subscriptionInfoError,
  } = useGetSubscriptionInfoQuery();

  const handleClick = (event, folder) => {
    setDefaultFolder(folder?.default);
    setAnchorEl(event.currentTarget);
    setEditName(folder.name);
    setEditColor(folder.color);
    setDeleteFolderId(folder._id);
    setEditedFolderId(folder._id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleEditFolderName = (folder) => {
    // console.log("folder edited", folder);
    setOpenEditPopOver(true);
  };

  const colorPalette = [
    "#FEEE5E",
    "#B8EA68",
    "#99EDFF",
    "#D0B2FF",
    "#AB69FF",
    "#FFA3A2",
    "#FFB569",
    "#EAE9E8",
    "#E4D54C",
    "#59D095",
    "#69B3FF",
    "#6A69FF",
    "#D14EB4",
    "#FF6A69",
    "#BF884F",
    "#ADADAD",
    "#B99A2B",
    "#4EA67A",
    "#4F86BF",
    "#504FBF",
    "#873BA1",
    "#BF504F",
    "#897764",
    "#414C58",
  ];

  const [userInfor, setUserInfor] = useState(null);
  const {
    data: getFolderName,
    isLoading,
    error,
  } = useGetProfileFolderNameQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [postData, { isLoading: postLoading }] = usePostProfileFolderMutation();

  const handleNavClick = (path, folderId = null) => {
    setActiveItem(path);
    setActiveFolder(folderId ? folderId : null);
    navigate(folderId ? `${path}?id=${folderId}` : path);
    dispatch(setFolder({ ...folderId }));
    setFolderId(folderId ? folderId : null);
    if (isSmallScreen) {
      toggleCollapse();
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("auth");
    // console.log(user, "user");
    if (!userInfor) {
      setUserInfor(JSON.parse(user));
    }
  }, []);

  const postFOlderData = async () => {
    // check if getFolderName has name already exists in the folder name list and return an error
    if (getFolderName?.result?.length > 0) {
      const folderNameExists = getFolderName.result.find(
        (folder) => folder.name.toLowerCase() === name.toLowerCase()
      );
      if (folderNameExists) {
        toast.error("Folder name already exists");
        return;
      }
    }
    try {
      const body = {
        name: name,
        owner: userInfor.result._id,
        leads: [],
        color: selectedColor,
      };
      await postData({ body }).unwrap();
      setActiveTooltip(false);
      setName("");
      setSelectedColor("");
      toast.success("Folder created successfully");
    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message);
    }
  };
  const postEditData = async () => {
    try {
      const body = {
        name: editName,
        owner: userInfor.result._id,
        leads: [],
        color: editColor,
      };
      await editFolder({ body, id: editedFolderId }).unwrap();
      toast.success("Folder Edited successfully");
      setOpenEditPopOver(false);
      setAnchorEl(null);
      setEditName("");
      setEditColor("");
      setAnchorEl(null);
    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message || "An error occured");
    }
  };

  useEffect(() => {
    if (getFolderName) {
      const firstFolderId = getFolderName?.result[0]?._id;
      if (deleteFolderLoading) {
        setActiveFolder(firstFolderId);
        dispatch(setFolder({ ...getFolderName.result[0] }));
        setFolderId(firstFolderId);
        navigate(`/folder?id=${firstFolderId}`);
      }

      if (
        getFolderName?.result?.length > 0 &&
        window.location.pathname === "/folder" &&
        !activeFolder
      ) {
        setActiveFolder(firstFolderId);
        navigate(`/folder?id=${getFolderName?.result[0]._id}`);
        dispatch(setFolder({ ...getFolderName.result[0] }));
      }
    }
  }, [getFolderName, activeFolder, deleteFolderLoading]);

  useEffect(() => {
    if (window.location.pathname === "/folder" && window.location.search) {
      // if there is a folder id in the url we have to make it selected
      const folderId = new URLSearchParams(window.location.search).get("id");

      if (folderId !== undefined || folderId !== "undefined") {
        console.log(folderId)
        setTimeout(() => {
          console.log(folderId)
          handleNavClick('/folder', folderId);
        }, 200);
      }
    }
  }, [])

  useEffect(() => {
    setActiveItem(window.location.pathname);
  }, [window.location.pathname]);

  if (userInfor?.result.role === "admin") {
    return (
      <div
        className={`sidenav ${collapsed ? "collapsed" : ""}`}
        style={{
        	top:"68px",
          height: "100vh",
          overflowX: "hidden",
          paddingRight: "10px",
        }}
      >
        {!collapsed && (
          <button
            style={{ width: "100%", fontSize: "12px", fontWeight: "bold" }}
          >
            <p>NAVIGATION</p>
          </button>
        )}
        <button
          // className={activeItem === "/dashboard" ? "" : ""}
          onClick={() => handleNavClick("/dashboard")}
          style={{
            color: activeItem === "/dashboard" ? "#f1556c" : "",
            display: "flex",
            gap: "12px",
            marginLeft: collapsed ? "12px" : "",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-airplay"
          >
            <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
            <polygon points="12 15 17 21 7 21 12 15"></polygon>
          </svg>
          <p>{!collapsed && "Dashboard"}</p>
        </button>
        <button
          onClick={() => handleNavClick("/customer")}
          style={{
            color: activeItem === "/customer" ? "#f1556c" : "",
            display: "flex",
            gap: "12px",
            marginLeft: collapsed ? "12px" : "",
            marginTop: collapsed ? "" : "-5px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-users"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <p> {!collapsed && "Customers"}</p>
        </button>
        {/* <button
          className={activeItem === "/plan" ? "active" : ""}
          onClick={() => handleNavClick("/plan")}
        >
          <People className="icon" /> {!collapsed && "Plan"}
        </button> */}
        <Accordion
          sx={{
            backgroundColor: "transparent",
            border: "none",
            boxShadow: "none",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            marginTop: "15px",
          }}
        >
          <AccordionSummary
            expandIcon={
              !collapsed && (
                <ChevronRight
                  style={{
                    fontSize: "18px",
                  }}
                />
              )
            }
            aria-controls="panel1d-content"
            id="panel1d-header"
            sx={{
              backgroundColor: "transparent",
              padding: "0",
              margin: "-30px 0 -10px 0",
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              style={{
                marginTop: collapsed ? "10px" : "-5px",
                marginBottom: "-2px",
                fontSize: "15.2px",
                display: "flex",
                gap: "12px",
                marginLeft: collapsed ? "12px" : "",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-users"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>

              <p>{!collapsed && "Plans"}</p>
            </button>
          </AccordionSummary>
          <AccordionDetails
            style={{
              display: "flex",
              flexDirection: "column",
              height: "80px",
              marginTop: collapsed ? "-10px" : "-10px",
              marginBottom: "-20px",
              padding: collapsed && 0,
            }}
          >
            <button
              style={{
                color: activeItem === "/package" ? "#f1556c" : "",
                fontSize: "15.2px",
                marginBottom: collapsed ? "0px" : "5px",
              }}
              onClick={() => handleNavClick("/package")}
            >
              <FaHandHoldingDollar
                style={{
                  fontSize: "16px",
                }}
                className="icon"
              />{" "}
              {!collapsed && "Package"}
            </button>
            <button
              style={{
                color: activeItem === "/package-features" ? "#f1556c" : "",
                fontSize: "15.2px",
              }}
              onClick={() => handleNavClick("/package-features")}
            >
              <FaMoneyCheckDollar
                style={{
                  fontSize: "16px",
                }}
                className="icon"
              />{" "}
              <p
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {!collapsed && "Package Features"}
              </p>
            </button>
          </AccordionDetails>
        </Accordion>

        <button
          style={{
            color: activeItem === "/data-manager" ? "#f1556c" : "",
            border: "none",
            marginTop: collapsed ? "10px" : "5px",
            fontSize: "15.2px",
          }}
          onClick={() => handleNavClick("/data-manager")}
        >
          <BiFolderPlus
            style={{
              fontSize: "16px",
            }}
            className="icon"
          />{" "}
          <p>{!collapsed && "Data Manager"}</p>
        </button>
        <Accordion
          sx={{
            backgroundColor: "#fff",
            boxShadow: "none",
            border: "none",
            marginTop: "15px",
          }}
        >
          <AccordionSummary
            expandIcon={
              !collapsed && (
                <ChevronRight
                  style={{
                    fontSize: "18px",
                  }}
                />
              )
            }
            aria-controls="panel1d-content"
            id="panel1d-header"
            sx={{
              backgroundColor: "#fff",
              padding: "0",
              margin: "-20px 0 0px 0",
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              // className={activeItem === "/help" ? "active" : ""}
              style={{
                marginTop: collapsed ? "0px" : "-10px",
                marginBottom: "0px",
                fontSize: "15.2px",
                marginLeft: collapsed ? "12px" : "",
              }}
            >
              <FaRegFileAlt
                style={{
                  fontSize: "18px",
                }}
                className="icon"
              />{" "}
              <p>{!collapsed && "Blog"}</p>
            </button>
          </AccordionSummary>
          <AccordionDetails
            style={{
              display: "flex",
              flexDirection: "column",
              height: collapsed ? "60px" : "80px",
              marginTop: collapsed ? "10px" : "-10px",
              marginBottom: "-10px",
              padding: collapsed && 0,
            }}
          >
            <button
              className={activeItem === "/blog-category" ? "active" : ""}
              style={{
                color: activeItem === "/blog-category" ? "#f1556c" : "",
                marginBottom: collapsed ? "0px" : "5px",
                marginTop: collapsed ? "0px" : "-2px",
                fontSize: "15.2px",
              }}
              onClick={() => handleNavClick("/blog-category")}
            >
              <FaList
                style={{
                  fontSize: "16px",
                }}
                className="icon"
              />{" "}
              <p>{!collapsed && "Category"}</p>
            </button>
            <button
              style={{
                color: activeItem === "/blog-list" ? "#f1556c" : "",
                marginBottom: collapsed ? "0px" : "0px",
                fontSize: "15.2px",
              }}
              onClick={() => handleNavClick("/blog-list")}
            >
              <FaRegSquarePlus
                style={{
                  fontSize: "16px",
                }}
                className="icon"
              />{" "}
              <p> {!collapsed && "Blog"}</p>
            </button>
          </AccordionDetails>
        </Accordion>

        <Accordion
          sx={{
            backgroundColor: "#fff",
            boxShadow: "none",
            border: "none",
            marginTop: "15px",
          }}
        >
          <AccordionSummary
            expandIcon={
              !collapsed && (
                <ChevronRight
                  style={{
                    fontSize: "18px",
                  }}
                />
              )
            }
            aria-controls="panel1d-content"
            id="panel1d-header"
            sx={{
              backgroundColor: "#fff",
              padding: "0",
              margin: "-30px 0 -10px 0",
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              // className={activeItem === "/help" ? "active" : ""}
              style={{
                marginTop: "0px",
                marginBottom: "0px",
                fontSize: "15.2px",
                marginLeft: collapsed ? "12px" : "",
              }}
            >
              <FaHeadphones
                style={{
                  fontSize: "18px",
                }}
                className="icon"
              />{" "}
              <p>{!collapsed && "Help & Support"}</p>
            </button>
          </AccordionSummary>
          <AccordionDetails
            style={{
              display: "flex",
              flexDirection: "column",
              height: "90px",
              marginTop: collapsed && "10px",
              marginBottom: "-10px",
              padding: collapsed && 0,
            }}
          >
            <button
              style={{
                color: activeItem === "/help-category" ? "#f1556c" : "",
                marginBottom: collapsed ? "0px" : "5px",
                marginTop: collapsed ? "0px" : "-2px",
                fontSize: "15.2px",
              }}
              onClick={() => handleNavClick("/help-category")}
            >
              <FaList
                style={{
                  fontSize: "16px",
                }}
                className="icon"
              />{" "}
              <p>{!collapsed && "Category"}</p>
            </button>
            <button
              style={{
                color: activeItem === "/help-list" ? "#f1556c" : "",
                fontSize: "15.2px",
              }}
              onClick={() => handleNavClick("/help-list")}
            >
              <FaRegSquarePlus
                style={{
                  fontSize: "16px",
                }}
                className="icon"
              />{" "}
              {!collapsed && "Help"}
            </button>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  } else if (
    userInfor?.result.role === "customer" ||
    userInfor?.result.role === "teammember"
  ) {
    return (
      <div className={`sidenav ${collapsed ? "collapsed" : ""} `}>
        <ul
          id="side-menu"
          style={{
            paddingRight: "10px",
            overflowX: "hidden",
          }}
        >
          <Scrollbar
            style={{
              height: "100vh",
              overflowX: "hidden !important",
              overflowY: "auto",
            }}
          >
            {!collapsed && (
              <li
                className="menu-title"
                style={{
                  marginTop: "70px",
                }}
              >
                <div
                  className="mt-1"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <h4
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "left",
                    }}
                  >
                    <span
                      className="badge p-1 px-2"
                      style={{
                        backgroundColor: "rgba(108, 117, 125, 0.18)",
                        color: "#6c757d",
                        borderRadius: "20px",
                      }}
                    >
                      {userInfor?.result?.firstName.toUpperCase() +
                        " " +
                        userInfor?.result?.lastName.toUpperCase()}
                    </span>
                  </h4>
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    <div
                      className="progress my-2 progress-sm"
                      style={{
                        height: "7px",
                        borderRadius: "20px",
                        backgroundColor: "#e9ecef",
                      }}
                    >
                      <div
                        className="progress-bar progress-lg"
                        role="progressbar"
                        style={{
                          width:
                            (subscriptionInfoData?.creditsUsed /
                              subscriptionInfoData?.credits) *
                            100 +
                            "%",
                          backgroundColor: "#f7b84b",
                          height: "8px",
                        }}
                        aria-valuenow="46"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <p
                      className="text-muted font-12 mb-0"
                      style={{
                        marginTop: "-10px",
                      }}
                    >
                      {subscriptionInfoData?.plan}{" "}
                      {subscriptionInfoData?.creditsUsed} /{" "}
                      {subscriptionInfoData?.credits}
                    </p>
                  </div>
                </div>
              </li>
            )}
            {(userData?.plan?.planName === "Free" ||
              (userData?.plan?.planName === "Basic" &&
                (userData?.plan?.planFeatures?.folderCreationLimit ===
                  getFolderName?.result?.length ||
                  getFolderName?.result?.length >
                  userData?.plan?.planFeatures?.folderCreationLimit))) &&
              !collapsed && (
                <Box>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      textAlign: "center",
                      color: "#424770",
                      fontSize: "16px",
                      fontWeight: 400,
                      backgroundColor: "#ecf5ff",
                      padding: 2,
                      border: "1px solid #c7e2ff",
                      borderRadius: 1,
                      marginLeft: 1,
                      marginTop: 1,
                    }}
                  >
                    {userData?.plan?.planName === "Free" &&
                      userData?.plan?.planFeatures?.folderCreationLimit === 0 ? (
                      <span>
                        {`You've reached your free folders limit, upgrade your plan to create more folders and access to more features.
                      `}
                        <span
                          style={{
                            color: "#f1556c",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => navigate("/see-plan")}
                        >
                          {" "}
                          See Plans
                        </span>
                      </span>
                    ) : (userData?.plan?.planFeatures?.folderCreationLimit ===
                      getFolderName?.result?.length ||
                      getFolderName?.result?.length >
                      userData?.plan?.planFeatures?.folderCreationLimit) &&
                      userData?.plan?.planName === "Basic" ? (
                      <span>
                        {`You've reached your folders limit, upgrade your plan to create more folders. `}
                        <span
                          style={{
                            color: "#f1556c",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => navigate("/see-plan")}
                        >
                          {" "}
                          See Plans
                        </span>
                      </span>
                    ) : null}
                  </Typography>
                </Box>
              )}
            <>
              <div
                className=""
                style={{
                  padding: collapsed
                    ? "20px 20px 0px 20px"
                    : "20px 0px 0px 0px",
                  fontSize: "16px",
                  position: "relative",
                }}
              >
                <div className="tour-step-6">
                  <Accordion
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      boxShadow: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      marginTop: "-15px",
                      marginLeft: collapsed ? "5px" : "0px",
                    }}
                    expanded={
                      userData?.plan?.planName === "Free" &&
                        userData?.plan?.planFeatures?.leadManagerAccess === false
                        ? false
                        : leadManagerOpen
                    }
                    onChange={() => setLeadManagerOpen(!leadManagerOpen)}
                  >
                    <AccordionSummary
                      expandIcon={
                        !collapsed && (
                          <ChevronRight
                            style={{
                              fontSize: "18px",
                            }}
                          />
                        )
                      }
                      aria-controls="panel1d-content"
                      id="panel1d-header"
                      sx={{
                        backgroundColor: "transparent",
                        padding: "0",
                        margin: collapsed
                          ? "0px 0 -30px -3px"
                          : "0px 0 -10px 0",
                        display: "flex",
                        alignItems: "center",
                        lineHeight: "1",
                      }}
                    >
                      <button
                        style={{
                          marginTop: "0px",
                          marginBottom: "0px",
                          fontSize: "15.2px",
                          fontWeight: 500,
                          marginLeft: collapsed ? "5px" : "",
                          display: "flex",
                          gap: "10px",
                          color:
                            collapsed &&
                              userData?.plan?.planName === "Free" &&
                              userData?.plan?.planFeatures?.leadManagerAccess ===
                              false
                              ? "#ccc "
                              : "",
                        }}
                        disabled={
                          collapsed &&
                          userData?.plan?.planName === "Free" &&
                          userData?.plan?.planFeatures?.leadManagerAccess ===
                          false
                        }
                      >
                        <Tooltip
                          sx={{
                            fontSize: "15.2px",
                            fontWeight: 500,
                          }}
                          title={collapsed && "Lead Manager"}
                          placement="right"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="feather feather-edit"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </Tooltip>
                        <p>{!collapsed && "Lead Manager"}</p>
                      </button>
                    </AccordionSummary>
                    <AccordionDetails
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "180px",
                        marginTop: collapsed ? "20px" : "-18px",
                        marginBottom: collapsed ? "-30px" : "",
                      }}
                    >
                      <button
                        onClick={() => handleNavClick("/compose-email")}
                        style={{
                          marginTop: collapsed ? "-10px" : "5px",
                          marginBottom: collapsed ? "0px" : "0px",
                          color:
                            activeItem === "/compose-email" ? "#f1556c" : "",
                        }}
                      >
                        <Tooltip
                          title={collapsed && "Compose Email"}
                          placement="right"
                        >
                          <FaEnvelope
                            style={{
                              fontSize: "15.2px",
                              marginLeft: collapsed ? "-25px" : "",
                            }}
                            className="icon"
                          />{" "}
                        </Tooltip>
                        <p
                          style={{
                            fontSize: "15.2px",
                          }}
                        >
                          {!collapsed && "Compose Email"}
                        </p>
                      </button>
                      <button
                        onClick={() => handleNavClick("/smtp")}
                        style={{
                          marginTop: collapsed ? "5px" : "5px",
                          color: activeItem === "/smtp" ? "#f1556c" : "",
                        }}
                      >
                        <Tooltip
                          title={collapsed && "SMTP Settings"}
                          placement="right"
                        >
                          <FaGear
                            style={{
                              fontSize: "15.2px",

                              marginLeft: collapsed ? "-25px" : "",
                            }}
                            className="icon"
                          />{" "}
                        </Tooltip>
                        <p
                          style={{
                            fontSize: "15.2px",
                          }}
                        >
                          {!collapsed && "SMTP Settings"}
                        </p>
                      </button>

                      <button
                        onClick={() => handleNavClick("/sequence")}
                        style={{
                          marginTop: collapsed ? "-5px" : "-10px",
                          color: activeItem === "/sequence" ? "#f1556c" : "",
                        }}
                      >
                        <Tooltip
                          title={collapsed && "Sequences"}
                          placement="right"
                        >
                          <FaObjectUngroup
                            style={{
                              fontSize: "15.2px",

                              marginLeft: collapsed ? "-25px" : "",
                            }}
                            className="icon"
                          />{" "}
                        </Tooltip>
                        <p
                          style={{
                            fontSize: "15.2px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {!collapsed && "Sequence Templates"}
                        </p>
                      </button>
                      <button
                        onClick={() => handleNavClick("/sequence-list")}
                        style={{
                          marginTop: collapsed ? "-5px" : "-10px",
                          color:
                            activeItem === "/sequence-list" ? "#f1556c" : "",
                        }}
                      >
                        <Tooltip
                          title={collapsed && "Sequences List"}
                          placement="right"
                        >
                          <FaRectangleList
                            style={{
                              fontSize: "15.2px",

                              marginLeft: collapsed ? "-25px" : "",
                            }}
                            className="icon"
                          />{" "}
                        </Tooltip>
                        <p
                          style={{
                            fontSize: "15.2px",
                          }}
                        >
                          {!collapsed && "Sequence List"}
                        </p>
                      </button>
                      <button
                        onClick={() => handleNavClick("/lead-status")}
                        style={{
                          marginTop: collapsed ? "-5px" : "-10px",
                          color: activeItem === "/lead-status" ? "#f1556c" : "",
                        }}
                      >
                        <Tooltip
                          title={collapsed && "Lead Status"}
                          placement="right"
                        >
                          <FaListCheck
                            style={{
                              fontSize: "15.2px",

                              marginLeft: collapsed ? "-25px" : "",
                            }}
                            className="icon"
                          />{" "}
                        </Tooltip>
                        <p
                          style={{
                            fontSize: "15.2px",
                          }}
                        >
                          {!collapsed && "Lead Status"}
                        </p>
                      </button>
                    </AccordionDetails>
                  </Accordion>
                </div>
                {!collapsed && userData?.plan?.planName === "Free" && (
                  <div
                    style={{
                      position: "absolute",
                      right: collapsed ? "0%" : "0",
                      top: collapsed ? "25%" : "10%",
                      width: "100%",
                      opacity: "0.5",
                      height: collapsed ? "40px" : "50px",
                      backgroundColor: "rgb(255 255 255)",
                      zIndex: "100",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: collapsed ? "center" : "flex-end",
                      cursor: "pointer",
                      zIndex: 10,
                    }}
                    onClick={() => setUpgradeDialogOpen(true)}
                  >
                    <FaLock />
                  </div>
                )}
                {/* <a
                data-bs-toggle="collapse"
                className="menu-link"
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {collapsed ? (
                  <Tooltip title="Lead Manager" placement="right">
                    <span
                      className="menu-icon"
                      style={{
                        marginRight: "10px",
                      }}
                    >
                      <FiShare2 className="icon" />
                    </span>
                  </Tooltip>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span className="menu-text">
                      {" "}
                      <FiShare2
                        style={{
                          marginRight: "10px",
                        }}
                        className="icon"
                      />{" "}
                      Lead Manager{" "}
                    </span>
                    <ChevronRight
                      style={{
                        marginLeft: "auto",
                        color: "gray",
                                                  fontSize: "15.2px",

                      }}
                    />
                  </div>
                )}
              </a> */}
                <div className="collapse" id="menuMultilevel">
                  <ul className="sub-menu">
                    <li className="menu-item menu-item-pad">
                      <a
                        href="#menuMultilevel2"
                        data-bs-toggle="collapse"
                        className="menu-link"
                      >
                        <span className="menu-text menu-sub-clr">
                          {" "}
                          <i className="fa-solid fa-envelope"></i> Mailbox{" "}
                        </span>
                        <span className="menu-arrow"></span>
                      </a>
                      <div className="collapse" id="menuMultilevel2">
                        <ul className="sub-menu">
                          <li className="menu-item menu-item-pad">
                            <a
                              href="email-inbox-user.html"
                              className="menu-link"
                            >
                              <span className="menu-text menu-text-clr">
                                <i className="fa-solid fa-circle-arrow-right"></i>{" "}
                                Inbox
                              </span>
                            </a>
                          </li>
                          <li className="menu-item menu-item-pad">
                            <a
                              href="email-read-user.html"
                              className="menu-link"
                            >
                              <span className="menu-text menu-text-clr">
                                <i className="fa-solid fa-circle-arrow-right"></i>{" "}
                                Read Email
                              </span>
                            </a>
                          </li>
                          <li className="menu-item menu-item-pad">
                            <a
                              href="email-compose-user.html"
                              className="menu-link"
                            >
                              <span className="menu-text menu-text-clr">
                                {" "}
                                <i className="fa-solid fa-circle-arrow-right"></i>{" "}
                                Compose Email
                              </span>
                            </a>
                          </li>
                          <li className="menu-item menu-item-pad">
                            <a
                              href="email-templates-user.html"
                              className="menu-link"
                            >
                              <span className="menu-text menu-text-clr">
                                <i className="fa-solid fa-circle-arrow-right"></i>{" "}
                                Email Templates
                              </span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </li>

                    <li className="menu-item menu-item-pad">
                      <a href="#" className="menu-link">
                        <span className="menu-text menu-sub-clr">
                          {" "}
                          <i className="fa-solid fa-list-check"></i> Lead Status
                        </span>
                      </a>
                    </li>
                    <li className="menu-item menu-item-pad">
                      <a href="#" className="menu-link">
                        <span className="menu-text menu-sub-clr">
                          {" "}
                          <i className="fa-brands fa-sourcetree"></i> Lead
                          Source
                        </span>
                      </a>
                    </li>
                    <li className="menu-item menu-item-pad">
                      <a href="#" className="menu-link">
                        <span className="menu-text menu-sub-clr">
                          {" "}
                          <i className="fa-solid fa-envelope-circle-check"></i>{" "}
                          Lead
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </>

            {!isLoading ? (
              <div
                className="menu-title tour-step-2"
                style={{
                  border:
                    getFolderName?.result.length > 3
                      ? "1px solid #e9ecef"
                      : "none",
                  marginTop: collapsed ? "20px" : "10px",
                  marginBottom: collapsed ? "-5px" : "5px",
                  marginLeft: collapsed ? "3px" : "0px",
                }}
              >
                <Scrollbar
                  sx={{
                    height: "100%",
                    maxHeight: "35vh",
                    overflowX: "hidden",
                  }}
                >
                  {getFolderName?.result?.map((folder, index) => {
                    const folderLimitReached =
                      (userData?.plan?.planName === "Basic" ||
                        userData?.plan?.planName === "Free") &&
                      userData?.plan?.isUnsubscribed &&
                      userData?.plan?.planFeatures?.folderCreationLimit <=
                      index;

                    return (
                      <button
                        key={folder._id}
                        className={
                          folder._id === activeFolder
                            ? "active menu-title"
                            : "menu-title"
                        }
                        style={{
                          // marginTop: collapsed ? "-30px" : "-10px",
                          // marginBottom: collapsed ? "10px" : "10px",
                          position: "relative",
                        }}
                      >
                        {collapsed ? (
                          <Tooltip title={folder.name} placement="right">
                            <div
                              className="folder-container"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "80%",
                                marginLeft: "7px",
                                // marginTop: "10px",
                                marginBottom: "-10px",
                              }}
                            >
                              <div
                                onClick={() =>
                                  handleNavClick("/folder", folder._id)
                                }
                                style={{
                                  color:
                                    activeItem === "/folder" ? "#f1556c" : "",
                                }}
                              >
                                <Folder
                                  className="icon"
                                  style={{ color: `${folder.color}` }}
                                />
                              </div>
                            </div>
                          </Tooltip>
                        ) : (
                          <div
                            className="folder-container"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "80%",
                              // marginTop: "8px",
                              marginBottom: "-20px",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1px",
                                color:
                                  activeItem === "/folder" ? "#f1556c" : "",
                              }}
                              onClick={() =>
                                !folderLimitReached &&
                                handleNavClick("/folder", folder._id)
                              } // Disable click if limit reached
                            >
                              <Box>
                                <Folder
                                  className="icon"
                                  style={{ color: `${folder.color}` }}
                                />
                              </Box>
                              <button
                                style={{
                                  color:
                                    folder._id === activeFolder
                                      ? "#f1556c"
                                      : "#6e768e",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  margin: "0px",
                                  width: "140px",
                                  display: "block",
                                  lineHeight: "1.3",
                                  textTransform: "capitalize",
                                }}
                                className="folder-name"
                                disabled={folderLimitReached} // Disable button if limit is reached
                              >
                                {folder.name}
                                <span
                                  style={{
                                    fontSize: "12px",
                                    textTransform: "capitalize",
                                    color: "#6e768e",
                                    marginLeft: "15px",
                                  }}
                                >
                                  {folder?.default === true && (
                                    <Tooltip
                                      title="Protected"
                                      placement="top"
                                      // offset
                                      PopperProps={{
                                        modifiers: [
                                          {
                                            name: "offset",
                                            options: {
                                              offset: [0, -5],
                                            },
                                          },
                                        ],
                                      }}
                                    >
                                      <Shield
                                        style={{
                                          fontSize: "15.2px",
                                          cursor: "pointer",
                                        }}
                                      />
                                    </Tooltip>
                                  )}
                                </span>
                              </button>
                            </Box>
                            <div
                              className="hover-edit-menu"
                              aria-describedby={folder._id}
                              variant="contained"
                              onClick={(event) => handleClick(event, folder)}
                              style={{
                                zIndex: 100000000000000,
                              }}
                            >
                              <FaEllipsisVertical
                                style={{
                                  color: "#fff",
                                  cursor: "pointer",
                                }}
                              />
                            </div>
                            <Popover
                              id={id}
                              open={open}
                              anchorEl={anchorEl}
                              onClose={handleClose}
                              anchorOrigin={{
                                vertical: "center",
                                horizontal: "left",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                              sx={{
                                boxShadow: "none",
                                "& .css-3bmhjh-MuiPaper-root-MuiPopover-paper":
                                {
                                  boxShadow:
                                    "0 1px 5px 0 rgba(0, 0, 0, 0.01)",
                                },
                                "& .css-1dmzujt": {
                                  boxShadow: "0 1px 5px 0 rgba(0, 0, 0, 0.01)",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  backgroundColor: "#fff",
                                  boxShadow: "none",
                                  padding: "10px 20px",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                  gap: "5px",
                                  fontSize: "15.2px",
                                }}
                                id={anchorEl}
                              >
                                <button
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "black",
                                    fontSize: "15.2px",
                                    fontWeight: 500,
                                  }}
                                  onClick={() => {
                                    handleEditFolderName(folder);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    color: defaultFolder
                                      ? "#d3d3d3"
                                      : "#ff0000",
                                    fontSize: "15.2px",
                                    fontWeight: 500,
                                  }}
                                  onClick={() => {
                                    handleDeleteClick(folder);
                                  }}
                                  disabled={
                                    deleteFolderLoading || defaultFolder
                                  }
                                >
                                  {(deleteFolderLoading && "Deleting...") ||
                                    "Delete"}
                                </button>
                              </Box>
                            </Popover>
                          </div>
                        )}
                        {folderLimitReached && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: "0",
                              right: collapsed ? "-10%" : "0",
                              top: collapsed ? "76%" : "5%",
                              left: collapsed ? "30%" : "0%",
                              width: "70%",
                              opacity: "0.5",
                              height: "40px",
                              backgroundColor: "rgb(255 255 255)",
                              zIndex: "100",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "left",
                            }}
                            onClick={() => setUpgradeDialogOpen(true)}
                          >
                            <FaLock
                              style={{ fontSize: "20px", marginLeft: "-1px" }}
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </Scrollbar>{" "}
              </div>
            ) : (
              <div
                className="d-flex justify-content-center"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  height: "40%",
                }}
              >
                <div
                  className="folder-container"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "80%",
                  }}
                >
                  <Skeleton variant="rectangular" width={40} height={30}>
                    <div>
                      <Folder className="icon" />
                    </div>
                  </Skeleton>
                  <Skeleton variant="rectangular" width={150} height={10}>
                    <div></div>
                  </Skeleton>
                </div>
                <div
                  className="folder-container"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "80%",
                  }}
                >
                  <Skeleton variant="rectangular" width={40} height={30}>
                    <div>
                      <Folder className="icon" />
                    </div>
                  </Skeleton>
                  <Skeleton variant="rectangular" width={150} height={10}>
                    <div></div>
                  </Skeleton>
                </div>
                <div
                  className="folder-container"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "80%",
                  }}
                >
                  <Skeleton variant="rectangular" width={40} height={30}>
                    <div>
                      <Folder className="icon" />
                    </div>
                  </Skeleton>
                  <Skeleton variant="rectangular" width={150} height={10}>
                    <div></div>
                  </Skeleton>
                </div>
                <div
                  className="folder-container"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "80%",
                  }}
                >
                  <Skeleton variant="rectangular" width={40} height={30}>
                    <div>
                      <Folder className="icon" />
                    </div>
                  </Skeleton>
                  <Skeleton variant="rectangular" width={150} height={10}>
                    <div></div>
                  </Skeleton>
                </div>
                <div
                  className="folder-container"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "80%",
                  }}
                >
                  <Skeleton variant="rectangular" width={40} height={30}>
                    <div>
                      <Folder className="icon" />
                    </div>
                  </Skeleton>
                  <Skeleton variant="rectangular" width={150} height={10}>
                    <div></div>
                  </Skeleton>
                </div>
                <div
                  className="folder-container"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "80%",
                  }}
                >
                  <Skeleton variant="rectangular" width={40} height={30}>
                    <div>
                      <Folder className="icon" />
                    </div>
                  </Skeleton>
                  <Skeleton variant="rectangular" width={150} height={10}>
                    <div></div>
                  </Skeleton>
                </div>
                <div
                  className="folder-container"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "80%",
                  }}
                >
                  <Skeleton variant="rectangular" width={40} height={30}>
                    <div>
                      <Folder className="icon" />
                    </div>
                  </Skeleton>
                  <Skeleton variant="rectangular" width={150} height={10}>
                    <div></div>
                  </Skeleton>
                </div>
              </div>
            )}
            {/* <button
            className={activeItem === "/contact-list" ? "active" : ""}
            onClick={() => handleNavClick("/contact-list")}
          >
            <Folder className="icon" style={{ color: "rgb(255, 181, 105)" }} />
            {!collapsed && "Contact List"}
          </button> */}
            <div>
              <ClickAwayListener onClickAway={handleTooltipClose}>
                <Tooltip
                  placement="right"
                  disablePortal={false}
                  PopperProps={{
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: isSmallScreen ? [10, -300] : [100, -40],
                        },
                      },
                    ],

                    sx: {
                      //                 -webkit-text-size-adjust: 100%;
                      // --google-font-color-materialiconstwotone: none;
                      fontFamily: "muli, sans-serif",
                      // -webkit-tap-highlight-color: transparent;
                      margin: "0px",
                      padding: "0px",
                      minWidth: "150px",
                      borderRadius: "4px",
                      color: "#414C58",
                      lineHeight: "1.4",
                      textAlign: "justify",
                      fontSize: "15.2px",
                      wordBreak: "break-all",
                      marginTop: "-72px !important",
                      marginLeft: "12px",
                      width: "320px",
                      transformOrigin: "left center",
                      "& .MuiTooltip-tooltip": {
                        backgroundColor: "#fff",
                        color: "white",
                        boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                      },
                      "& .MuiTooltip-arrow": {
                        color: "#f4f4f4",
                      },
                    },
                  }}
                  onClose={handleTooltipClose}
                  open={activeTooltip}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  disableInteractive
                  title={
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "#fff",
                        color: "#000",
                        borderRadius: 1,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1
                              className="modal-title fs-5"
                              style={{
                                whiteSpace: "nowrap",
                                width: "100%",
                                fontWeight: 600,
                                fontSize: "15.2px",
                              }}
                            >
                              New Folder
                            </h1>
                            <hr />
                            <button
                              type="button"
                              className="btn-close"
                              onClick={handleTooltipClose}
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <form>
                              <div className="mb-2">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="name"
                                  placeholder="Name"
                                  value={name}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    setName(e.target.value);
                                  }}
                                />
                              </div>

                              <div className="color-option mb-3">
                                <h5
                                  style={{
                                    fontWeight: 600,
                                    marginBottom: "10px",
                                  }}
                                >
                                  Set Color
                                </h5>
                                <div className="d-flex flex-wrap">
                                  {colorPalette.map((color, index) => (
                                    <Box
                                      key={index}
                                      sx={{
                                        width: 24,
                                        height: 24,
                                        backgroundColor: color,
                                        borderRadius: "50%",
                                        margin: 0.3,
                                        cursor: "pointer",
                                        border:
                                          selectedColor === color
                                            ? "2px solid #000"
                                            : "2px solid transparent",
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleColorSelect(color);
                                      }}
                                    />
                                  ))}
                                </div>
                                {/* <div className="mt-2">
                              Selected Color: {selectedColor}
                            </div> */}
                              </div>

                              <div
                                className="  d-md-flex justify-content-md-end"
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <button
                                  className="btn btn-secondary "
                                  style={{
                                    backgroundColor: "#000",
                                    color: "#fff",
                                    backgroundColor: "#000",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "80px",
                                  }}
                                  type="button"
                                  onClick={postFOlderData}
                                  disabled={postLoading}
                                >
                                  {postLoading ? (
                                    <span
                                      className="spinner-border spinner-border-sm"
                                      role="status"
                                      aria-hidden="true"
                                      style={{
                                        textAlign: "end",
                                        display: "flex",
                                        alignItems: "flex-end",
                                      }}
                                    ></span>
                                  ) : (
                                    "Create"
                                  )}
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </Box>
                  }
                >
                  <button
                    className="tooltip-trigger-button "
                    onClick={
                      !(
                        userData?.plan?.planName === "Free" ||
                        (userData?.plan?.planName === "Basic" &&
                          (userData?.plan?.planFeatures?.folderCreationLimit ===
                            getFolderName?.result?.length ||
                            getFolderName?.result?.length >
                            userData?.plan?.planFeatures
                              ?.folderCreationLimit))
                      )
                        ? handleTooltipOpen
                        : () => setUpgradeDialogOpen(true)
                    }
                    style={{
                      position: "relative",
                      width: collapsed ? "100%" : "48%",
                    }}
                  // disabled={
                  //   userData?.plan?.planName === "Free" ||
                  //   (userData?.plan?.planName === "Basic" &&
                  //     (userData?.plan?.planFeatures?.folderCreationLimit ===
                  //       getFolderName?.result?.length ||
                  //       getFolderName?.result?.length >
                  //         userData?.plan?.planFeatures?.folderCreationLimit))
                  // }
                  >
                    {collapsed ? (
                      <Tooltip title="New Folder" placement="right">
                        <BiPlus
                          className="icon"
                          style={{
                            color:
                              collapsed &&
                                (userData?.plan?.planName === "Free" ||
                                  (userData?.plan?.planName === "Basic" &&
                                    (userData?.plan?.planFeatures
                                      ?.folderCreationLimit ===
                                      getFolderName?.result?.length ||
                                      getFolderName?.result?.length >
                                      userData?.plan?.planFeatures
                                        ?.folderCreationLimit)))
                                ? "#ccc "
                                : "rgb(65, 76, 88)",
                            fontWeight: "bold",
                            fontSize: "1.8rem",
                            marginLeft: "-4px",
                            marginTop: "5px",
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <button
                        style={{
                          fontSize: "15.2px",
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "-4px",
                          fontWeight: 500,
                          margin: "10px 0px 0px -6px",
                          display: "flex",
                          gap: "7px",
                          width: "-10x",
                        }}
                        disabled={
                          userData?.plan?.planName === "Free" ||
                          userData?.plan?.planFeatures?.folderCreationLimit ===
                          getFolderName?.result?.length
                        }
                      >
                        <BiPlus
                          style={{
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "1.8rem",
                          }}
                        />
                        <p
                          style={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          New Folder
                        </p>
                      </button>
                    )}
                    {!collapsed &&
                      (userData?.plan?.planName === "Free" ||
                        (userData?.plan?.planName === "Basic" &&
                          (userData?.plan?.planFeatures?.folderCreationLimit ===
                            getFolderName?.result?.length ||
                            getFolderName?.result?.length >
                            userData?.plan?.planFeatures
                              ?.folderCreationLimit))) && (
                        <div
                          style={{
                            position: "absolute",
                            right: collapsed ? "-10%" : "10%",
                            top: collapsed ? "-20%" : "-10%",
                            left: collapsed ? "85%" : "0%",
                            width: collapsed ? "45%" : "190%",
                            opacity: "0.5",
                            height: "40px",
                            backgroundColor: "rgb(255 255 255)",
                            zIndex: 100000000,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: collapsed ? "center" : "flex-end",
                          }}
                          onClick={() => setUpgradeDialogOpen(true)}
                          className="tour-step-1"
                        >
                          <FaLock style={{ marginLeft: "-50px" }} />
                        </div>
                      )}
                  </button>
                </Tooltip>
              </ClickAwayListener>
            </div>

            <div
              style={{
                position: "relative",
              }}
            >
              {collapsed ? (
                <Tooltip
                  title="Email Verifier"
                  placement="right"
                  PopperProps={{
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -10],
                        },
                      },
                    ],
                  }}
                >
                  <button
                    onClick={() => navigate("/folder/email-verifier")}
                    style={{
                      marginBottom: "-5px",
                      color:
                        activeItem === "/folder/email-verifier"
                          ? "#f1556c"
                          : "",
                      width: collapsed ? "100%" : "",
                    }}
                  >
                    <FaEnvelopeCircleCheck className="icon" />
                  </button>{" "}
                </Tooltip>
              ) : (
                <button
                  onClick={() => navigate("/folder/email-verifier")}
                  style={{
                    fontSize: "15.2px",
                    fontWeight: 500,
                    marginBottom: "12px",
                    color:
                      activeItem === "/folder/email-verifier" ? "#f1556c" : "",
                    width: "90%",
                    overflow: "hidden",
                  }}
                >
                  <FaEnvelopeCircleCheck className="icon" />
                  <p>Email Verifier</p>{" "}
                </button>
              )}
              {userData?.plan?.planName === "Free" && (
                <div
                  style={{
                    position: "absolute",
                    right: collapsed ? "-10%" : "10%",
                    top: collapsed ? "-80%" : "-15%",
                    left: collapsed ? "-5%" : "0%",
                    width: "100%",
                    opacity: "0.5",
                    height: "40px",
                    backgroundColor: "rgb(255 255 255)",
                    zIndex: "100000000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-end",
                    cursor: "pointer",
                  }}
                  onClick={() => setUpgradeDialogOpen(true)}
                  className="tour-step-7"
                >
                  {" "}
                  <FaLock style={{ fontSize: "16px" }} />
                </div>
              )}
            </div>

            {/* {collapsed ? (
              <Tooltip
                title="Enrichment"
                placement="right"
                PopperProps={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -10],
                      },
                    },
                  ],
                }}
              >
                <button
                  onClick={() => navigate("/enrichment")}
                  style={{
                    marginBottom: "-5px",
                    color: activeItem === "/enrichment" ? "#f1556c" : "",
                    width: collapsed ? "100%" : "",
                  }}
                >
                  <FaRotate className="icon" />
                </button>{" "}
              </Tooltip>
            ) : (
              <button
                onClick={() => navigate("/enrichment")}
                style={{
                  fontSize: "15.2px",
                  fontWeight: 500,
                  marginBottom: "12px",
                  color: activeItem === "/enrichment" ? "#f1556c" : "",
                }}
              >
                <FaRotate className="icon" />
                <p>Enrichment</p>
              </button>
            )} */}
            {collapsed ? (
              <Tooltip
                title="Export"
                placement="right"
                PopperProps={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -10],
                      },
                    },
                  ],
                }}
              >
                <button
                  onClick={() => navigate("/export")}
                  style={{
                    marginBottom: collapsed ? "10px" : "-5px",
                    color: activeItem === "/export" ? "#f1556c" : "",
                    width: collapsed ? "100%" : "",
                  }}
                >
                  <FaDownload className="icon" />
                </button>{" "}
              </Tooltip>
            ) : (
              <button
                className="tour-step-8"
                onClick={() => navigate("/export")}
                style={{
                  fontSize: "15.2px",
                  fontWeight: 500,
                  marginBottom: "12px",
                  color: activeItem === "/export" ? "#f1556c" : "",
                }}
              >
                <FaDownload className="icon" />
                <p>Exports</p>
              </button>
            )}

            {collapsed ? (
              <Tooltip
                title="Logout"
                placement="right"
                PopperProps={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -10],
                      },
                    },
                  ],
                }}
              >
                <button
                  onClick={() => {
                    sessionStorage.removeItem("auth");
                    handleNavClick("/login");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "red",
                    fontWeight: 500,
                    width: collapsed ? "100%" : "",
                  }}
                >
                  <Logout className="icon" />
                </button>
              </Tooltip>
            ) : (
              <button
                onClick={() => {
                  dispatch(logout());
                  sendMessageToExtension({
                    type: "logout",
                  });
                  navigate("/login");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "red",
                  fontSize: "15.2px",
                  fontWeight: 500,
                }}
              >
                <Logout className="icon" />
                <p>Logout</p>
              </button>
            )}
          </Scrollbar>
        </ul>
        {/* confirmation Delete folder MOdal */}
        <Dialog
          open={confirmOpen}
          onClose={handleConfirmClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm Deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this folder?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmClose} color="primary">
              Cancel
            </Button>
            <Button
              sx={{
                color: "#ff0000",
                fontSize: "15.2px",
                fontWeight: 500,
              }}
              onClick={handleConfirmDelete}
              color="primary"
              autoFocus
              disabled={deleteFolderLoading}
            >
              {deleteFolderLoading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                  style={{
                    textAlign: "end",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                ></span>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogActions>
        </Dialog>
        <Popover
          id="simple-popover"
          open={openEditPopOver}
          anchorEl={anchorEl}
          onClose={() => {
            setOpenEditPopOver(false);
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Box
            sx={{
              p: 2,
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-dialog modal-dialog-centered modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title fs-5"
                    style={{
                      whiteSpace: "nowrap",
                      width: "100%",
                      fontWeight: 600,
                      fontSize: "15.2px",
                    }}
                  >
                    New Folder
                  </h1>
                  <hr />
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setOpenEditPopOver(false);
                    }}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="Name"
                        value={editName}
                        onChange={(e) => {
                          e.stopPropagation();
                          setEditName(e.target.value);
                        }}
                      />
                    </div>

                    <div className="color-option mb-3">
                      <h5
                        style={{
                          fontWeight: 600,
                          marginBottom: "10px",
                        }}
                      >
                        Set Color
                      </h5>
                      <div className="d-flex flex-wrap">
                        {colorPalette.map((color, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: color,
                              borderRadius: "50%",
                              margin: 0.5,
                              cursor: "pointer",
                              border:
                                editColor === color
                                  ? "2px solid #000"
                                  : "2px solid transparent",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditColor(color);
                            }}
                          />
                        ))}
                      </div>
                      {/* <div className="mt-2">
                              Selected Color: {selectedColor}
                            </div> */}
                    </div>

                    <div className="  d-md-flex justify-content-md-end">
                      <button
                        className="btn btn-secondary "
                        style={{
                          backgroundColor: "#000",
                          color: "#fff",
                          backgroundColor: "#000",
                          display: "flex",
                          alignItems: "center",
                          width: "80px",
                        }}
                        type="button"
                        onClick={postEditData}
                        disabled={editFolderLoading}
                      >
                        {editFolderLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                            style={{
                              textAlign: "end",
                              display: "flex",
                              alignItems: "flex-end",
                            }}
                          ></span>
                        ) : (
                          "Update"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Box>
        </Popover>
        <Dialog open={upgradeDialogOpen} onClose={handleUpgradeDialogClose}>
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
            title={"This feature is not available in your current plan,"}
            setRestricts={setUpgradeDialogOpen}
          />
        </Dialog>
      </div>
    );
  }
};

export default SideNav;

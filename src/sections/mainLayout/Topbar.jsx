import { Menu } from "@mui/icons-material";
import { Button, ClickAwayListener, Stack, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../../slices/authSlice";
import { sendMessageToExtension } from "../../utils/timeAgo";
import "./Topbar.css"; // Create this CSS file to manage your Topbar styles
import { apiSlice } from "../../slices/apiSlice";

import { useLogoutQuery } from "../../slices/customerSlice";

const Topbar = ({ collapsed, toggleCollapse, avatar, initialValues }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const {
    data: logoutData,
    error: logoutError,
    refetch: refetchLogout,
  } = useLogoutQuery();
  const [activeMenu, setActiveMenu] = useState("");
  const [userInfo, setUserInfo] = useState();
  const { auth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  // console.log("initialValues", initialValues);
  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenu("");
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    localStorage.removeItem("avatar");
    sendMessageToExtension({
      type: "logout",
    });
    refetchLogout();

    dispatch(apiSlice.util.resetApiState());
    navigate("/login");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("auth"));
    setUserInfo(user);
  }, []);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <div className={`topbar ${collapsed ? "collapsed" : ""}`}>
      <div className="topbar-content">
        <Stack direction="row" spacing={2} alignItems="center">
          {!collapsed ? (
            <div
              className="logo"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                letterSpacing: "1px",
                textDecoration: "none",
                gap: "5px",
              }}
              onClick={() => {
                if (auth?.result?.role !== "admin") {
                  navigate("/home");
                }
              }}
            >
              <img
                src="/assets/images/jarvis-logo.png"
                alt="Javris Reach"
                style={{ width: "130px", height: "20px" }}
              />
            </div>
          ) : (
            <img
              src="/assets/images/logo/mobile-logo.png"
              alt="Javris Reach"
              style={{ width: "30px", height: "30px" }}
            />
          )}
          <Button
            style={{
              color: "white",
              backgroundColor: "transparent",
              border: "none",
              padding: "0px",
              minWidth: "0px",
            }}
            onClick={toggleCollapse}
          >
            <Menu />
          </Button>
        </Stack>
        <ClickAwayListener onClickAway={handleMenuClose}>
          <div className="topbar-right">
            {/* <div className="search-container">
            <InputBase
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
              className="search-input"
            />
            <IconButton type="submit" aria-label="search">
              <Search />
            </IconButton>
          </div>
          {/* <ul
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              listStyle: "none",
            }}
          >
            <li className="dropdown d-none d-lg-inline-block topbar-dropdown">
              <a
                className="nav-link dropdown-toggle arrow-none waves-effect waves-light"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="false"
                aria-expanded="false"
              >
                <img
                  src="assets/images/flags/us.jpg"
                  alt="user-image"
                  height="16"
                />
              </a>
              <div className="dropdown-menu dropdown-menu-end">
                <a href="javascript:void(0);" className="dropdown-item">
                  <img
                    src="assets/images/flags/germany.jpg"
                    alt="user-image"
                    className="me-1"
                    height="12"
                  />{" "}
                  <span className="align-middle">German</span>
                </a>

                <a href="javascript:void(0);" className="dropdown-item">
                  <img
                    src="assets/images/flags/italy.jpg"
                    alt="user-image"
                    className="me-1"
                    height="12"
                  />{" "}
                  <span className="align-middle">Italian</span>
                </a>

                <a href="javascript:void(0);" className="dropdown-item">
                  <img
                    src="assets/images/flags/spain.jpg"
                    alt="user-image"
                    className="me-1"
                    height="12"
                  />{" "}
                  <span className="align-middle">Spanish</span>
                </a>

                <a href="javascript:void(0);" className="dropdown-item">
                  <img
                    src="assets/images/flags/russia.jpg"
                    alt="user-image"
                    className="me-1"
                    height="12"
                  />{" "}
                  <span className="align-middle">Russian</span>
                </a>
              </div>
            </li>

            <li className="dropdown notification-list topbar-dropdown">
              <a
                className="nav-link dropdown-toggle waves-effect waves-light"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="false"
                aria-expanded="false"
              >
                <i className="fe-bell noti-icon"></i>
              </a>
              <div className="dropdown-menu dropdown-menu-end dropdown-lg">
                <div className="dropdown-item noti-title">
                  <h5 className="m-0">
                    <span className="float-end">
                      <a href="" className="text-dark">
                        <small>Clear All</small>
                      </a>
                    </span>
                    Notification
                  </h5>
                </div>

                <div className="noti-scroll" data-simplebar>
                  <a
                    href="javascript:void(0);"
                    className="dropdown-item notify-item active"
                  >
                    <div className="notify-icon">
                      <img
                        src="assets/images/users/user-1.jpg"
                        className="img-fluid rounded-circle"
                        alt=""
                      />{" "}
                    </div>
                    <p className="notify-details">Cristina Pride</p>
                    <p className="text-muted mb-0 user-msg">
                      <small>
                        Hi, How are you? What about our next meeting
                      </small>
                    </p>
                  </a>

                  <a
                    href="javascript:void(0);"
                    className="dropdown-item notify-item"
                  >
                    <div className="notify-icon bg-primary">
                      <i className="mdi mdi-comment-account-outline"></i>
                    </div>
                    <p className="notify-details">
                      Caleb Flakelar commented on Admin
                      <small className="text-muted">1 min ago</small>
                    </p>
                  </a>

                  <a
                    href="javascript:void(0);"
                    className="dropdown-item notify-item"
                  >
                    <div className="notify-icon">
                      <img
                        src="assets/images/users/user-4.jpg"
                        className="img-fluid rounded-circle"
                        alt=""
                      />{" "}
                    </div>
                    <p className="notify-details">Karen Robinson</p>
                    <p className="text-muted mb-0 user-msg">
                      <small>
                        Wow ! this admin looks good and awesome design
                      </small>
                    </p>
                  </a>

                  <a
                    href="javascript:void(0);"
                    className="dropdown-item notify-item"
                  >
                    <div className="notify-icon bg-warning">
                      <i className="mdi mdi-account-plus"></i>
                    </div>
                    <p className="notify-details">
                      New user registered.
                      <small className="text-muted">5 hours ago</small>
                    </p>
                  </a>

                  <a
                    href="javascript:void(0);"
                    className="dropdown-item notify-item"
                  >
                    <div className="notify-icon bg-info">
                      <i className="mdi mdi-comment-account-outline"></i>
                    </div>
                    <p className="notify-details">
                      Caleb Flakelar commented on Admin
                      <small className="text-muted">4 days ago</small>
                    </p>
                  </a>

                  <a
                    href="javascript:void(0);"
                    className="dropdown-item notify-item"
                  >
                    <div className="notify-icon bg-secondary">
                      <i className="mdi mdi-heart"></i>
                    </div>
                    <p className="notify-details">
                      Carlos Crouch liked
                      <b>Admin</b>
                      <small className="text-muted">13 days ago</small>
                    </p>
                  </a>
                </div>

                <a
                  href="javascript:void(0);"
                  className="dropdown-item text-center text-primary notify-item notify-all"
                >
                  View all
                  <i className="fe-arrow-right"></i>
                </a>
              </div>
            </li>

            <li className="dropdown notification-list topbar-dropdown">
              <a
                className="nav-link dropdown-toggle nav-user me-0 waves-effect waves-light"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="false"
                aria-expanded="false"
              >
                <img
                  src="assets/images/users/user-1.jpg"
                  alt="user-image"
                  className="rounded-circle"
                />
                <span className="pro-user-name ms-1">
                  Geneva <i className="mdi mdi-chevron-down"></i>
                </span>
              </a>
              <div className="dropdown-menu dropdown-menu-end profile-dropdown ">
                <div className="dropdown-header noti-title">
                  <h6 className="text-overflow m-0">Welcome !</h6>
                </div>

                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item"
                >
                  <i className="fe-user"></i>
                  <span>My Account</span>
                </a>

                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item"
                >
                  <i className="fe-settings"></i>
                  <span>Settings</span>
                </a>

                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item"
                >
                  <i className="fe-lock"></i>
                  <span>Lock Screen</span>
                </a>

                <div className="dropdown-divider"></div>

                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item"
                >
                  <i className="fe-log-out"></i>
                  <span>Logout</span>
                </a>
              </div>
            </li>
          </ul> */}

            {/* <IconButton color="inherit">
            <Language style={{ color: "#949eaa" }} />
          </IconButton>
          <IconButton color="inherit">
            <Notifications style={{ color: "#949eaa" }} />
          </IconButton>
          <Stack
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              spacing: 1,
              flexDirection: "row",
            }}
            onClick={handleMenuOpen}
          >
            <IconButton color="inherit">
              <Avatar
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User"
                style={{ width: "32px", height: "32px" }}
              />
            </IconButton>{" "}
            <Typography
              variant="body1"
              style={{
                color: "white",
                marginLeft: "8px",
                fontSize: isSmallScreen ? "12px" : "14px",
              }}
            >
              John Doe
            </Typography>
            {anchorEl ? <ArrowDropUp /> : <ArrowDropDown />}
          </Stack>

          <MuiMenu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{
              style: {
                width: "150px",
                borderRadius: "10px",
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
              },
            }}
            // position
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MuiMenu>
        </div>*/}
            <div className=" navbar-custom">
              <ul className="list-unstyled topnav-menu float-end mb-0 ">
                {/* <li className="d-none d-lg-block ">
                  <form className="app-search">
                    <div className="app-search-box dropdown">
                      <div
                        className="input-group"
                        onClick={() => setActiveMenu("search")}
                      >
                        <input
                          type="search"
                          className="form-control"
                          placeholder="Search..."
                          id="top-search"
                        />
                        <button className="btn input-group-text" type="submit">
                          <i className="fe-search"></i>
                        </button>
                      </div>
                      <div
                        className="dropdown-menu dropdown-lg"
                        style={{
                          display: activeMenu === "search" ? "block" : "none",
                          backgroundColor: "#ffffff",
                        }}
                        id="search-dropdown"
                      >
                        <div className="dropdown-header noti-title">
                          <h5 className="text-overflow mb-2">Found 22 results</h5>
                        </div>

                        <a
                          href="javascript:void(0);"
                          className="dropdown-item notify-item"
                        >
                          <i className="fe-home me-1"></i>
                          <span>Analytics Report</span>
                        </a>

                        <a
                          href="javascript:void(0);"
                          className="dropdown-item notify-item"
                        >
                          <i className="fe-aperture me-1"></i>
                          <span>How can I help you?</span>
                        </a>

                        <a
                          href="javascript:void(0);"
                          className="dropdown-item notify-item"
                        >
                          <i className="fe-settings me-1"></i>
                          <span>User profile settings</span>
                        </a>

                        <div className="dropdown-header noti-title">
                          <h6 className="text-overflow mb-2 text-uppercase">
                            Users
                          </h6>
                        </div>

                        <div className="notification-list">
                          <a
                            href="javascript:void(0);"
                            className="dropdown-item notify-item"
                          >
                            <div className="d-flex align-items-start">
                              <img
                                className="d-flex me-2 rounded-circle"
                                src="assets/images/users/user-2.jpg"
                                alt="Generic placeholder image"
                                height="32"
                              />
                              <div className="w-100">
                                <h5 className="m-0 font-14">Erwin E. Brown</h5>
                                <span className="font-12 mb-0">UI Designer</span>
                              </div>
                            </div>
                          </a>

                          <a
                            href="javascript:void(0);"
                            className="dropdown-item notify-item"
                          >
                            <div className="d-flex align-items-start">
                              <img
                                className="d-flex me-2 rounded-circle"
                                src="assets/images/users/user-5.jpg"
                                alt="Generic placeholder image"
                                height="32"
                              />
                              <div className="w-100">
                                <h5 className="m-0 font-14">Jacob Deo</h5>
                                <span className="font-12 mb-0">Developer</span>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </form>
                </li> */}

                <li className="dropdown d-none d-lg-inline-block topbar-dropdown tour-step-9">
                  <a className="nav-link dropdown-toggle">
                    <span>
                      Upgrade to unlock advanced features!{" "}
                      <b
                        style={{ color: "#ff999e", cursor: "pointer" }}
                        onClick={() => navigate("/see-plan")}
                      >
                        See Plans
                      </b>
                    </span>
                  </a>
                </li>

                {/* <li className="dropdown d-inline-block d-lg-none">
                  <a
                    className="nav-link dropdown-toggle arrow-none waves-effect waves-light"
                    data-bs-toggle="dropdown"
                    href="#"
                    role="button"
                    aria-haspopup="false"
                    aria-expanded="false"
                  >
                    <i className="fe-search -notiicon"></i>
                  </a>
                  <div className="dropdown-menu dropdown-lg dropdown-menu-end p-0">
                    <form className="p-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                        aria-label="Recipient's username"
                      />
                    </form>
                  </div>
                </li> */}

                {/* <li className="dropdown notification-list topbar-dropdown">
                  <a
                    className={
                      "nav-link dropdown-toggle waves-effect waves-light" +
                      (activeMenu === "notification" ? " show" : "")
                    }
                    data-bs-toggle="dropdown"
                    href="#"
                    role="button"
                    aria-haspopup="false"
                    aria-expanded="false"
                    onClick={() => setActiveMenu("notification")}
                  >
                    <i className="fe-refresh-cw me-1"></i>
                    <span>What’s New</span>
                    <i className="mdi mdi-chevron-down"></i>
                  </a>
                  <div
                    className={
                      "dropdown-menu dropdown-menu-end dropdown-lg" +
                      (activeMenu === "notification" ? " show" : "")
                    }
                    style={{
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <div className="dropdown-item noti-title">
                      <h5 className="m-0">
                        <span className="float-end">
                          <a href="" className="text-dark">
                            <small>Clear All</small>
                          </a>
                        </span>
                        Latest Updates
                      </h5>
                    </div>

                    <div className="noti-scroll" data-simplebar>
                      <a
                        href="javascript:void(0);"
                        className="dropdown-item notify-item active"
                      >
                        <div className="notify-icon">
                          <img
                            src="assets/images/users/user-1.jpg"
                            className="img-fluid rounded-circle"
                            alt=""
                          />{" "}
                        </div>
                        <p className="notify-details">Cristina Pride</p>
                        <p className="text-muted mb-0 user-msg">
                          <small>
                            Hi, How are you? What about our next meeting
                          </small>
                        </p>
                      </a>

                      <a
                        href="javascript:void(0);"
                        className="dropdown-item notify-item"
                      >
                        <div className="notify-icon bg-primary">
                          <i className="mdi mdi-comment-account-outline"></i>
                        </div>
                        <p className="notify-details">
                          Caleb Flakelar commented on Admin
                          <small className="text-muted">1 min ago</small>
                        </p>
                      </a>

                      <a
                        href="javascript:void(0);"
                        className="dropdown-item notify-item"
                      >
                        <div className="notify-icon">
                          <img
                            src="assets/images/users/user-4.jpg"
                            className="img-fluid rounded-circle"
                            alt=""
                          />{" "}
                        </div>
                        <p className="notify-details">Karen Robinson</p>
                        <p className="text-muted mb-0 user-msg">
                          <small>
                            Wow ! this admin looks good and awesome design
                          </small>
                        </p>
                      </a>

                      {/* <!-- item--> */}
                {/* <a
                        href="javascript:void(0);"
                        className="dropdown-item notify-item"
                      >
                        <div className="notify-icon bg-warning">
                          <i className="mdi mdi-account-plus"></i>
                        </div>
                        <p className="notify-details">
                          New user registered.
                          <small className="text-muted">5 hours ago</small>
                        </p>
                      </a>

                      {/* <!-- item--> */}
                {/* <a
                        href="javascript:void(0);"
                        className="dropdown-item notify-item"
                      >
                        <div className="notify-icon bg-info">
                          <i className="mdi mdi-comment-account-outline"></i>
                        </div>
                        <p className="notify-details">
                          Caleb Flakelar commented on Admin
                          <small className="text-muted">4 days ago</small>
                        </p>
                      </a> */}

                {/* <a
                        href="javascript:void(0);"
                        className="dropdown-item notify-item"
                      >
                        <div className="notify-icon bg-secondary">
                          <i className="mdi mdi-heart"></i>
                        </div>
                        <p className="notify-details">
                          Carlos Crouch liked
                          <b>Admin</b>
                          <small className="text-muted">13 days ago</small>
                        </p>
                      </a> */}
                {/* </div>

                    <a
                      href="javascript:void(0);"
                      className="dropdown-item text-center text-primary notify-item notify-all"
                    >
                      View all
                      <i className="fe-arrow-right"></i>
                    </a>
                  </div>
                </li> */}
                <li className="dropdown d-none d-xl-block">
                  <a
                    className={
                      "tour-step-10 nav-link dropdown-toggle waves-effect waves-light" +
                      (activeMenu === "language" ? " show" : "")
                    }
                    data-bs-toggle="dropdown"
                    href="#"
                    role="button"
                    aria-haspopup="false"
                    aria-expanded="false"
                    onClick={() => setActiveMenu("language")}
                  >
                    <i className="fe-headphones me-1"></i>
                    <span>Help & Support</span>
                    <i className="mdi mdi-chevron-down"></i>
                  </a>
                  <div
                    className={
                      "dropdown-menu" +
                      (activeMenu === "language" ? " show" : "")
                    }
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    {/* <!-- item--> */}
                    <a
                      className="dropdown-item"
                      href={`${
                        import.meta.env.VITE_JARVIS_MARKETING_HELP
                      }/help-center`}
                      target="_blank"
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <i className="fe-headphones me-1"></i>
                      <span>Help & Support</span>
                    </a>

                    {/* <!-- item--> */}
                    {/* <a href="javascript:void(0);" className="dropdown-item">
                      <i className="fe-user me-1"></i>
                      <span>Contact Support</span>
                    </a> */}

                    {/* <!-- item--> */}
                    {/* <a href="feedback.html" className="dropdown-item">
                      <i className="fe-settings me-1"></i>
                      <span>Send Feedback</span>
                    </a> */}
                  </div>
                </li>

                <li
                  className="dropdown notification-list topbar-dropdown tour-step-11"
                  // style={{
                  //   marginRight: "50px",
                  // }}
                >
                  <a
                    className={
                      " nav-link dropdown-toggle nav-user me-0 waves-effect waves-light " +
                      (activeMenu === "user" ? " show" : "")
                    }
                    data-bs-toggle="dropdown"
                    href="#"
                    role="button"
                    aria-haspopup="false"
                    aria-expanded="false"
                    onClick={() => setActiveMenu("user")}
                  >
                    <img
                      src={
                        avatar
                          ? avatar
                          : auth?.result?.avatar &&
                            auth?.result?.avatar?.includes("https") &&
                            !auth?.result?.avatar?.includes("http")
                          ? auth?.result?.avatar
                          : initialValues?.avatar
                          ? initialValues?.avatar
                          : auth?.result?.role === "admin"
                          ? "/assets/images/logo/mobile-logo.png"
                          : "https://th.bing.com/th/id/OIP.ljBLaDP1KJQO9u9oy22EUwAAAA?rs=1&pid=ImgDetMain"
                      }
                      alt="user-image"
                      className="rounded-circle "
                    />
                    <span
                      className="pro-user-name ms-2 
                     
                    "
                      style={{
                        height: "30px",
                        width: "100px",
                      }}
                    >
                      {initialValues?.firstName ? (
                        <span>{initialValues?.firstName}</span>
                      ) : auth?.result && auth?.result?.firstName ? (
                        <span>{auth?.result?.firstName}</span>
                      ) : auth?.result ? (
                        auth?.result?.firstName
                      ) : (
                        "John Doe"
                      )}
                      <i
                        className="mdi mdi-chevron-down "
                        style={{
                          color: "#949eaa",
                          marginLeft: "5px",
                        }}
                      ></i>
                    </span>
                  </a>
                  <div
                    className={
                      "dropdown-menu dropdown-menu-end profile-dropdown " +
                      (activeMenu === "user" ? " show" : "")
                    }
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    {/* <!-- item--> */}
                    <div className="dropdown-header noti-title">
                      <h6 className="text-overflow m-0">
                        {auth?.result ? auth?.result?.email : "John Doe"}
                      </h6>
                    </div>

                    {/* <!-- item--> */}
                    {/* {auth?.result?.role !== "admin" && (
                      <a
                        className="dropdown-item notify-item"
                        onClick={() => navigate("/team")}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <i className="fe-user"></i>
                        <span>Team</span>
                      </a>
                    )} */}
                    {/* {auth?.result?.role !== "admin" && (
                      <a
                        className="dropdown-item notify-item"
                        onClick={() => navigate("/integration")}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <i className="fe-maximize-2"></i>
                        <span>Integrations</span>
                      </a>
                    )} */}
                    <a
                      className="dropdown-item notify-item"
                      onClick={() => navigate("/settings")}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <i className="fe-settings"></i>
                      <span>Account Settings</span>
                    </a>
                    {isSmallScreen && (
                      <>
                        <a
                          className="dropdown-item"
                          onClick={() =>
                            (window.location.href = `${
                              import.meta.env.VITE_JARVIS_MARKETING_HELP
                            }/help-center`)
                          }
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <i className="fe-headphones me-1"></i>
                          <span>Help & Support</span>
                        </a>
                        <a className="dropdown-item ">
                          <span>
                            <b
                              style={{ color: "#ff999e", cursor: "pointer" }}
                              onClick={() => navigate("/see-plan")}
                            >
                              See Plans
                            </b>
                          </span>
                        </a>
                      </>
                    )}
                    {/* <!-- item--> */}
                    {auth?.result?.role !== "admin" && (
                      <a
                        className="dropdown-item notify-item"
                        onClick={() => navigate("/subscription")}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <i className="fe-folder"></i>
                        <span>Subscription & Billings</span>
                      </a>
                    )}

                    <div className="dropdown-divider"></div>

                    {/* <!-- item--> */}
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item notify-item"
                      onClick={handleLogout}
                    >
                      <i className="fe-log-out"></i>
                      <span>Logout</span>
                    </a>
                  </div>
                </li>
              </ul>
              {/* <!-- end Topbar --> */}
            </div>
          </div>
        </ClickAwayListener>
      </div>
    </div>
  );
};

export default Topbar;

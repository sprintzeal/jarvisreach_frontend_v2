import { useMediaQuery } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AllRoutes from "../AllRoutes";
import { useCheckDataQuery } from "../slices/customerSlice";
import "./Layout.css"; // Create this CSS file to manage your layout styles
import SideNav from "./mainLayout/SideNav";
import Topbar from "./mainLayout/Topbar";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [folderId, setFolderId] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    organizationName: "",
    timeZone: "Asia/Kolkata",
    avatar: "",
  });

  const {
    data: getUsers,
    isLoading: getUsersLoading,
    isSuccess: getUsersSuccess,
  } = useCheckDataQuery();

  useEffect(() => {
    if (getUsersSuccess) {
      const time = getUsers?.result.location?.country
        ? getUsers?.result.location.country
        : "Asia/Kolkata";

      setInitialValues({
        firstName: getUsers?.result.firstName || "",
        lastName: getUsers?.result.lastName || "",
        organizationName: getUsers?.result.organizationName || "",
        timeZone: time,
        avatar: getUsers?.result.avatar || "",
      });
    }
  }, [getUsersSuccess, getUsers]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  // console.log(folderId, "folderId");

  useEffect(() => {
    if (isSmallScreen) {
      setCollapsed(true);
    }
  }, [isSmallScreen]);

  useEffect(() => {
    const avatar = localStorage.getItem("avatar");
    setAvatar(avatar);
  }, []);

  return (
    <div className="layout-container">
      <Topbar
        collapsed={collapsed}
        toggleCollapse={toggleCollapse}
        avatar={avatar}
        initialValues={initialValues}
      />
      {!isSmallScreen && collapsed ? (
        <SideNav
          collapsed={collapsed}
          toggleCollapse={toggleCollapse}
          setFolderId={setFolderId}
        />
      ) : (
        !collapsed && (
          <SideNav
            collapsed={collapsed}
            toggleCollapse={toggleCollapse}
            setFolderId={setFolderId}
          />
        )
      )}
      <div className={`main-content ${collapsed ? "collapsed" : ""}  `}>
        <div className="outlet-content">
          <AllRoutes collapsed={collapsed} folderId={folderId} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

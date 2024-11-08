import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import Customer from "./Pages/dashboard/Customer";
import Dashboard from "./Pages/dashboard/Dashboard";
import DataManager from "./Pages/dashboard/DataManager";
import Plan from "./Pages/dashboard/Plan";
import BlogCategory from "./Pages/dashboard/blog/BlogCategory.jsx";
import BlogList from "./Pages/dashboard/blog/BlogList.jsx";
import HelpCategory from "./Pages/dashboard/help/HelpCategory.jsx";
import HelpList from "./Pages/dashboard/help/HelpList.jsx";
import PackageFeatures from "./Pages/dashboard/plans/PackageFeatures";
import Packages from "./Pages/dashboard/plans/Packages";
import EmailVerifier from "./Pages/users/EmailVerifier";
import Enrichment from "./Pages/users/Enrichment";
import Exports from "./Pages/users/Exports";
import Home from "./Pages/users/Home.jsx";
import Plans from "./Pages/users/Plan";
import Subscription from "./Pages/users/Subscription";
import UserDashboard from "./Pages/users/UserDashboard";
import ComposeEmail from "./Pages/users/lead manager/ComposeEmail.jsx";
import LeadStatus from "./Pages/users/lead manager/LeadStatus.jsx";
import SMTPSettings from "./Pages/users/lead manager/SMTPSettings.jsx";
import SequenceList from "./Pages/users/lead manager/SequenceList.jsx";
import SequenceTemplate from "./Pages/users/lead manager/SequenceTemplate";
import AccountSettings from "./sections/settings/AccountSettings";
import Integration from "./sections/settings/Integration";
import { logout } from "./slices/authSlice.js";
import { useCheckDataQuery } from "./slices/customerSlice.js";
import { sendMessageToExtension } from "./utils/timeAgo";
import { userInfoData } from "./slices/userDataSlice.js";

const AllRoutes = ({ collapsed, folderId }) => {
  const [userInfor, setUserInfor] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: getUsers,
    isLoading: getUsersLoading,
    isSuccess: getUsersSuccess,
    isError: getUsersError,
    error: getUsersErrorData,
    isFetching: getUsersFetching,
  } = useCheckDataQuery();

  const { auth } = useSelector((state) => state.auth);
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    organizationName: "",
    timeZone: "",
    avatar: "",
  });
  const [initialValuesEmail, setInitialValuesEmail] = useState({
    newEmail: "",
    newEmailChange: "",
    newConfirmEmailChange: "",
  });

  useEffect(() => {
    const url = window.location.pathname;
    const urlArray = url.split("/");
    const id = urlArray[2];
    const token = urlArray[4];
    // check if params includes resetPassword then redirect to reset password page
    if (url.includes("resetPassword")) {
      sessionStorage.setItem("resetPassword", JSON.stringify({ id, token }));
      window.location.href = "/confirm-password";
    }
    if (auth) {
      setUserInfor(auth);
      sendMessageToExtension({
        apiToken: auth.result.token,
      });
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (getUsersFetching || getUsersSuccess) {
      const time = getUsers?.result.location?.country
        ? getUsers?.result.location.country
        : "Asia/Kolkata";
      dispatch(userInfoData(getUsers?.result));
      setInitialValues({
        firstName: getUsers?.result.firstName || "",
        lastName: getUsers?.result.lastName || "",
        organizationName: getUsers?.result.organizationName || "",
        timeZone: getUsers?.result.timeZone || time,
        avatar: getUsers?.result.avatar || "",
      });
      setInitialValuesEmail({
        newEmail: getUsers?.result.email || "",
      });
    } else if (
      !getUsersFetching &&
      !getUsersLoading &&
      !getUsersSuccess &&
      getUsersErrorData?.data?.message === "user deleted"
    ) {
      dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("auth");
      localStorage.removeItem("avatar");
      sendMessageToExtension({
        type: "logout",
      });
      navigate("/login");
      toast.error("User not found, Please login or register again");
    }
  }, [getUsersSuccess, getUsersErrorData, getUsersFetching]);

  // useEffect(() => {
  //   if (auth) {
  //     if (auth.result.role === "admin") {
  //       // navigate("/dashboard");
  //     } else if (
  //       auth.result.role !== "admin" &&
  //       window.location.pathname === "/"
  //     ) {
  //       navigate("/folder");
  //     }
  //   }
  // }, [auth, navigate]);

  // useEffect(() => {
  //   fetch("https://ipapi.co/json/")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("IP Geolocation data:", data);
  //     })
  //     .catch((error) =>
  //       console.error("Error fetching IP geolocation data:", error)
  //     );
  // }, []);

  if (auth === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <Routes>
      {auth.result.role === "admin" ? (
        <>
          <Route
            path="/dashboard"
            element={<Dashboard collapsed={collapsed} />}
          />
          <Route
            path="/customer"
            element={<Customer collapsed={collapsed} />}
          />
          <Route path="/plan" element={<Plan collapsed={collapsed} />} />
          <Route
            path="/package"
            element={<Packages collapsed={collapsed} folderId={folderId} />}
          />
          <Route
            path="/package-features"
            element={<PackageFeatures collapsed={collapsed} />}
          />

          <Route
            path="/data-manager"
            element={<DataManager collapsed={collapsed} folderId={folderId} />}
          />
          <Route
            path="/settings"
            element={
              <AccountSettings
                collapsed={collapsed}
                initialValues={initialValues}
                initialValuesEmail={initialValuesEmail}
              />
            }
          />
          <Route
            path="/blog-category"
            element={<BlogCategory collapsed={collapsed} />}
          />
          <Route
            path="/blog-list"
            element={<BlogList collapsed={collapsed} />}
          />
          <Route
            path="/help-category"
            element={<HelpCategory collapsed={collapsed} />}
          />
          <Route
            path="/help-list"
            element={<HelpList collapsed={collapsed} />}
          />
          <Route path="/see-plan" element={<Plans collapsed={collapsed} />} />
        </>
      ) : auth.result.role === "customer" ||
        auth.result.role === "teammember" ? (
        <>
          <Route
            path="/folder"
            element={
              <UserDashboard collapsed={collapsed} folderId={folderId} />
            }
          />
          <Route
            path="/folder/email-verifier"
            element={<EmailVerifier collapsed={collapsed} />}
          />
          <Route
            path="/settings"
            element={
              <AccountSettings
                collapsed={collapsed}
                initialValues={initialValues}
                initialValuesEmail={initialValuesEmail}
              />
            }
          />
          <Route
            path="/enrichment"
            element={<Enrichment collapsed={collapsed} />}
          />
          <Route path="/export" element={<Exports collapsed={collapsed} />} />
          {/* <Route path="/team" element={<Team collapsed={collapsed} />} /> */}
          <Route
            path="/integration"
            element={<Integration collapsed={collapsed} />}
          />
          <Route
            path="/subscription"
            element={<Subscription collapsed={collapsed} />}
          />
          <Route path="/see-plan" element={<Plans collapsed={collapsed} />} />
          <Route
            path="/sequence"
            element={<SequenceTemplate collapsed={collapsed} />}
          />
          <Route
            path="/compose-email"
            element={<ComposeEmail collapsed={collapsed} />}
          />
          <Route
            path="/smtp"
            element={<SMTPSettings collapsed={collapsed} />}
          />
          <Route
            path="/sequence-list"
            element={<SequenceList collapsed={collapsed} />}
          />
          <Route
            path="/lead-status"
            element={<LeadStatus collapsed={collapsed} />}
          />
          <Route path="/home" element={<Home collapsed={collapsed} />} />
        </>
      ) : (
        <Navigate to="/login" />
      )}
    </Routes>
  );
};

export default AllRoutes;

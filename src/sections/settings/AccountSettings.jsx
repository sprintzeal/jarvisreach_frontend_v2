import React, { useEffect, useState } from "react";
import { FaFilePen } from "react-icons/fa6";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  useCheckDataQuery,
  useDeleteAccountMutation,
  useDeleteGoogleAccountMutation,
  useEditEmailMutation,
  useEditPasswordMutation,
  useEditUserMutation,
  useRestAccountMutation,
} from "../../slices/customerSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { logout } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import { useUploadFileMutation } from "../../slices/adminSlice";
import { useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const AccountSettings = ({ collapsed, initialValuesEmail, initialValues }) => {
  const [activeTab, setActiveTab] = useState("edit-profile");
  const { auth } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [updateUser, { isLoading: updateUserLoading }] = useEditUserMutation();
  const [updateEmail, { isLoading: updateEmailLoading }] =
    useEditEmailMutation();
  const [editPassword, { isLoading: editPasswordLoading }] =
    useEditPasswordMutation();
  const [restAccount, { isLoading: restAccountLoading }] =
    useRestAccountMutation();
  const [newChangeEmail, setNewChangeEmail] = useState("");
  const [deleteAccount, { isLoading: deleteAccountLoading }] =
    useDeleteAccountMutation();
  const [openConfirmEmail, setOpenConfirmEmail] = useState(false);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const [uploadFile] = useUploadFileMutation();
  const {
    data: checkData,
    isLoading: checkDataLoading,
    isSuccess: checkDataSuccess,
  } = useCheckDataQuery();
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    organizationName: Yup.string().required("Organization Name is required"),
    timeZone: Yup.string().required("Time Zone is required"),
  });

  const validationSchemaEmail = Yup.object({
    newEmail: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    newEmailChange: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    newConfirmEmailChange: Yup.string()
      .oneOf([Yup.ref("newEmailChange"), ""], "Emails must match")
      .required("Please confirm your new email"),
  });

  const initialValuesPassword = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const initialValuesDelete = {
    password: "",
  };

  const validationSchemaDelete = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const onSubmitDelete = async (values) => {
    try {
      const localStorage = window.localStorage;
      const { password } = values;
      await deleteAccount({ body: { password } }).unwrap();
      sessionStorage.removeItem("auth");
      localStorage.removeItem("auth");
      dispatch(logout());
      navigate("/login");
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error(error.data.message || "Something went wrong");
    }
  };

  const validationSchemaPassword = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), ""], "Passwords must match")
      .required("Please confirm your new password"),
  });

  const initialValuesResetAccount = {
    password: "",
  };

  const validationSchemaResetAccount = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const onSubmitResetAccount = async (values) => {
    try {
      const { password } = values;

      await restAccount({ body: { password } }).unwrap();
      toast.success("Account reset successfully");
    } catch (error) {
      toast.error(error.data.message || "Something went wrong");
    }
  };

  const onSubmitPassword = async (values) => {
    try {
      const { currentPassword, newPassword } = values;

      await editPassword({ body: { currentPassword, newPassword } }).unwrap();
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(error.data.message || "Something went wrong");
    }
  };

  const onSubmitEmail = async (values) => {
    const newEmailChange = values.newEmailChange;
    setNewChangeEmail(newEmailChange);
    const localStorage = window.localStorage;

    try {
      const res = await updateEmail({
        body: {
          newEmail: values.newEmailChange,
        },
      }).unwrap();
      // update email in local storage auth.result.email
      localStorage.setItem(
        "auth",
        JSON.stringify({ ...auth, email: values.newEmail })
      );
      sessionStorage.removeItem("auth");
      localStorage.removeItem("auth");
      dispatch(logout());
      navigate("/login");
      console.log("resssssss", res);
      toast.success(res.message || "Email updated successfully");
      setOpenConfirmEmail(false);
    } catch (error) {
      toast.error(error.data.message || "Something went wrong");
    }
  };

  const onClear = (resetForm) => {
    resetForm();
  };

  const onSubmit = async (values) => {
    if (file) {
      const formData = new FormData();
      formData.append("files", file[0]);
      localStorage.setItem("avatar", URL.createObjectURL(file[0]));
      try {
        const res = await uploadFile({
          folder: "avatar",
          file: formData,
        }).unwrap();
        values.avatar = res.files[0].url;
        localStorage.setItem("avatar", res.files[0].url);
        toast.success("File uploaded successfully");
      } catch (error) {
        console.log(error);
        toast.error(error.data.message || "Something went wrong");
      }
    }
    try {
      await updateUser({ body: values }).unwrap();

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.data.message || "Something went wrong");
    }
  };
  const [deleteGooleAccount, { isLoading: deleteGooleAccountLoading }] =
    useDeleteGoogleAccountMutation();

  const onSubmitGoogleLogin = async () => {
    const id = auth?.result?._id;
    const localStorage = window.localStorage;
    try {
      await deleteGooleAccount(id).unwrap();
      localStorage.removeItem("auth");
      dispatch(logout());
      navigate("/login");
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error(error.data.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (onSubmitDelete.isSuccess || deleteGooleAccount.isSuccess) {
      localStorage.removeItem("auth");
      navigate("/login");
    }
  }, [onSubmitDelete.isSuccess, deleteGooleAccount.isSuccess]);
  const [localAvatar, setLocalAvatar] = useState(
    localStorage.getItem("avatar")
  );
  const handleFile = (e) => {
    const file = Array.from(e.target.files);
    setFile(file);
    localStorage.setItem("avatar", URL.createObjectURL(file[0]));
  };

  const GMT = [
    { label: "GMT-12:00", value: "GMT-12:00" },
    { label: "GMT-11:00", value: "GMT-11:00" },
    { label: "GMT-10:00", value: "GMT-10:00" },
    { label: "GMT-09:00", value: "GMT-09:00" },
    { label: "GMT-08:00", value: "GMT-08:00" },
    { label: "GMT-07:00", value: "GMT-07:00" },
    { label: "GMT-06:00", value: "GMT-06:00" },
    { label: "GMT-05:00", value: "GMT-05:00" },
    { label: "GMT-04:00", value: "GMT-04:00" },
    { label: "GMT-03:00", value: "GMT-03:00" },
    { label: "GMT-02:00", value: "GMT-02:00" },
    { label: "GMT-01:00", value: "GMT-01:00" },
    { label: "GMT+00:00", value: "GMT+00:00" },
    { label: "GMT+01:00", value: "GMT+01:00" },
    { label: "GMT+02:00", value: "GMT+02:00" },
    { label: "GMT+03:00", value: "GMT+03:00" },
    { label: "GMT+04:00", value: "GMT+04:00" },
    { label: "GMT+05:00", value: "GMT+05:00" },
    { label: "GMT+06:00", value: "GMT+06:00" },
    { label: "GMT+07:00", value: "GMT+07:00" },
    { label: "GMT+08:00", value: "GMT+08:00" },
    { label: "GMT+09:00", value: "GMT+09:00" },
    { label: "GMT+10:00", value: "GMT+10:00" },
    { label: "GMT+11:00", value: "GMT+11:00" },
    { label: "GMT+12:00", value: "GMT+12:00" },
  ];
  return (
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
                      <a href="javascript: void(0);">Jarvis Reach</a>
                    </li>
                    <li className="breadcrumb-item active">Account Settings</li>
                  </ol>
                </div>
                <h4 className="page-title">Account Settings</h4>
              </div>
            </div>
          </div>
          {/* <!-- end page title -->  */}

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="user-main-sectiom">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="integare-file">
                          <h3>Account Settings </h3>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="card">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-sm-3">
                                <div
                                  className="nav flex-column nav-pills nav-pills-tab"
                                  id="v-pills-tab"
                                  role="tablist"
                                  aria-orientation="vertical"
                                >
                                  <a
                                    className={
                                      "nav-link mb-1" +
                                      (activeTab === "edit-profile"
                                        ? " show active"
                                        : "")
                                    }
                                    id="edit-profile-tab"
                                    data-bs-toggle="pill"
                                    role="tab"
                                    aria-controls="edit-profile"
                                    aria-selected={
                                      activeTab === "edit-profile"
                                        ? "true"
                                        : "false"
                                    }
                                    onClick={() => setActiveTab("edit-profile")}
                                  >
                                    Edit Profile
                                  </a>
                                  <a
                                    className={
                                      "nav-link mb-1" +
                                      (activeTab === "change-email"
                                        ? " show active"
                                        : "")
                                    }
                                    id="change-email-tab"
                                    data-bs-toggle="pill"
                                    role="tab"
                                    aria-controls="change-email"
                                    aria-selected={
                                      activeTab === "change-email"
                                        ? "true"
                                        : "false"
                                    }
                                    onClick={() => setActiveTab("change-email")}
                                  >
                                    Change Email
                                  </a>
                                  <a
                                    className={
                                      "nav-link mb-1" +
                                      (activeTab === "change-password"
                                        ? " show active"
                                        : "")
                                    }
                                    id="change-password-tab"
                                    data-bs-toggle="pill"
                                    role="tab"
                                    aria-controls="change-password"
                                    aria-selected={
                                      activeTab === "change-password"
                                        ? "true"
                                        : "false"
                                    }
                                    onClick={() =>
                                      setActiveTab("change-password")
                                    }
                                  >
                                    Change Password
                                  </a>
                                  <a
                                    className={
                                      "nav-link mb-1" +
                                      (activeTab === "reset-account"
                                        ? " show active"
                                        : "")
                                    }
                                    id="reset-account-tab"
                                    data-bs-toggle="pill"
                                    role="tab"
                                    aria-controls="reset-account"
                                    aria-selected={
                                      activeTab === "reset-account"
                                        ? "true"
                                        : "false"
                                    }
                                    onClick={() =>
                                      setActiveTab("reset-account")
                                    }
                                  >
                                    Reset Account
                                  </a>
                                  {auth?.result?.role !== "admin" && (
                                    <a
                                      className={
                                        "nav-link mb-1" +
                                        (activeTab === "delete-account"
                                          ? " show active"
                                          : "")
                                      }
                                      id="delete-account-tab"
                                      data-bs-toggle="pill"
                                      role="tab"
                                      aria-controls="delete-account"
                                      aria-selected={
                                        activeTab === "delete-account"
                                          ? "true"
                                          : "false"
                                      }
                                      onClick={() =>
                                        setActiveTab("delete-account")
                                      }
                                    >
                                      Delete Account
                                    </a>
                                  )}
                                </div>
                              </div>
                              {/* <!-- end col--> */}
                              <div className="col-sm-9">
                                <div className="tab-content pt-0">
                                  <div
                                    className={
                                      "tab-pane fade" +
                                      (activeTab === "edit-profile"
                                        ? " show active"
                                        : "")
                                    }
                                    style={{
                                      display:
                                        activeTab === "edit-profile"
                                          ? "block"
                                          : "none",
                                    }}
                                    id="edit-profile"
                                    role="tabpanel"
                                    aria-labelledby="edit-profile-tab"
                                  >
                                    <Formik
                                      initialValues={initialValues}
                                      validationSchema={validationSchema}
                                      onSubmit={onSubmit}
                                      enableReinitialize // Add this prop
                                    >
                                      {({ errors, touched }) => (
                                        <Form>
                                          <div className="row">
                                            <div className="col-md-4 mb-3">
                                              <label
                                                htmlFor="firstName"
                                                className="form-label"
                                              >
                                                First Name
                                              </label>
                                              <Field
                                                type="text"
                                                className={`form-control ${
                                                  touched.firstName &&
                                                  errors.firstName
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                                id="firstName"
                                                name="firstName"
                                                placeholder="First Name"
                                              />
                                              {touched.firstName &&
                                              errors.firstName ? (
                                                <div className="invalid-feedback">
                                                  {errors.firstName}
                                                </div>
                                              ) : null}
                                            </div>
                                            <div className="col-md-4 mb-3">
                                              <label
                                                htmlFor="lastName"
                                                className="form-label"
                                              >
                                                Last Name
                                              </label>
                                              <Field
                                                type="text"
                                                className={`form-control ${
                                                  touched.lastName &&
                                                  errors.lastName
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                                id="lastName"
                                                name="lastName"
                                                placeholder="Last Name"
                                              />
                                              {touched.lastName &&
                                              errors.lastName ? (
                                                <div className="invalid-feedback">
                                                  {errors.lastName}
                                                </div>
                                              ) : null}
                                            </div>
                                            <div className="col-md-4 mb-3">
                                              <img
                                                src={
                                                  file &&
                                                  file[0] instanceof File
                                                    ? URL.createObjectURL(
                                                        file[0]
                                                      )
                                                    : initialValues.avatar
                                                    ? initialValues.avatar
                                                    : auth?.result?.role ===
                                                      "admin"
                                                    ? "/assets/images/logo/mobile-logo.png"
                                                    : "https://th.bing.com/th/id/OIP.ljBLaDP1KJQO9u9oy22EUwAAAA?rs=1&pid=ImgDetMain"
                                                }
                                                width="70"
                                                height="70"
                                                alt="User"
                                              />

                                              <button
                                                type="button"
                                                className="btn edit-btn"
                                                onClick={() =>
                                                  document
                                                    .getElementById("file")
                                                    .click()
                                                }
                                              >
                                                <input
                                                  type="file"
                                                  id="file"
                                                  className="file"
                                                  name="avatar"
                                                  onChange={(e) =>
                                                    handleFile(e)
                                                  }
                                                  style={{ display: "none" }}
                                                />
                                                <span>
                                                  <FaFilePen />
                                                </span>
                                              </button>
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="col-md-8 mb-3">
                                              <label
                                                htmlFor="organizationName"
                                                className="form-label"
                                              >
                                                Organization Name
                                              </label>
                                              <Field
                                                type="text"
                                                className={`form-control ${
                                                  touched.organizationName &&
                                                  errors.organizationName
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                                id="organizationName"
                                                name="organizationName"
                                                placeholder="Organization Name"
                                              />
                                              {touched.organizationName &&
                                              errors.organizationName ? (
                                                <div className="invalid-feedback">
                                                  {errors.organizationName}
                                                </div>
                                              ) : null}
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="mb-3 col-md-8">
                                              <label
                                                htmlFor="timeZone"
                                                className="form-label"
                                              >
                                                Time Zone (GMT)
                                              </label>
                                              <Field
                                                as="select"
                                                id="timeZone"
                                                name="timeZone"
                                                className={`form-select ${
                                                  touched.timeZone &&
                                                  errors.timeZone
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                              >
                                                {GMT.map((item, index) => (
                                                  <option
                                                    key={index}
                                                    value={item.value}
                                                  >
                                                    {item.label}
                                                  </option>
                                                ))}
                                              </Field>
                                              {touched.timeZone &&
                                              errors.timeZone ? (
                                                <div className="invalid-feedback">
                                                  {errors.timeZone}
                                                </div>
                                              ) : null}
                                            </div>
                                          </div>
                                          <button
                                            type="submit"
                                            className="btn btn-dark waves-effect waves-light"
                                            disabled={updateUserLoading}
                                          >
                                            Save
                                          </button>
                                        </Form>
                                      )}
                                    </Formik>{" "}
                                  </div>
                                  <div
                                    className={
                                      "tab-pane fade" +
                                      (activeTab === "change-email"
                                        ? " show active"
                                        : "")
                                    }
                                    style={{
                                      display:
                                        activeTab === "change-email"
                                          ? "block"
                                          : "none",
                                    }}
                                    id="change-email"
                                    role="tabpanel"
                                    aria-labelledby="change-email-tab"
                                  >
                                    <Formik
                                      initialValues={initialValuesEmail}
                                      enableReinitialize={true}
                                      validationSchema={validationSchemaEmail}
                                      onSubmit={onSubmitEmail}
                                    >
                                      {({
                                        values,
                                        errors,
                                        touched,
                                        resetForm,
                                      }) => (
                                        <Form>
                                          <div className="row">
                                            <div className="col-md-8 mb-3">
                                              <label
                                                htmlFor="newEmail"
                                                className="form-label"
                                              >
                                                Current Email
                                              </label>
                                              <Field
                                                type="newEmail"
                                                className={`form-control ${
                                                  touched.newEmail &&
                                                  errors.newEmail
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                                id="newEmail"
                                                name="newEmail"
                                                placeholder="John@example.com"
                                                disabled
                                                style={{
                                                  cursor: "not-allowed",
                                                  color: "#b3b3b3",
                                                }}
                                              />
                                              <ErrorMessage
                                                name="newEmail"
                                                component="div"
                                                className="invalid-feedback"
                                              />
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="col-md-8 mb-3">
                                              <label
                                                htmlFor="newEmailChange"
                                                className="form-label"
                                              >
                                                New Email
                                              </label>
                                              <Field
                                                type="newEmailChange"
                                                className={`form-control ${
                                                  touched.newEmailChange &&
                                                  errors.newEmailChange
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                                id="newEmailChange"
                                                name="newEmailChange"
                                                placeholder="John@example.com"
                                              />
                                              <ErrorMessage
                                                name="newEmailChange"
                                                component="div"
                                                className="invalid-feedback"
                                              />
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="col-md-8 mb-3">
                                              <label
                                                htmlFor="newConfirmEmailChange"
                                                className="form-label"
                                              >
                                                Confirm New Email
                                              </label>
                                              <Field
                                                type="newConfirmEmailChange"
                                                className={`form-control ${
                                                  touched.newConfirmEmailChange &&
                                                  errors.newConfirmEmailChange
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                                id="newConfirmEmailChange"
                                                name="newConfirmEmailChange"
                                                placeholder="John@example.com"
                                              />
                                              <ErrorMessage
                                                name="newConfirmEmailChange"
                                                component="div"
                                                className="invalid-feedback"
                                              />
                                            </div>
                                          </div>
                                          {/* <button
                                            type="reset"
                                            className="btn btn-secondary waves-effect waves-light"
                                            style={{ marginRight: "10px" }}
                                            onClick={() => {
                                              // Clear the form
                                              resetForm();
                                            }}
                                            disabled={
                                              (!values?.newEmailChange &&
                                                !values?.newConfirmEmailChange) ||
                                              values?.newEmailChange !==
                                                initialValuesEmail.newEmail
                                            }
                                          >
                                            Clear
                                          </button> */}
                                          <button
                                            className="btn btn-dark waves-effect waves-light"
                                            onClick={() =>
                                              setOpenConfirmEmail(true)
                                            }
                                            type="button"
                                            disabled={
                                              values?.newEmailChange !==
                                              values?.newConfirmEmailChange
                                            }
                                          >
                                            Save
                                          </button>
                                          <Dialog
                                            open={openConfirmEmail}
                                            onClose={() =>
                                              setOpenConfirmEmail(false)
                                            }
                                            aria-labelledby="alert-dialog-title"
                                          >
                                            <DialogTitle id="alert-dialog-title">
                                              {"Confirm Email Change"}
                                            </DialogTitle>
                                            <DialogContent>
                                              <DialogContentText id="alert-dialog-description">
                                                Your email{" "}
                                                <em
                                                  style={{
                                                    color: "#ff6a69",
                                                    fontWeight: "bold",
                                                  }}
                                                >
                                                  {initialValuesEmail.newEmail}
                                                </em>{" "}
                                                will be changed to{" "}
                                                <em
                                                  style={{
                                                    color: "#ff6a69",
                                                    fontWeight: "bold",
                                                  }}
                                                >
                                                  {values?.newEmailChange ||
                                                    newChangeEmail}
                                                </em>
                                                , you'll shortly receive an
                                                email to verify your new email
                                                address.
                                                <br />
                                                you'll need to verify your new
                                                email address. If you entered
                                                incorrect email, you'll be
                                                unable to login to your account.
                                                Are you sure you want to change
                                                your email?
                                              </DialogContentText>
                                              {/* note */}
                                              <DialogContentText
                                                id="alert-dialog-description"
                                                style={{
                                                  color: "#4d4d4d",
                                                  fontWeight: "bold",
                                                  fontSize: "12px",
                                                  marginTop: "30px",
                                                }}
                                              >
                                                Note: After confirming your new
                                                email, you will be logged out
                                                and need to login again with
                                                your new verified email.
                                              </DialogContentText>
                                            </DialogContent>
                                            <div className="text-end pl-4 mt-2">
                                              <DialogActions>
                                                <Button
                                                  variant="text"
                                                  color="error"
                                                  onClick={() => {
                                                    setOpenConfirmEmail(false);
                                                  }}
                                                >
                                                  Cancel
                                                </Button>
                                                <Button
                                                  variant="text"
                                                  color="primary"
                                                  onClick={() => {
                                                    onSubmitEmail(values);
                                                  }}
                                                  type="submit"
                                                  disabled={updateEmailLoading}
                                                >
                                                  {updateEmailLoading ? (
                                                    <span
                                                      className="spinner-border spinner-border-sm"
                                                      role="status"
                                                      aria-hidden="true"
                                                    ></span>
                                                  ) : (
                                                    "Confirm"
                                                  )}
                                                </Button>
                                              </DialogActions>
                                            </div>
                                          </Dialog>
                                        </Form>
                                      )}
                                    </Formik>
                                  </div>
                                  <div
                                    className={
                                      "tab-pane fade" +
                                      (activeTab === "change-password"
                                        ? " show active"
                                        : "")
                                    }
                                    style={{
                                      display:
                                        activeTab === "change-password"
                                          ? "block"
                                          : "none",
                                    }}
                                    id="change-password"
                                    role="tabpanel"
                                    aria-labelledby="change-password-tab"
                                  >
                                    <Formik
                                      initialValues={initialValuesPassword}
                                      enableReinitialize={true}
                                      validationSchema={
                                        validationSchemaPassword
                                      }
                                      onSubmit={onSubmitPassword}
                                    >
                                      {({ errors, touched }) => (
                                        <Form>
                                          <div className="row">
                                            <div className="col-md-8 mb-3">
                                              <label
                                                htmlFor="currentPassword"
                                                className="form-label"
                                              >
                                                Current password
                                              </label>
                                              <Field
                                                type="password"
                                                className={`form-control ${
                                                  touched.currentPassword &&
                                                  errors.currentPassword
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                                id="currentPassword"
                                                name="currentPassword"
                                                placeholder="Type your Current password"
                                              />
                                              <ErrorMessage
                                                name="currentPassword"
                                                component="div"
                                                className="invalid-feedback"
                                              />
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="col-md-8 mb-3">
                                              <label
                                                htmlFor="newPassword"
                                                className="form-label"
                                              >
                                                Password
                                              </label>
                                              <Field
                                                type="password"
                                                className={`form-control ${
                                                  touched.newPassword &&
                                                  errors.newPassword
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                                id="newPassword"
                                                name="newPassword"
                                                placeholder="Type your new password"
                                              />
                                              <ErrorMessage
                                                name="newPassword"
                                                component="div"
                                                className="invalid-feedback"
                                              />
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="col-md-8 mb-3">
                                              <label
                                                htmlFor="confirmPassword"
                                                className="form-label"
                                              >
                                                Retype your new password
                                              </label>
                                              <Field
                                                type="password"
                                                className={`form-control ${
                                                  touched.confirmPassword &&
                                                  errors.confirmPassword
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                placeholder="Retype your new password"
                                              />
                                              <ErrorMessage
                                                name="confirmPassword"
                                                component="div"
                                                className="invalid-feedback"
                                              />
                                            </div>
                                          </div>
                                          <button
                                            type="submit"
                                            className="btn btn-dark waves-effect waves-light"
                                            disabled={editPasswordLoading}
                                          >
                                            Save
                                          </button>
                                        </Form>
                                      )}
                                    </Formik>
                                  </div>
                                  <div
                                    className={
                                      "tab-pane fade" +
                                      (activeTab === "reset-account"
                                        ? " show active"
                                        : "")
                                    }
                                    style={{
                                      display:
                                        activeTab === "reset-account"
                                          ? "block"
                                          : "none",
                                    }}
                                    id="reset-account"
                                    role="tabpanel"
                                    aria-labelledby="reset-account-tab"
                                  >
                                    <div className="row">
                                      <div className="col-lg-10">
                                        <div className="are-you-sure">
                                          <h3>Are you sure?</h3>
                                          <p>Please read this carefully!</p>
                                          <p>
                                            This action cannot be undone. This
                                            will permanently wipe all info in
                                            your account contacts, projects,
                                            notes, etc, and remove all
                                            collaborator associations.
                                          </p>
                                          <p>
                                            Please type your account password to
                                            confirm.
                                          </p>
                                          <Formik
                                            initialValues={
                                              initialValuesResetAccount
                                            }
                                            validationSchema={
                                              validationSchemaResetAccount
                                            }
                                            onSubmit={onSubmitResetAccount}
                                          >
                                            {({ errors, touched }) => (
                                              <Form>
                                                <div className="row">
                                                  <div className="col-md-8 mb-3">
                                                    <label
                                                      htmlFor="password"
                                                      className="form-label"
                                                    >
                                                      Account Password
                                                    </label>
                                                    <Field
                                                      type="password"
                                                      className={`form-control ${
                                                        touched.password &&
                                                        errors.password
                                                          ? "is-invalid"
                                                          : ""
                                                      }`}
                                                      id="password"
                                                      name="password"
                                                      placeholder="Type your current password"
                                                    />
                                                    <ErrorMessage
                                                      name="password"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                </div>
                                                <button
                                                  type="reset"
                                                  className="btn btn-secondary waves-effect waves-light"
                                                  style={{
                                                    marginRight: "10px",
                                                  }}
                                                >
                                                  Cancel
                                                </button>
                                                <button
                                                  type="submit"
                                                  className="btn btn-dark waves-effect waves-light"
                                                  disabled={restAccountLoading}
                                                >
                                                  Reset My Account
                                                </button>
                                              </Form>
                                            )}
                                          </Formik>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      "tab-pane fade" +
                                      (activeTab === "delete-account"
                                        ? " show active"
                                        : "")
                                    }
                                    style={{
                                      display:
                                        activeTab === "delete-account"
                                          ? "block"
                                          : "none",
                                    }}
                                    id="delete-account"
                                    role="tabpanel"
                                    aria-labelledby="delete-account-tab"
                                  >
                                    <div className="row">
                                      <div className="col-lg-10">
                                        <div className="are-you-sure">
                                          <h3>Are you sure?</h3>
                                          <p>Please read this carefully!</p>
                                          <p>
                                            This action cannot be undone. This
                                            will permanently delete the{" "}
                                            <em>
                                              {initialValuesEmail.newEmail}{" "}
                                            </em>{" "}
                                            account contacts, projects, notes,
                                            etc, and remove all collaborator
                                            associations.
                                          </p>
                                          <p>
                                            {checkData?.result
                                              ?.registredWith !==
                                            ("google" || "linkedin") ? (
                                              "Please type your account password to confirm."
                                            ) : (
                                              <em>
                                                Please type your email to
                                                confirm.
                                              </em>
                                            )}
                                          </p>
                                          {checkData?.result?.registredWith !==
                                          ("google" || "linkedin") ? (
                                            <Formik
                                              initialValues={
                                                initialValuesDelete
                                              }
                                              validationSchema={
                                                validationSchemaDelete
                                              }
                                              onSubmit={onSubmitDelete}
                                            >
                                              {({ errors, touched }) => (
                                                <Form>
                                                  <div className="row">
                                                    <div className="col-md-8 mb-3">
                                                      <label
                                                        htmlFor="password"
                                                        className="form-label"
                                                      >
                                                        Account Password
                                                      </label>
                                                      <Field
                                                        type="password"
                                                        className={`form-control ${
                                                          touched.password &&
                                                          errors.password
                                                            ? "is-invalid"
                                                            : ""
                                                        }`}
                                                        id="password"
                                                        name="password"
                                                        placeholder="Type your current password"
                                                      />
                                                      <ErrorMessage
                                                        name="password"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  </div>
                                                  <button
                                                    type="reset"
                                                    className="btn btn-secondary waves-effect waves-light"
                                                    style={{
                                                      marginRight: "10px",
                                                    }}
                                                  >
                                                    Cancel
                                                  </button>
                                                  <button
                                                    type="submit"
                                                    className="btn btn-dark waves-effect waves-light"
                                                    disabled={
                                                      deleteAccountLoading
                                                    }
                                                  >
                                                    Delete My Account
                                                  </button>
                                                </Form>
                                              )}
                                            </Formik>
                                          ) : (
                                            <Formik
                                              initialValues={{
                                                name: "",
                                              }}
                                              validationSchema={Yup.object({
                                                name: Yup.string().test(
                                                  "check-email",
                                                  "Value should be the same as user email",
                                                  function (value) {
                                                    return (
                                                      value ===
                                                      initialValuesEmail.newEmail
                                                    ); // Validate against the checkData email
                                                  }
                                                ),
                                              })}
                                            >
                                              {({
                                                errors,
                                                touched,
                                                values,
                                              }) => (
                                                <Form>
                                                  <div className="row">
                                                    <div className="col-md-8 mb-3">
                                                      <label
                                                        htmlFor="name"
                                                        className="form-label"
                                                      >
                                                        Enter your Email to
                                                        confirm
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className={`form-control ${
                                                          touched.name &&
                                                          errors.name
                                                            ? "is-invalid"
                                                            : ""
                                                        }`}
                                                        id="name"
                                                        name="name"
                                                        placeholder="Type your Email"
                                                      />
                                                      <ErrorMessage
                                                        name="name"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  </div>
                                                  <button
                                                    type="reset"
                                                    className="btn btn-secondary waves-effect waves-light"
                                                    style={{
                                                      marginRight: "10px",
                                                    }}
                                                  >
                                                    Cancel
                                                  </button>
                                                  <button
                                                    type="submit"
                                                    className="btn btn-dark waves-effect waves-light"
                                                    onClick={
                                                      onSubmitGoogleLogin
                                                    }
                                                    disabled={
                                                      deleteGooleAccountLoading ||
                                                      errors.name ||
                                                      values.name === ""
                                                    }
                                                  >
                                                    Delete My Account
                                                  </button>
                                                </Form>
                                              )}
                                            </Formik>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* <!-- end col--> */}
                            </div>
                            {/* <!-- end row--> */}
                          </div>
                        </div>
                        {/* <!-- end card--> */}
                      </div>
                      {/* <!-- end col --> */}
                    </div>
                    {/* <!-- end row --> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- end row --> */}
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
  );
};

export default AccountSettings;

import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  TextField,
  Button,
  Link,
  Grid,
  Typography,
  CircularProgress,
  Dialog,
} from "@mui/material";
import * as Yup from "yup";
import toast from "react-hot-toast";
import qs from "qs";
import "./login.css";
import { useNavigate, useLocation } from "react-router";
import {
  useLoginMutation,
  useLoginWithGoogleMutation,
  useLoginWithLinkedInMutation,
} from "../../slices/customerSlice";
// import { LinkedIn } from "react-linkedin-login-oauth2";

import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../slices/authSlice";
import { sendMessageToExtension } from "../../utils/timeAgo";
import { useGoogleLogin } from "@react-oauth/google";
import { Box } from "@mui/system";
import { FaArrowLeft } from "react-icons/fa6";
import { useVerifyEmailForgetMutation } from "../../slices/adminSlice";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [verifyEmailForgot] = useVerifyEmailForgetMutation();
  const [token, setToken] = useState("");
  const [customType, setCustomType] = useState("");
  const initialValues = {
    password: "",
    confirmPassword: "",
  };
  const { auth } = useSelector((state) => state.auth);
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const onSubmit = (values) => {
    const { password } = values;
    const userData = {
      password,
      token,
    };
    verifyEmailForgot({ body: userData })
      .unwrap()
      .then((res) => {
        toast.success("Password reset successfully, please login");
        navigate("/login");
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.data.message);
      });
  };

  const isLoading = false;

  useEffect(() => {
    const getToken = sessionStorage.getItem("resetPassword");
    if (getToken) {
      const token = JSON.parse(getToken);
      setToken(token.token);
    }
  }, []);

  return (
    <div>
      <div className="wrapper">
        <section id="topNav">
          <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container-fluid">
              <a
                className="navbar-brand"
                style={{
                  cursor: "pointer",
                }}
                onClick={() =>
                  (window.location.href = `${
                    import.meta.env.VITE_JARVIS_MARKETING
                  }`)
                }
              >
                <img
                  src="https://d2ds8yldqp7gxv.cloudfront.net/lead/jarvis-logo.png"
                  alt="logo"
                  width="200"
                  height="33"
                />
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
          </nav>
        </section>

        <section id="loginSection">
          <div className="container">
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <FaArrowLeft
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/login")}
                  />
                  {"  "}
                  Back to login
                </Box>

                <div className="login-center">
                  <h1>Create a new password</h1>
                  <div style={{ marginTop: "20px" }}>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={onSubmit}
                    >
                      {({ errors, touched }) => (
                        <Form
                          className="row g-3"
                          id="loginForm"
                          style={{ marginTop: "20px" }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Field
                                name="password"
                                as={TextField}
                                label="New Password"
                                fullWidth
                                error={
                                  touched.password && Boolean(errors.password)
                                }
                                helperText={touched.password && errors.password}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Field
                                name="confirmPassword"
                                as={TextField}
                                label="Confirm Password"
                                fullWidth
                                error={
                                  touched.confirmPassword &&
                                  Boolean(errors.confirmPassword)
                                }
                                helperText={
                                  touched.confirmPassword &&
                                  errors.confirmPassword
                                }
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                  backgroundColor: isLoading
                                    ? "#ccc"
                                    : "#ff000d",
                                  color: "#fff",
                                  textTransform: "capitalize",
                                  padding: "10px 0",
                                  borderRadius: "5px",
                                  marginTop: "20px",
                                  "&:hover": {
                                    backgroundColor: isLoading
                                      ? "#ccc"
                                      : "#ff000d",
                                    color: "#fff",
                                  },
                                }}
                                fullWidth
                              >
                                {isLoading ? (
                                  <CircularProgress size={24} color="inherit" />
                                ) : (
                                  "Send Email"
                                )}
                              </Button>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography
                                className="create-account"
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: "5px",
                                }}
                              >
                                Need an account?{" "}
                                <p
                                  style={{
                                    cursor: "pointer",
                                    color: "#3f51b5",
                                  }}
                                  onClick={() => navigate("/register")}
                                >
                                  Create an account for free
                                </p>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VerifyEmail;

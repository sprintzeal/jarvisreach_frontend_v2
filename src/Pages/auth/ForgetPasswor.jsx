import React, { useEffect } from "react";
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
import { useForgetPasswordMutation } from "../../slices/adminSlice";

import {Helmet} from "react-helmet";


const ForgetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [forgetPassword] = useForgetPasswordMutation();
  const [customType, setCustomType] = React.useState("");
  const initialValues = {
    email: "",
  };
  const { auth } = useSelector((state) => state.auth);
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
  });

  const onSubmit = (values) => {
    const { email } = values;
    const userData = {
      email,
    };
    forgetPassword({ body: userData })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        navigate("/login");
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.data.message);
      });
  };


  useEffect(() => {
    // Add Google Analytics script to the component
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-1ZY8C1HBV5";

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-1ZY8C1HBV5');
    `;

    document.head.appendChild(script1);
    document.head.appendChild(script2);

    // Clean up the scripts when the component unmounts
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []); // The empty dependency array ensures it runs only once


  const isLoading = false;

  return (
    <div>
      <div className="wrapper">
      <Helmet>
        <title>Jarvis Reach Forgot Password Page</title>
        <meta
          name="description"
          content="You can enter your email or user ID to reset your password and access your Jarvis Reach account. Note, always use registered email address."
        />
      </Helmet>
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
                  <h1>Forget Password</h1>
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
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <Field
                                name="email"
                                as={TextField}
                                label="Enter your Work email"
                                fullWidth
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
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

export default ForgetPassword;

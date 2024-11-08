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
import { useLinkedIn } from "react-linkedin-login-oauth2";
// You can use provided image shipped by this package or using your own
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";

import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../slices/authSlice";
import { sendMessageToExtension } from "../../utils/timeAgo";
import { useGoogleLogin } from "@react-oauth/google";
import { Box, useMediaQuery } from "@mui/system";
import axios from "axios";
import { LocationCitySharp } from "@mui/icons-material";

const Login = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const location = useLocation();
  const [customType, setCustomType] = useState("");
  const [code, setCode] = useState("");
  const initialValues = {
    email: "",
    password: "",
  };
  const [loginUser, { isLoading, isError, isSuccess, error, data }] =
    useLoginMutation();
  const [loginWithGoogle, { isLoading: googleLoading }] =
    useLoginWithGoogleMutation();
  const [
    loginWithLinkedIn,
    {
      isLoading: linkedInLoading,
      isError: linkedInError,
      isSuccess: linkedInSuccess,
    },
  ] = useLoginWithLinkedInMutation();
  const { auth } = useSelector((state) => state.auth);
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  });
  const [locations, setLocations] = useState({
    country: "",
    latitude: "",
    longitude: "",
  });

  const countries = [
    "United States",
    "Canada",
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and/or Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands",
    "Colombia",
    "Comoros",
    "Congo",
    "Cook Islands",
    "Costa Rica",
    "Croatia (Hrvatska)",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor",
    "Ecudaor",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands (Malvinas)",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "France, Metropolitan",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard and Mc Donald Islands",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran (Islamic Republic of)",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Ivory Coast",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea, Democratic People's Republic of",
    "Korea, Republic of",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libyan Arab Jamahiriya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macau",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia, Federated States of",
    "Moldova, Republic of",
    "Monaco",
    "Mongolia",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfork Island",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Reunion",
    "Romania",
    "Russian Federation",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia South Sandwich Islands",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "St. Helena",
    "St. Pierre and Miquelon",
    "Sudan",
    "Suriname",
    "Svalbarn and Jan Mayen Islands",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States minor outlying islands",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City State",
    "Venezuela",
    "Vietnam",
    "Virigan Islands (British)",
    "Virgin Islands (U.S.)",
    "Wallis and Futuna Islands",
    "Western Sahara",
    "Yemen",
    "Yugoslavia",
    "Zaire",
    "Zambia",
    "Zimbabwe",
  ];

  const onSubmit = (values) => {
    const { email, password, customType } = values;
    const userData = {
      email,
      password,
      customType,
    };
    loginUser({ body: userData })
      .unwrap()
      .then((res) => {
        handleLoginResponse(res, customType);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.data.message);
      });
  };

  const handleLoginResponse = (res, customType) => {
    dispatch(setCredentials({ ...res, token: res.token }));
    if (customType === "one-click" || customType === "standard_flow") {
    } else if (customType === "whmcs" || customType === "chrome") {
      window.location.href = `/fetching?_from=${customType}`;
    } else {
      sendMessageToExtension({
        apiToken: res.result.token,
      });
    }

    if (res.result.role === "admin") {
      navigate("/dashboard");
    } else if (
      res.result.role === "customer" ||
      res.result.role === "teammember"
    ) {
      navigate("/folder");
    }
    toast.success("Login successful");
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetchUserDetails(tokenResponse.access_token);

        const loginData = {
          token: tokenResponse.access_token,
          userDetails: userInfo,
          location: {
            country: locations.countryName,
            lat: Number(locations.latitude),
            lon: Number(locations.longitude),
          },
        };

        loginWithGoogle({ body: loginData })
          .unwrap()
          .then((res) => {
            handleLoginResponse(res, "google");
          })
          .catch((error) => {
            console.log("Login Error:", error);
            toast.error(error.data.message);
          });
      } catch (error) {
        console.error("Error during Google login:", error);
        toast.error("An error occurred during Google login.");
      }
    },
    onError: (errorResponse) => {
      console.error("Google Login Error:", errorResponse);
      toast.error("Google login failed");
    },
    scope: "profile email",
  });

  const fetchUserDetails = async (accessToken) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch user details:", response.statusText);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = location.search?.includes("token")
      ? qs.parse(location.search, {
          ignoreQueryPrefix: true,
        }).token
      : "";
    if (token) {
      sessionStorage.setItem("authToken", JSON.stringify({ token }));
    }

    const customerRef = location.search?.includes("teamAdmin")
      ? qs.parse(location.search, {
          ignoreQueryPrefix: true,
        }).teamAdmin
      : "";
    if (customerRef) {
      sessionStorage.setItem("customerRef", JSON.stringify({ customerRef }));
    }
  }, [location]);

  useEffect(() => {
    let customType = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    }).type;
    setCustomType(customType);
  }, [location]);

  useEffect(() => {
    if (auth) {
      if (auth.result.role === "admin") {
        navigate("/dashboard");
      } else if (
        auth.result.role === "customer" ||
        auth.result.role === "teammember"
      ) {
        navigate("/folder");
      }
    }
  }, [navigate]);

  // useEffect(() => {
  //   const redirectToLinkedIn = () => {
  //     window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=r_liteprofile%20r_emailaddress`;
  //   };

  //   redirectToLinkedIn();
  // }, []);
  // const { linkedInLogin } = useLinkedIn({
  //   clientId: "86txuhdk9fhza7",
  //   scope: "r_liteprofile r_emailaddress", // Correct scopes for fetching profile and email

  //   redirectUri: `http://localhost:3000/login`,
  //   onSuccess: (code) => {
  //     console.log(code);
  //   },
  //   onError: (error) => {
  //     if (error.error === "user_closed_popup") {
  //       console.log("The user closed the LinkedIn login popup.");
  //       alert("You closed the login popup. Please try again.");
  //     } else {
  //       console.log("LinkedIn login error:", error);
  //       alert("An error occurred during LinkedIn login. Please try again.");
  //     }
  //   },
  // });

  const redirectToLinkedIn = () => {
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${
      import.meta.env.VITE_LIVE_LINKEDIN_CLIENT_ID
    }&redirect_uri=${
      import.meta.env.VITE_LIVE_APP_URL
    }/login&scope=profile%20email%20openid`;
  };

  useEffect(() => {
    const apiUrl = `https://ipinfo.io/json?token=${
      import.meta.env.VITE_LIVE_LOCATION_API_KEY
    }`;
    const query = window.location.search;
    const code = new URLSearchParams(query).get("code");
    setCode(code);
    axios
      .get(apiUrl)
      .then((response) => {
        const { org, country, loc } = response.data;
        const [latitude, longitude] = loc.split(",");
        const regex = new RegExp(`\\b(${countries.join("|")})\\b`, "i");
        const match = org.match(regex);
        const countryName = match ? match[0] : country;
        setLocations({ countryName, latitude, longitude });
      })
      .catch((error) => {
        console.error("Error fetching geolocation data:", error);
      });
  }, []);

  useEffect(() => {
    if (code) {
      try {
        loginWithLinkedIn({
          body: {
            code: code,
            location: {
              country: locations.countryName,
              lat: Number(locations.latitude),
              lon: Number(locations.longitude),
            },
          },
        })
          .unwrap()
          .then((res) => {
            handleLoginResponse(res, "linkedin");
          })
          .catch((error) => {
            console.log("Login Error:", error);
            toast.error(error.data.message);
          });
      } catch (error) {
        console.error("Error during Linkedin login:", error);
        toast.error("An error occurred during Linkedin login.");
      }
    }
  }, [code]);

  useEffect(() => {
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

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
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
              <div className="col-md-10 col-lg-8 col-xl-6 offset-md-1 offset-lg-2 offset-xl-3">
                <div className="login-center">
                  <h1>Welcome Back!</h1>
                  {/* <LinkedIn
                      clientId="YOUR_LINKEDIN_CLIENT_ID"
                      onFailure={handleLinkedInFailure}
                      onSuccess={handleLinkedInSuccess}
                      redirectUri="http://localhost:3000/linkedin"
                      scope="r_liteprofile r_emailaddress"
                      renderElement={({ onClick, disabled }) => (
                        <button onClick={onClick} disabled={disabled}>
                          <img
                            src="https://d2ds8yldqp7gxv.cloudfront.net/lead/linkedin.png"
                            width="18"
                            height="18"
                          />{" "}
                          LinkedIn
                        </button>
                      )}
                    /> */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: isSmallScreen ? "column" : "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-linked"
                      onClick={() => redirectToLinkedIn()}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <img
                        src="https://d2ds8yldqp7gxv.cloudfront.net/lead/linkedin.png"
                        width="18"
                        height="18"
                      />{" "}
                      LinkedIn
                    </button>

                    <button
                      type="button"
                      className="btn btn-linked"
                      onClick={() =>
                        // window.open(
                        //   `${
                        //     import.meta.env.VITE_APP_BACKEND_API_URL
                        //   }/auth/google/callback`,
                        //   "_blank"
                        // )
                        login()
                      }
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <img
                        src="https://d2ds8yldqp7gxv.cloudfront.net/lead/google.png"
                        width="18"
                        height="18"
                      />{" "}
                      Google
                    </button>
                  </div>
                  <div
                    className={!isSmallScreen && "linked-google-form"}
                    style={{
                      marginTop: "20px",
                      marginLeft: isSmallScreen ? "20px" : "0px",
                    }}
                  >
                    <h6>or use your work email</h6>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={onSubmit}
                    >
                      {({ errors, touched }) => (
                        <Form id="loginForm" style={{ marginTop: "20px" }}>
                          <Grid
                            container
                            spacing={3}
                            sx={{
                              width: "100%",
                            }}
                          >
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <Field
                                name="email"
                                as={TextField}
                                label="Enter your Work email"
                                fullWidth
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                sx={{
                                  width: "100%",
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Field
                                name="password"
                                as={TextField}
                                label="Password"
                                type="password"
                                fullWidth
                                error={
                                  touched.password && Boolean(errors.password)
                                }
                                helperText={touched.password && errors.password}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Link
                                className="forget"
                                sx={{
                                  cursor: "pointer",
                                  color: "#3f51b5",
                                }}
                                onClick={() => navigate("/forget-password")}
                              >
                                Forgot Password?
                              </Link>
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
                                  "Sign In"
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
        {/* loader when logging in from google */}
        <Dialog
          open={googleLoading || linkedInLoading}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
              backgroundColor: "rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <CircularProgress />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Login;

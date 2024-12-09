import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useLoginWithGoogleMutation,
  useLoginWithLinkedInMutation,
  useSignupMutation,
} from "../../slices/customerSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { CircularProgress, Dialog, useMediaQuery } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/authSlice";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";

import { sendMessageToExtension } from "../../utils/timeAgo";
import axios from "axios";
import {Helmet} from "react-helmet";

const Register = () => {
  const [termAndCondition, setTermAndCondition] = useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const token = sessionStorage.getItem("authToken");
  const customerRef = sessionStorage.getItem("customerRef");
  const navigate = useNavigate();
  const [register, { isLoading, error, data, isError }] = useSignupMutation();
  const [loginWithGoogle, { isLoading: googleLoading }] =
    useLoginWithGoogleMutation();
  const [loginWithLinkedIn] = useLoginWithLinkedInMutation();
  const dispatch = useDispatch();
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    newsUpdates: false,
    termsConditions: false,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Please confirm your password"),
  });

  const [location, setLocation] = useState({
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

  useEffect(() => {
    const apiUrl = `https://ipinfo.io/json?token=${
      import.meta.env.VITE_LIVE_LOCATION_API_KEY
    }`;

    axios
      .get(apiUrl)
      .then((response) => {
        const { org, country, loc } = response.data;
        const [latitude, longitude] = loc.split(",");
        const regex = new RegExp(`\\b(${countries.join("|")})\\b`, "i");
        // if (org.match(regex)) {
        //   console.log("country", country);
        // }
        const match = org.match(regex);
        const countryName = match ? match[0] : country;
        setLocation({ countryName, latitude, longitude });
      })
      .catch((error) => {
        console.error("Error fetching geolocation data:", error);
      });
  }, []);

const onSubmit = async (values) => {
    try {
      // Prepare initial data excluding companyName and mainActivity
      let data = {};
      if (token) {
        data = {
          ...values,
          role: "teammember",
          customerRef: JSON.parse(customerRef).customerRef,
          termsConditions: false,
          location: {
            country: location.countryName,
            lat: Number(location.latitude),
            lon: Number(location.longitude),
          },
        };
      } else {
        data = {
          ...values,
          role: "customer",
          termsConditions: false,
          location: {
            country: location.countryName,
            lat: Number(location.latitude),
            lon: Number(location.longitude),
          },
        };
      }

      // Log the submitted data (excluding companyName and mainActivity)
      console.log("Submitted data:", data);

      // Store user details in sessionStorage (without companyName and mainActivity)
      sessionStorage.setItem("userDetails", JSON.stringify({
        ...values,
        role: data.role,
        location: data.location,
        customerRef: data.customerRef,
      }));
      console.log("Session Storage User Details:", JSON.parse(sessionStorage.getItem("userDetails")));

      // Proceed to the next page
      navigate("/accountsetupform");

      // Optionally, clear authToken after navigation
      sessionStorage.removeItem("authToken");

    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message);
    }
  };
  
  // const onSubmit = async (values) => {
     // const cors_api_host = "https://cors-anywhere.herokuapp.com/";
     // const cors_api_url = cors_api_host + "http://www.geoplugin.net/json.gp";
     // const origin = window.location.origin;
     // const url = cors_api_url + "?origin=" + origin;
// 
     // fetch(url, {
       // method: "GET",
       // headers: {
         // "Content-Type": "application/json",
       // },
     // })
       // .then((response) => response.json())
       // .then(async (data) => {
         // const countryName = data.geoplugin_countryName;
         // const countryLat = data.geoplugin_latitude;
         // const countryLong = data.geoplugin_longitude;
// 
         // console.log("Country:", countryName);
         // console.log("Latitude:", countryLat);
         // console.log("Longitude:", countryLong);
// 
       // })
       // .catch((error) => console.error("Error fetching location data:", error));
    // try {
      // let data = {};
      // if (token) {
        // data = {
          // ...values,
          // role: "teammember",
          // customerRef: JSON.parse(customerRef).customerRef,
          // termsConditions: false,
          // location: {
            // country: location.countryName,
            // lat: Number(location.latitude),
            // lon: Number(location.longitude),
          // },
        // };
      // } else {
        // data = {
          // ...values,
          // role: "customer",
          // termsConditions: false,
          // location: {
            // country: location.countryName,
            // lat: Number(location.latitude),
            // lon: Number(location.longitude),
          // },
        // };
      // }
      // await register({ body: data }).unwrap();
      // window.location.href =
        // import.meta.env.VITE_JARVIS_MARKETING + "/registration-successful";
      // toast.success("Registration Complete, Please verify your email to login");
      // sessionStorage.removeItem("authToken");
    // } catch (error) {
      // console.log("error", error);
      // toast.error(error.data.message);
    // }
  // };

  const handleLoginResponse = (res, customType) => {
    dispatch(setCredentials({ ...res, token: res.token }));
    if (customType === "one-click" || customType === "standard_flow") {
      console.log("customType :", customType);
    } else if (customType === "whmcs" || customType === "chrome") {
      window.location.href = `/fetching?_from=${customType}`;
      // console.log("customType === ", customType);
    } else {
      sendMessageToExtension({
        apiToken: res.result.token,
      });
      console.log("sendMessageToExtension");
    }

    if (res.result.role === "admin") {
      navigate("/dashboard");
    } else if (
      res.result.role === "customer" ||
      res.result.role === "teammember"
    ) {
      navigate("/folder");
    }
    toast.success("Authentication successful");
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetchUserDetails(tokenResponse.access_token);

        const loginData = {
          token: tokenResponse.access_token,
          userDetails: userInfo,
          location: {
            country: location.countryName,
            lat: Number(location.latitude),
            lon: Number(location.longitude),
          },
        };

        loginWithGoogle({ body: loginData })
          .unwrap()
          .then((res) => {
            handleLoginResponse(res, "google");
          })
          .catch((error) => {
            console.log("Signup Error:", error);
            toast.error("An error occurred during Google Signup.");
          });
      } catch (error) {
        console.error("Error during Google Signup:", error);
        toast.error("An error occurred during Google Signup.");
      }
    },
    onError: (errorResponse) => {
      console.error("Google Signup Error:", errorResponse);
      toast.error("Google Signup failed");
    },
    scope: "profile email",
  });

  const redirectToLinkedIn = () => {
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${
      import.meta.env.VITE_LIVE_LINKEDIN_CLIENT_ID
    }&redirect_uri=${
      import.meta.env.VITE_LIVE_APP_URL
    }/login&scope=profile%20email%20openid`;
  };

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

  return (
    <div className="wrapper">
    <Helmet>
        <title>Sign up or Register for free and access Jarvis Reach</title>
        <meta
          name="description"
          content="You can sign up or Register for free and access Jarvis Reach free plan without any credit or debit card. You will get free 100 credit almost every month."
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

      <section id="signupSection">
        <div className="container">
          <div className="row">
            <div className="col-md-10 col-lg-8 col-xl-6 offset-md-1 offset-lg-2 offset-xl-0">
              <div className="signup-center">
                <h1>Create your free account</h1>
                <div
                  className="linked-google"
                  style={{
                    display: "flex",
                    flexDirection: isSmallScreen ? "column" : "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-linked"
                    onClick={() => redirectToLinkedIn()}
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
                  >
                    <img
                      src="https://d2ds8yldqp7gxv.cloudfront.net/lead/google.png"
                      width="18"
                      height="18"
                    />{" "}
                    Google
                  </button>
                </div>
                <div className="linked-google-form">
                  <h6>Or use your work email</h6>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                  >
                    {({ errors, touched }) => (
                      <Form className="row g-3" id="signupForm">
                        <div className="col-md-6">
                          <Field
                            type="text"
                            className={`form-control ${
                              touched.firstName && errors.firstName
                                ? "is-invalid"
                                : ""
                            }`}
                            id="firstName"
                            name="firstName"
                            placeholder="First Name"
                          />
                          {touched.firstName && errors.firstName ? (
                            <div className="invalid-feedback">
                              {errors.firstName}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-md-6">
                          <Field
                            type="text"
                            className={`form-control ${
                              touched.lastName && errors.lastName
                                ? "is-invalid"
                                : ""
                            }`}
                            id="lastName"
                            name="lastName"
                            placeholder="Last Name"
                          />
                          {touched.lastName && errors.lastName ? (
                            <div className="invalid-feedback">
                              {errors.lastName}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-md-12">
                          <Field
                            type="email"
                            className={`form-control ${
                              touched.email && errors.email ? "is-invalid" : ""
                            }`}
                            id="email"
                            name="email"
                            placeholder="Enter your Work email"
                          />
                          {touched.email && errors.email ? (
                            <div className="invalid-feedback">
                              {errors.email}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-md-12">
                          <Field
                            type="password"
                            className={`form-control ${
                              touched.password && errors.password
                                ? "is-invalid"
                                : ""
                            }`}
                            id="password"
                            name="password"
                            placeholder="Password"
                          />
                          {touched.password && errors.password ? (
                            <div className="invalid-feedback">
                              {errors.password}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-md-12">
                          <Field
                            type="password"
                            className={`form-control ${
                              touched.confirmPassword && errors.confirmPassword
                                ? "is-invalid"
                                : ""
                            }`}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Please confirm your password"
                          />
                          {touched.confirmPassword && errors.confirmPassword ? (
                            <div className="invalid-feedback">
                              {errors.confirmPassword}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <Field
                              type="checkbox"
                              className={`form-check-input ${
                                touched.newsUpdates && errors.newsUpdates
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="newsUpdates"
                              name="newsUpdates"
                              style={{ marginBottom: "8px" }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="newsUpdates"
                            >
                              I agree to receive occasional news and updates.
                            </label>
                          </div>
                          <div className="form-check">
                            <Field
                              type="checkbox"
                              className={`form-check-input ${
                                touched.termsConditions &&
                                errors.termsConditions
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="termsConditions"
                              name="termsConditions"
                              onClick={() =>
                                setTermAndCondition(!termAndCondition)
                              }
                              style={{ marginBottom: "8px" }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="termsConditions"
                            >
                              I accept the{" "}
                              <a
                                href={`${
                                  import.meta.env.VITE_JARVIS_MARKETING
                                }/terms-of-service`}
                                style={{
                                  color: "#ff000d",
                                }}
                              >
                                Terms & Conditions
                              </a>{" "}
                              and{" "}
                              <a
                                href={`${
                                  import.meta.env.VITE_JARVIS_MARKETING
                                }/privacy-policy`}
                                style={{
                                  color: "#ff000d",
                                }}
                              >
                                Privacy Policy
                              </a>
                              .
                            </label>
                          </div>
                        </div>
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-submit"
                            type="submit"
                            disabled={termAndCondition ? false : true}
                          >
                            {isLoading ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              "Sign Up"
                            )}
                          </button>
                        </div>
                        <div className="col-12">
                          <p className="create-account">
                            Already have an account?{" "}
                            <a
                              onClick={() => navigate("/login")}
                              style={{
                                color: "#ff000d",
                                cursor: "pointer",
                              }}
                            >
                              Sign in
                            </a>
                          </p>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
            {!isLargeScreen && (
              <div className="col-md-6">
                <div className="grow-faster">
                  <h2>Close More Deals Grow Faster</h2>
                  <p>
                    Jarvis Reach can enhance any LinkedIn profile with emails
                    and phone numbers – even if you haven’t connected with them.
                  </p>
                  <ul>
                    <li>
                      <i className="fa-solid fa-circle-check"></i> Get 100 free
                      credits every month
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check"></i> Real time
                      email and phone verification
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check"></i> Native
                      integrations to popular CRMs
                    </li>
                  </ul>
                  <img
                    src="https://d2ds8yldqp7gxv.cloudfront.net/lead/sing-up.png"
                    className="img-fluid"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <Dialog
        open={googleLoading}
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
  );
};

export default Register;

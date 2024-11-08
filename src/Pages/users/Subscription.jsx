import React, { useEffect, useState } from "react";
import {
  FaCcVisa,
  FaCreditCard,
  FaExclamation,
  FaTrash,
} from "react-icons/fa6";
import {
  useAddCustomerBillingAddressMutation,
  useCancelSubscriptionMutation,
  useCheckDataQuery,
  useDeletePaymentMethodMutation,
  useGetPaymentMethodQuery,
  useGetPlansFeatureInfoQuery,
  useGetSubscriptioInvoicesQuery,
  useGetSubscriptionInfoQuery,
} from "../../slices/customerSlice";
import PaymentForm from "../../services/PaymentForm";
import { useMediaQuery } from "@mui/system";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {
  TextField,
  MenuItem,
  Button,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Tooltip,
  CircularProgress,
  Badge,
} from "@mui/material";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import data from "../../utils/countryData.json";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";

const Subscription = ({ collapsed }) => {
  const [active, setActive] = useState("subscription-info");
  const navigate = useNavigate();
  const [cancelSubscription, { isLoading: cancelSubscriptionLoading }] =
    useCancelSubscriptionMutation();
  const [deletePaymentMethod, { isLoading: paymentMethodDeleting }] =
    useDeletePaymentMethodMutation();
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [accordion, setAccordion] = useState(false);
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [opens, setOpens] = useState(false);
  const [deletingPaymentMethodId, setDeletingPaymentMethodId] = useState(null);
  const handleOpen = () => {
    setOpens(true);
  };
  const handleClose = () => {
    setOpens(false);
  };
  const {
    data: userDataa,
    isLoading: userLoading,
    error: userError,
  } = useCheckDataQuery();
  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    error: subscriptionError,
  } = useGetPaymentMethodQuery();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  // console.log("subscriptionData", subscriptionData);
  const { userData } = useSelector((state) => state.userData);

  const {
    data: subscriptionInfoData,
    isLoading: subscriptionInfoLoading,
    error: subscriptionInfoError,
  } = useGetSubscriptionInfoQuery();
  const {
    data: planInfo,
    isLoading: planInfoLoading,
    isFetching: isFetchingPlanInfo,
    error: planInfoError,
    refetch: refetchPlanInfo,
  } = useGetPlansFeatureInfoQuery({
    id: userData?.plan?.plan,
  });
  const {
    data: subscriptionInvoicesData,
    isLoading: subscriptionInvoicesLoading,
    error: subscriptionInvoicesError,
  } = useGetSubscriptioInvoicesQuery();

  const [addSubscriptionBilling] = useAddCustomerBillingAddressMutation();

  const onSubmit = async (values, { setSubmitting }) => {
    const { firstName, lastName, ...rest } = values;
    try {
      await addSubscriptionBilling({
        body: {
          country: country,
          accountType: values.accountType,
          address: address,
          city: city,
          state: state,
          zip: zip,
        },
      })
        .unwrap()
        .then(() => {
          toast.success("Billing Address Added Successfully");
        })
        .catch((error) => {
          toast.error(error.data.message);
        })
        .finally(() => {
          setSubmitting(false);
        });
    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message);
    }
  };
  const initialValues = {
    country: country,
    accountType: "",
    firstName: name,
    lastName: lastName,
    address: address,
    city: city,
    state: state,
    zip: zip,
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription()
        .unwrap()
        .then(() => {
          toast.success("Subscription Cancelled Successfully");
        })
        .catch((error) => {
          toast.error(error.data.message);
        });
      handleClose();
    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message);
    }
  };

  const handleDeletePaymentMethod = async () => {
    try {
      await deletePaymentMethod(deletingPaymentMethodId)
        .unwrap()
        .then(() => {
          toast.success("Card Deleted Successfully");
        })
        .catch((error) => {
          toast.error(error.data.message);
        });
      setDeletingPaymentMethodId(null);
    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message);
    }
  };

  useEffect(() => {
    if (userDataa) {
      setCountry(userDataa?.result?.plan?.billingAddress?.country);
      setName(userDataa?.result?.firstName);
      setLastName(userDataa?.result?.lastName);
      setAddress(userDataa?.result?.plan?.billingAddress?.address);
      setCity(userDataa?.result?.plan?.billingAddress?.city);
      setState(userDataa?.result?.plan?.billingAddress?.state);
      setZip(userDataa?.result?.plan?.billingAddress?.postalCode);
    }

    const url = window.location.href;
    if (url.includes("subscription-info")) {
      setActive("subscription-info");
    } else if (url.includes("billing-info")) {
      setActive("billing-info");
    } else if (url.includes("paymentMethod")) {
      setActive("payment-method");
    } else if (url.includes("invoices")) {
      setActive("invoices");
    }
  }, []);

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
                    <li className="breadcrumb-item active">
                      Subscription & Billings
                    </li>
                  </ol>
                </div>
                <h4 className="page-title">Subscription & Billings</h4>
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
                          <h3>Subscription & Billings</h3>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-xl-12">
                        <div className="submission-nill">
                          <ul className="nav nav-tabs nav-bordered">
                            <li className="nav-item">
                              <a
                                data-bs-toggle="tab"
                                aria-expanded="false"
                                className={
                                  "nav-link" +
                                  (active === "subscription-info"
                                    ? " active"
                                    : "")
                                }
                                style={{
                                  fontWeight: 600,
                                  fontSize: "14px",
                                  color: "#6c757d",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setActive("subscription-info");
                                  window.history.pushState(
                                    {},
                                    "",
                                    "/subscription?subscription-info=true"
                                  );
                                }}
                              >
                                Subscription Info
                              </a>
                            </li>
                            <li className="nav-item">
                              <a
                                data-bs-toggle="tab"
                                aria-expanded="true"
                                className={
                                  "nav-link" +
                                  (active === "billing-info" ? " active" : "")
                                }
                                style={{
                                  fontWeight: 600,
                                  fontSize: "14px",
                                  color: "#6c757d",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setActive("billing-info");
                                  window.history.pushState(
                                    {},
                                    "",
                                    "/subscription?billing-info=true"
                                  );
                                }}
                              >
                                Billing Info
                              </a>
                            </li>
                            <li className="nav-item">
                              <a
                                data-bs-toggle="tab"
                                aria-expanded="false"
                                className={
                                  "nav-link" +
                                  (active === "payment-method" ? " active" : "")
                                }
                                style={{
                                  fontWeight: 600,
                                  fontSize: "14px",
                                  color: "#6c757d",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setActive("payment-method");
                                  window.history.pushState(
                                    {},
                                    "",
                                    "/subscription?paymentMethod=true"
                                  );
                                }}
                              >
                                Payment Method
                              </a>
                            </li>
                            <li className="nav-item">
                              <a
                                data-bs-toggle="tab"
                                aria-expanded="false"
                                className={
                                  "nav-link" +
                                  (active === "invoices" ? " active" : "")
                                }
                                style={{
                                  fontWeight: 600,
                                  fontSize: "14px",
                                  color: "#6c757d",
                                }}
                                onClick={() => {
                                  setActive("invoices");
                                  window.history.pushState(
                                    {},
                                    "",
                                    "/subscription?invoices=true"
                                  );
                                }}
                              >
                                Invoices
                              </a>
                            </li>
                          </ul>

                          <div className="tab-content">
                            {subscriptionInfoData && (
                              <div
                                className={
                                  "tab-pane" +
                                  (active === "subscription-info"
                                    ? " show active"
                                    : "")
                                }
                                id="subscription-info"
                                style={{
                                  display:
                                    active === "subscription-info"
                                      ? "block"
                                      : "none",
                                }}
                              >
                                <div className="row">
                                  <div className="col-md-4">
                                    <div className="your-plan-ad">
                                      <p>Your plan</p>
                                      <h3>{subscriptionInfoData?.plan}</h3>
                                      <a
                                        style={{
                                          cursor: "pointer",
                                          color: "#ff6471",
                                        }}
                                        onClick={() => navigate("/see-plan")}
                                      >
                                        Change Plan
                                      </a>
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="your-plan-ad">
                                      <p>Renewal Date</p>
                                      <h3>
                                        {new Date(
                                          subscriptionInfoData?.renewalDate
                                        ).toDateString()}
                                      </h3>
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="your-plan-ad">
                                      <p>Subscription status</p>
                                      <h3>
                                        {
                                          subscriptionInfoData?.subscriptionStatus
                                        }
                                      </h3>
                                      <button
                                        style={{
                                          cursor: "pointer",
                                          color:
                                            subscriptionInfoData?.plan ===
                                            "Free"
                                              ? "#6c757d"
                                              : "#ff6471",
                                          border: "none",
                                          background: "none",
                                          fontSize: "16px",
                                        }}
                                        onClick={() => handleOpen()}
                                        data-bs-toggle="modal"
                                        data-bs-target="#top-modal"
                                        disabled={
                                          subscriptionInfoData?.plan === "Free"
                                        }
                                      >
                                        Cancel Subscription
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="credit-user">
                                    <div className="credit-user-maim">
                                      <div
                                        className="credit-user-top"
                                        style={{ marginBottom: "10px" }}
                                      >
                                        <div className="credit-user-top-left">
                                          <h4
                                            style={{
                                              fontWeight: 600,
                                            }}
                                          >
                                            Credits Used
                                          </h4>
                                        </div>
                                        <div className="credit-user-top-right">
                                          <h4>
                                            {" "}
                                            {
                                              subscriptionInfoData?.creditsUsed
                                            }{" "}
                                            <span>Used</span> of{" "}
                                            {subscriptionInfoData?.credits}{" "}
                                            Total
                                          </h4>
                                        </div>
                                      </div>
                                      <div className="progress mb-2 progress-md">
                                        <div
                                          className="progress-bar"
                                          role="progressbar"
                                          style={{
                                            width: `${
                                              (subscriptionInfoData?.creditsUsed /
                                                subscriptionInfoData?.credits) *
                                              100
                                            }%`,
                                            backgroundColor: "rgb(26 188 156)",
                                          }}
                                          aria-valuenow="45"
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                        ></div>
                                      </div>
                                      <div
                                        className="accordion custom-accordion"
                                        id="custom-accordion-one"
                                        style={{ marginBottom: "10px" }}
                                      >
                                        <div className="card mb-0">
                                          <div
                                            className="card-header"
                                            id="headingNine"
                                          >
                                            <h5 className="m-0 position-relative">
                                              <a
                                                className="custom-accordion-title text-reset d-block"
                                                data-bs-toggle="collapse"
                                                href="#collapseNine"
                                                aria-expanded="true"
                                                aria-controls="collapseNine"
                                                onClick={() =>
                                                  setAccordion(!accordion)
                                                }
                                                style={{
                                                  fontWeight: 600,
                                                }}
                                              >
                                                Credits breakdown{" "}
                                                <span
                                                  className="btn btn-sm waves-effect waves-light"
                                                  title="Credits close to expiration date will be consumed first."
                                                  tabindex="0"
                                                  data-plugin="tippy"
                                                  data-tippy-arrow="true"
                                                  data-tippy-animation="fade"
                                                >
                                                  <i className="fa-solid fa-circle-exclamation"></i>
                                                </span>{" "}
                                                <i className="mdi mdi-chevron-down accordion-arrow"></i>
                                              </a>
                                            </h5>
                                          </div>

                                          <div
                                            className={
                                              "collapse" +
                                              (accordion ? " show" : "")
                                            }
                                            aria-labelledby="headingFour"
                                            data-bs-parent="#custom-accordion-one"
                                          >
                                            <div className="card-body">
                                              <div className="credits-breakdown">
                                                <div className="credits-breakdown-left">
                                                  <p
                                                    style={{
                                                      color: "#6c757d",
                                                      fontWeight: 600,
                                                      fontSize: "14px",
                                                    }}
                                                  >
                                                    {subscriptionInfoData?.plan}{" "}
                                                    (
                                                    {subscriptionInfoData?.startDate
                                                      ? new Date(
                                                          subscriptionInfoData?.startDate
                                                        ).toDateString()
                                                      : ""}{" "}
                                                    -{" "}
                                                    {subscriptionInfoData?.renewalDate
                                                      ? new Date(
                                                          subscriptionInfoData?.renewalDate
                                                        ).toDateString()
                                                      : ""}
                                                    )
                                                  </p>
                                                  {/* <p
                                                    style={{
                                                      color: "#6c757d",
                                                      fontWeight: 600,
                                                      fontSize: "14px",
                                                    }}
                                                  >
                                                    Free (May 27 2024 - Jun 26
                                                    2024) Auto-renewal
                                                  </p> */}
                                                </div>
                                                <div className="credits-breakdown-right">
                                                  <p
                                                    style={{
                                                      color: "#6c757d",
                                                      fontWeight: 600,
                                                      fontSize: "14px",
                                                    }}
                                                  >
                                                    {
                                                      subscriptionInfoData?.credits
                                                    }{" "}
                                                  </p>
                                                  {/* <p
                                                    style={{
                                                      color: "#6c757d",
                                                      fontWeight: 600,
                                                      fontSize: "14px",
                                                    }}
                                                  >
                                                    50
                                                  </p> */}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {/* <div className="credit-user-btm">
                                      <div className="credit-user-maim">
                                        <div className="credit-user-top">
                                          <div
                                            className="credit-user-top-left"
                                            style={{ marginBottom: "10px" }}
                                          >
                                            <h4
                                              style={{
                                                fontWeight: 600,
                                              }}
                                            >
                                              Team Members
                                            </h4>
                                          </div>
                                          <div className="credit-user-top-right">
                                            <h4>1 / 3</h4>
                                          </div>
                                        </div>
                                        <div className="progress mb-2 progress-md">
                                          <div
                                            className="progress-bar "
                                            role="progressbar"
                                            style={{
                                              width: "25%",
                                              backgroundColor:
                                                "rgb(108 117 125)",
                                            }}
                                            aria-valuenow="25"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                          ></div>
                                        </div>
                                        <a href="team.html">Manage Team</a>
                                      </div>
                                    </div> */}
                                  </div>
                                </div>
                              </div>
                            )}
                            {subscriptionInfoLoading && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  height: "100px",
                                }}
                              >
                                <div className="d-flex justify-content-center">
                                  <div
                                    className="spinner-border"
                                    role="status"
                                  ></div>
                                </div>
                              </div>
                            )}
                            {!subscriptionInfoData &&
                              !subscriptionInfoLoading && (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    height: "100px",
                                  }}
                                >
                                  <h4>No Subscription Info Found</h4>
                                </div>
                              )}

                            <div
                              className={
                                "tab-pane" +
                                (active === "billing-info"
                                  ? " show active"
                                  : "")
                              }
                              id="billing-info"
                              style={{
                                display:
                                  active === "billing-info" ? "block" : "none",
                              }}
                            >
                              {/* <!-- Form row --> */}
                              <div className="row">
                                <div className="col-12">
                                  <div className="card">
                                    <div className="card-body">
                                      <Formik
                                        onSubmit={onSubmit}
                                        initialValues={{
                                          country: country || "",
                                          accountType: "",
                                          firstName: name || "",
                                          lastName: lastName || "",
                                          address: address || "",
                                          city: city || "",
                                          state: state || "",
                                          zip: zip || "",
                                        }}
                                      >
                                        {({ isSubmitting }) => (
                                          <Form>
                                            <div className="row">
                                              <div className="mb-3 col-md-6">
                                                <label
                                                  htmlFor="country"
                                                  className="form-label"
                                                >
                                                  Country
                                                </label>
                                                <Field
                                                  as="select"
                                                  name="country"
                                                  className="form-select"
                                                  value={country}
                                                  onChange={(e) => {
                                                    setCountry(e.target.value);
                                                  }}
                                                >
                                                  <option disabled>
                                                    Select your country
                                                  </option>
                                                  {data?.map(
                                                    (country, index) => (
                                                      <option
                                                        key={index}
                                                        value={country?.name}
                                                      >
                                                        {country?.name}
                                                      </option>
                                                    )
                                                  )}
                                                </Field>
                                                <ErrorMessage
                                                  name="country"
                                                  component="div"
                                                  style={{
                                                    color: "red",
                                                    fontSize: "12px",
                                                  }}
                                                />
                                              </div>
                                              <div className="mb-3 col-md-6">
                                                <label
                                                  htmlFor="accountType"
                                                  className="form-label"
                                                >
                                                  Type of account
                                                </label>
                                                <Field
                                                  as="select"
                                                  name="accountType"
                                                  className="form-select"
                                                >
                                                  <option value="Individual">
                                                    Individual
                                                  </option>
                                                  <option value="Organization">
                                                    Organization
                                                  </option>
                                                </Field>
                                                <ErrorMessage
                                                  name="accountType"
                                                  component="div"
                                                  style={{
                                                    color: "red",
                                                    fontSize: "12px",
                                                  }}
                                                />
                                              </div>
                                              <div className="col-md-6 mb-3">
                                                <label
                                                  htmlFor="firstName"
                                                  className="form-label"
                                                >
                                                  First name
                                                </label>
                                                <Field
                                                  type="text"
                                                  name="firstName"
                                                  className="form-control"
                                                  placeholder="First name"
                                                  value={name}
                                                  onChange={(e) =>
                                                    setName(e.target.value)
                                                  }
                                                />
                                              </div>
                                              <div className="col-md-6 mb-3">
                                                <label
                                                  htmlFor="lastName"
                                                  className="form-label"
                                                >
                                                  Last name
                                                </label>
                                                <Field
                                                  type="text"
                                                  name="lastName"
                                                  className="form-control"
                                                  placeholder="Last name"
                                                  value={lastName}
                                                  onChange={(e) =>
                                                    setLastName(e.target.value)
                                                  }
                                                />
                                              </div>
                                            </div>
                                            <div className="mb-3">
                                              <label
                                                htmlFor="address"
                                                className="form-label"
                                              >
                                                Address
                                              </label>
                                              <Field
                                                type="text"
                                                name="address"
                                                className="form-control"
                                                placeholder="1234 Main St"
                                                value={address}
                                                onChange={(e) =>
                                                  setAddress(e.target.value)
                                                }
                                              />
                                              <ErrorMessage
                                                name="address"
                                                component="div"
                                                style={{
                                                  color: "red",
                                                  fontSize: "12px",
                                                }}
                                              />
                                            </div>
                                            <div className="row">
                                              <div className="mb-3 col-md-6">
                                                <label
                                                  htmlFor="city"
                                                  className="form-label"
                                                >
                                                  City
                                                </label>
                                                <Field
                                                  type="text"
                                                  name="city"
                                                  className="form-control"
                                                  placeholder="Bengaluru"
                                                  value={city}
                                                  onChange={(e) =>
                                                    setCity(e.target.value)
                                                  }
                                                />
                                                <ErrorMessage
                                                  name="city"
                                                  component="div"
                                                  style={{
                                                    color: "red",
                                                    fontSize: "12px",
                                                  }}
                                                />
                                              </div>
                                              <div className="mb-3 col-md-4">
                                                <label
                                                  htmlFor="state"
                                                  className="form-label"
                                                >
                                                  State
                                                </label>
                                                <Field
                                                  type="text"
                                                  name="state"
                                                  className="form-control"
                                                  placeholder="Bengaluru"
                                                  value={state}
                                                  onChange={(e) =>
                                                    setState(e.target.value)
                                                  }
                                                />
                                                <ErrorMessage
                                                  name="state"
                                                  component="div"
                                                  style={{
                                                    color: "red",
                                                    fontSize: "12px",
                                                  }}
                                                />
                                              </div>
                                              <div className="mb-3 col-md-2">
                                                <label
                                                  htmlFor="zip"
                                                  className="form-label"
                                                >
                                                  Zip
                                                </label>
                                                <Field
                                                  type="text"
                                                  name="zip"
                                                  className="form-control"
                                                  placeholder="560002"
                                                  value={zip}
                                                  onChange={(e) =>
                                                    setZip(e.target.value)
                                                  }
                                                />
                                                <ErrorMessage
                                                  name="zip"
                                                  component="div"
                                                  style={{
                                                    color: "red",
                                                    fontSize: "12px",
                                                  }}
                                                />
                                              </div>
                                            </div>
                                            <button
                                              type="submit"
                                              className="btn btn-dark waves-effect waves-light"
                                            >
                                              Save
                                            </button>
                                          </Form>
                                        )}
                                      </Formik>{" "}
                                    </div>
                                    {/* <!-- end card-body --> */}
                                  </div>
                                  {/* <!-- end card--> */}
                                </div>
                                {/* <!-- end col --> */}
                              </div>
                              {/* <!-- end row --> */}
                            </div>
                            <div
                              className={
                                "tab-pane" +
                                (active === "payment-method"
                                  ? " show active"
                                  : "")
                              }
                              id="payment-method"
                              style={{
                                display:
                                  active === "payment-method"
                                    ? "block"
                                    : "none",
                                width: isSmallScreen ? "300px" : "100%",
                                marginLeft: isSmallScreen ? "-25%" : "",
                              }}
                            >
                              {subscriptionData?.result?.data?.length > 0 ? (
                                subscriptionData?.result?.data?.map((data) => (
                                  <div
                                    className="payment-card"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      padding: "10px",
                                      // border: "1px solid #e5e5e5",
                                      borderRadius: "5px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    <div
                                      className="pay-card"
                                      style={{
                                        width: "100px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: "10px",
                                      }}
                                    >
                                      {data.isDefault ? (
                                        <p
                                          style={{
                                            fontSize: "14px",
                                            color: "rgb(255, 100, 113)",
                                          }}
                                        >
                                          Default
                                        </p>
                                      ) : (
                                        <p></p>
                                      )}
                                      {data.card?.brand === "visa" ? (
                                        <FaCcVisa
                                          style={{
                                            fontSize: "30px",
                                            color: "#6c757d",
                                          }}
                                        />
                                      ) : (
                                        <FaCreditCard
                                          style={{
                                            fontSize: "30px",
                                            color: "#6c757d",
                                          }}
                                        />
                                      )}
                                    </div>
                                    <div className="pay-card-name">
                                      <h5
                                        style={{
                                          fontWeight: 600,
                                        }}
                                      >
                                        {data?.card?.brand}
                                      </h5>
                                      <p>**** {data?.card?.last4}</p>
                                    </div>
                                    <div className="pay-card-date">
                                      <h5
                                        style={{
                                          fontWeight: 600,
                                        }}
                                      >
                                        Expiration Date
                                      </h5>
                                      <p>
                                        {data?.card?.exp_month} /{" "}
                                        {data?.card?.exp_year}
                                      </p>
                                    </div>
                                    <div className="change-card-name">
                                      <Button
                                        disabled={data.isDefault}
                                        onClick={() =>
                                          setDeletingPaymentMethodId(data.id)
                                        }
                                        style={{
                                          color: "white",
                                          background: data.isDefault
                                            ? "gray"
                                            : "rgb(255, 100, 113)",
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        Delete Card
                                      </Button>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <>
                                  {!paymentMethod ? (
                                    <div
                                      className="payment-card"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "10px",
                                        border: "1px solid #e5e5e5",
                                        borderRadius: "5px",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      <div className="pay-card">
                                        {data.card?.brand === "visa" ? (
                                          <FaCcVisa
                                            style={{
                                              fontSize: "30px",
                                              color: "#6c757d",
                                            }}
                                          />
                                        ) : (
                                          <FaCreditCard
                                            style={{
                                              fontSize: "30px",
                                              color: "#6c757d",
                                            }}
                                          />
                                        )}
                                      </div>
                                      <div className="pay-card-name">
                                        <h5
                                          style={{
                                            fontWeight: 600,
                                          }}
                                        >
                                          No Payment Method
                                        </h5>
                                      </div>
                                      <div className="change-card-name">
                                        <button
                                          type="button"
                                          className="btn btn-dark"
                                          onClick={() => setPaymentMethod(true)}
                                        >
                                          Add Card
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      className="payment-card"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "10px",
                                        border: "1px solid #e5e5e5",
                                        borderRadius: "5px",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      <div className="pay-card">
                                        <PaymentForm
                                          setPaymentMethod={setPaymentMethod}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            <div
                              className={
                                "tab-pane" +
                                (active === "invoices" ? " show active" : "")
                              }
                              id="invoices"
                              style={{
                                display:
                                  active === "invoices" ? "block" : "none",
                              }}
                            >
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="card">
                                    <div className="card-body">
                                      <div className="table-responsive">
                                        <table className="table table-bordered table-hover mb-0">
                                          <thead>
                                            <tr>
                                              <th>Date</th>
                                              <th>Plan</th>
                                              <th>Price</th>
                                              <th>Invoice</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {subscriptionInvoicesData?.result
                                              ?.length > 0 &&
                                              subscriptionInvoicesData?.result?.map(
                                                (invoice) => (
                                                  <tr>
                                                    <td>
                                                      {new Date(
                                                        invoice?.date
                                                      ).toDateString()}
                                                    </td>
                                                    <td>{invoice?.plan}</td>
                                                    <td>
                                                      $
                                                      {invoice?.amountDue / 100}
                                                    </td>
                                                    <td>
                                                      <button
                                                        type="button"
                                                        className="btn btn-dark"
                                                        onClick={() =>
                                                          window.open(
                                                            invoice?.view
                                                          )
                                                        }
                                                      >
                                                        View
                                                      </button>
                                                    </td>
                                                  </tr>
                                                )
                                              )}
                                            {subscriptionInvoicesLoading && (
                                              <tr>
                                                <td colSpan="4">
                                                  <div className="d-flex justify-content-center">
                                                    <div
                                                      className="spinner-border"
                                                      role="status"
                                                    ></div>
                                                  </div>
                                                </td>
                                              </tr>
                                            )}
                                            {/* <tr>
                                              <td>2024-04-22</td>
                                              <td>Advanced</td>
                                              <td>$79.00</td>
                                              <td>
                                                <button
                                                  type="button"
                                                  className="btn btn-dark"
                                                >
                                                  View
                                                </button>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>2024-03-23</td>
                                              <td>Advanced</td>
                                              <td>$79.00</td>
                                              <td>
                                                <button
                                                  type="button"
                                                  className="btn btn-dark"
                                                >
                                                  View
                                                </button>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>2024-03-20</td>
                                              <td>Pro</td>
                                              <td>$119.00</td>
                                              <td>
                                                <button
                                                  type="button"
                                                  className="btn btn-dark"
                                                >
                                                  View
                                                </button>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>2024-02-20</td>
                                              <td>Advanced</td>
                                              <td>$79.00</td>
                                              <td>
                                                <button
                                                  type="button"
                                                  className="btn btn-dark"
                                                >
                                                  View
                                                </button>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>2024-01-14</td>
                                              <td>Advanced</td>
                                              <td>$79.00</td>
                                              <td>
                                                <button
                                                  type="button"
                                                  className="btn btn-dark"
                                                >
                                                  View
                                                </button>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>2023-12-14</td>
                                              <td>Advanced</td>
                                              <td>$79.00</td>
                                              <td>
                                                <button
                                                  type="button"
                                                  className="btn btn-dark"
                                                >
                                                  View
                                                </button>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>2023-11-14</td>
                                              <td>Advanced</td>
                                              <td>$79.00</td>
                                              <td>
                                                <button
                                                  type="button"
                                                  className="btn btn-dark"
                                                >
                                                  View
                                                </button>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>2023-10-14</td>
                                              <td>Advanced</td>
                                              <td>$79.00</td>
                                              <td>
                                                <button
                                                  type="button"
                                                  className="btn btn-dark"
                                                >
                                                  View
                                                </button>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>2023-09-14</td>
                                              <td>Advanced</td>
                                              <td>$79.00</td>
                                              <td>
                                                <button
                                                  type="button"
                                                  className="btn btn-dark"
                                                >
                                                  View
                                                </button>
                                              </td>
                                            </tr> */}
                                          </tbody>
                                        </table>
                                      </div>

                                      {/* <nav>
                                        <ul className="pagination pagination-rounded pt-3 d-flex justify-content-center">
                                          <li className="page-item">
                                            <a
                                              className="page-link"
                                              href="javascript: void(0);"
                                              aria-label="Previous"
                                            >
                                              <span aria-hidden="true">
                                                &laquo;
                                              </span>
                                            </a>
                                          </li>
                                          <li className="page-item">
                                            <a
                                              className="page-link"
                                              href="javascript: void(0);"
                                            >
                                              1
                                            </a>
                                          </li>
                                          <li className="page-item">
                                            <a
                                              className="page-link"
                                              href="javascript: void(0);"
                                            >
                                              2
                                            </a>
                                          </li>
                                          <li className="page-item active">
                                            <a
                                              className="page-link"
                                              href="javascript: void(0);"
                                            >
                                              3
                                            </a>
                                          </li>
                                          <li className="page-item">
                                            <a
                                              className="page-link"
                                              href="javascript: void(0);"
                                            >
                                              4
                                            </a>
                                          </li>
                                          <li className="page-item">
                                            <a
                                              className="page-link"
                                              href="javascript: void(0);"
                                            >
                                              5
                                            </a>
                                          </li>
                                          <li className="page-item">
                                            <a
                                              className="page-link"
                                              href="javascript: void(0);"
                                              aria-label="Next"
                                            >
                                              <span aria-hidden="true">
                                                &raquo;
                                              </span>
                                            </a>
                                          </li>
                                        </ul>
                                      </nav> */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* <!-- end row --> */}
                            </div>
                          </div>
                        </div>
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

      {/* delete payment method dialog */}

      {/* {
        deletingPaymentMethodId && ( */}
      <Dialog
        open={Boolean(deletingPaymentMethodId)}
        onClose={() => setDeletingPaymentMethodId(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Payment Method"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this payment method?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeletingPaymentMethodId(null)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            disabled={paymentMethodDeleting}
            onClick={handleDeletePaymentMethod}
            color="secondary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* )
      } */}

      {/* cancel subscription dialogue */}
      <Dialog
        open={opens}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {!planInfoLoading &&
              !isFetchingPlanInfo &&
              (userData?.plan?.planName === "Advance" ||
                userData?.plan?.planName === "Basic" ||
                userData?.plan?.planName === "Enterprise") && (
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "left",
                    color: "#424770",
                    fontSize: "16px",
                    fontWeight: 400,
                    backgroundColor: "#f5f5f5",
                    padding: 2,
                    borderRadius: 1,
                    color: "#424770",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    After unsubscribing, your account will be switched to the
                    Free Plan with limited features. All of your data including
                    leads, sequences, folders, and statuses will be disabled and
                    locked. You can always upgrade your plan to access the
                    features again.
                  </span>

                  {/* <span
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      textAlign: "left",
                    }}
                  >
                    {planInfo?.result?.userFolders > 1 ? (
                      <Tooltip
                        title="Go to sidebar and delete folders to meet the limit."
                        placement="top"
                        arrow
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: "#f34336",
                              color: "#ffffff",
                              fontSize: "14px",
                              fontWeight: 500,
                              padding: "10px",
                              borderRadius: "4px",
                              lineHeight: "1.5",
                            },
                          },
                          arrow: {
                            sx: {
                              color: "#f44336",
                            },
                          },
                        }}
                      >
                        <span>
                          <FaTimesCircle
                            color="red"
                            style={{
                              cursor: "pointer",
                            }}
                            size={17}
                          />
                        </span>
                      </Tooltip>
                    ) : (
                      <FaCheckCircle color="green" size={15} />
                    )}{" "}
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        alignItems: "flex-start",
                        textAlign: "left",
                      }}
                    >
                      1 Folder allowed. Currently you have{" "}
                      {`"${planInfo?.result?.userFolders}"`} folders.
                    </span>
                  </span>
                  <span
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      textAlign: "left",
                    }}
                  >
                    {planInfo?.result?.userSequences > 0 ? (
                      <Tooltip
                        title="Remove the sequences by clicking on lead manager and then sequences."
                        placement="top"
                        arrow
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: "orange",
                              color: "#ffffff",
                              fontSize: "14px",
                              fontWeight: 500,
                              padding: "10px",
                              borderRadius: "4px",
                              lineHeight: "1.5",
                            },
                          },
                          arrow: {
                            sx: {
                              color: "orange",
                            },
                          },
                        }}
                      >
                        <span>
                          <FaExclamationCircle
                            color="orange"
                            style={{
                              cursor: "pointer",
                            }}
                            size={17}
                          />
                        </span>
                      </Tooltip>
                    ) : (
                      <FaCheckCircle color="green" size={15} />
                    )}{" "}
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        alignItems: "flex-start",
                        textAlign: "left",
                      }}
                    >
                      No sequences allowed. Currently you have{" "}
                      {`"${planInfo?.result?.userSequences}"`} sequences
                    </span>
                  </span>
                  <span
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      textAlign: "left",
                    }}
                  >
                    {planInfo?.result?.userStatuses > 0 ? (
                      <Tooltip
                        title="Go to Lead Manager and delete the statuses at lead statuses."
                        placement="top"
                        arrow
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: "orange",
                              color: "#ffffff",
                              fontSize: "14px",
                              fontWeight: 500,
                              padding: "10px",
                              borderRadius: "4px",
                              lineHeight: "1.5",
                            },
                          },
                          arrow: {
                            sx: {
                              color: "orange",
                            },
                          },
                        }}
                      >
                        <span>
                          <FaExclamationCircle
                            color="orange"
                            style={{
                              cursor: "pointer",
                            }}
                            size={17}
                          />
                        </span>
                      </Tooltip>
                    ) : (
                      <FaCheckCircle color="green" size={15} />
                    )}{" "}
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        alignItems: "flex-start",
                        textAlign: "left",
                      }}
                    >
                      No lead statuses allowed. Currently you have{" "}
                      {`"${planInfo?.result?.userStatuses}" `}statuses.
                    </span>
                  </span>
                  <span
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      textAlign: "left",
                    }}
                  >
                    {planInfo?.result?.templateWithMaxFollowups > 0 ? (
                      <Tooltip
                        title="go to sequence Templates in lead manager and delete the templates."
                        placement="top"
                        arrow
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: "orange",
                              color: "#ffffff",
                              fontSize: "14px",
                              fontWeight: 500,
                              padding: "10px",
                              borderRadius: "4px",
                              lineHeight: "1.5",
                            },
                          },
                          arrow: {
                            sx: {
                              color: "orange",
                            },
                          },
                        }}
                      >
                        <span>
                          <FaExclamationCircle
                            color="orange"
                            style={{
                              cursor: "pointer",
                            }}
                            size={17}
                          />
                        </span>
                      </Tooltip>
                    ) : (
                      <FaCheckCircle color="green" size={20} />
                    )}{" "}
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        alignItems: "flex-start",
                        textAlign: "left",
                      }}
                    >
                      No follow-ups allowed. Currently you have{" "}
                      {`"${planInfo?.result?.templateWithMaxFollowups}"`}{" "}
                      templates with more than 5 Follow-ups.
                    </span>
                  </span> */}
                </Typography>
              )}
            {(userData?.plan?.planName === "Advance" ||
              userData?.plan?.planName === "Basic" ||
              userData?.plan?.planName === "Enterprise") &&
              (isFetchingPlanInfo || planInfoLoading) && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100px",
                  }}
                >
                  <CircularProgress color="primary" size={30} />
                </div>
              )}
          </DialogContentText>
        </DialogContent>
        {/* {planInfo?.result?.userFolders === 1 &&
          planInfo?.result?.userSequences === 0 &&
          planInfo?.result?.userStatuses === 0 &&
          planInfo?.result?.templateWithMaxFollowups === 0 && ( */}
        <DialogTitle id="alert-dialog-title">
          {" Are you sure you want to cancel your subscription ?"}
        </DialogTitle>
        {/* // )} */}
        {/* {planInfo?.result?.userFolders === 1 &&
          planInfo?.result?.userSequences === 0 &&
          planInfo?.result?.userStatuses === 0 &&
          planInfo?.result?.templateWithMaxFollowups === 0 && ( */}
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button
            sx={{
              color: "#ff0000",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onClick={handleCancelSubscription}
            color="primary"
            autoFocus
            disabled={cancelSubscriptionLoading}
          >
            {cancelSubscriptionLoading ? (
              <div
                className="spinner-border spinner-border-sm"
                role="status"
              ></div>
            ) : (
              "Unsubscribe"
            )}
          </Button>
        </DialogActions>
        {/* )} */}
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
  );
};

export default Subscription;

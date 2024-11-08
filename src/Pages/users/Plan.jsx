import React, { useEffect, useState } from "react";
import { FaCheck, FaRightLeft } from "react-icons/fa6";
import {
  useGetAllSeePlansQuery,
  useGetCustomerBillingPortalQuery,
  useGetPaymentMethodQuery,
  useGetPlansFeatureInfoQuery,
  useGetPlansMutation,
  useLazyGetCustomerBillingPortalQuery,
} from "../../slices/customerSlice";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PaymentForm from "../../services/PaymentForm";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Box } from "@mui/system";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Plan = ({ collapsed }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { userData } = useSelector((state) => state.userData);
  const [activeTab, setActiveTab] = useState("month");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPlan, setCurrentPlan] = useState();
  const [paymentPrice, setPaymentPrice] = useState();
  const [showMessage, setShowMessage] = useState(false);
  const [planPrice, setPlanPrice] = useState();
  const [planMonthlyPrice, setPlanMonthlyPrice] = useState();
  const [planName, setPlanName] = useState();
  const [planInterval, setPlanInterval] = useState();
  const [addingNewPaymentMethod, setAddingNewPaymentMethod] = useState(false);
  const [planId, setPlanId] = useState();
  const [
    postChooseSubscription,
    {
      isLoading: postChooseSubscriptionLoading,
      isSuccess: postChooseSubscriptionSuccess,
    },
  ] = useGetPlansMutation();
  const [
    triggerCustomerBilling,
    {
      data: billingPortalUrl,
      isLoading: customerBillingPortalLoading,
      isSuccess: customerBillingPortalSuccess,
    },
  ] = useLazyGetCustomerBillingPortalQuery();
  const { auth } = useSelector((state) => state.auth);
  const {
    data: plans,
    isLoading: isLoading,
    isFetching: isFetchingPlans,
    refetch: refetchPlans,
  } = useGetAllSeePlansQuery({
    duration: activeTab,
  });
  const {
    data: planInfo,
    isLoading: planInfoLoading,
    isFetching: isFetchingPlanInfo,
    error: planInfoError,
    refetch: refetchPlanInfo,
  } = useGetPlansFeatureInfoQuery({
    id: planId,
  });
  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    error: subscriptionError,
    refetch: refetchSubscription,
  } = useGetPaymentMethodQuery();

  const handleChoosePlan = async () => {
    await postChooseSubscription({
      body: {
        priceId: paymentPrice,
      },
    })
      .unwrap()
      .then(() => {
        toast.success("Subscription Created Successfully");
        setOpenDialog(false);
        setCurrentPlan(true);
        setShowMessage(false);
        refetchPlans();
      })
      .catch((error) => {
        toast.error("Error Creating Subscription");
      });
  };

  const handleCustomerBillingPortal = async () => {
    //customer billing porta

    // const data = await triggerCustomerBilling();
    // if (data?.data?.result?.url) {
    //   window.open(data.data.result.url)
    // }

    setAddingNewPaymentMethod((prev) => !prev);
  };

  const currencyOptions = [
    { name: "USD", value: "usd", icon: "fa-dollar-sign" },
    { name: "AED", value: "aed", icon: "fa-money-bill-wave" },
    { name: "AFN", value: "afn", icon: "fa-money-bill-wave" },
    { name: "ALL", value: "all", icon: "fa-money-bill-wave" },
    { name: "AMD", value: "amd", icon: "fa-money-bill-wave" },
    { name: "ANG", value: "ang", icon: "fa-money-bill-wave" },
    { name: "AOA", value: "aoa", icon: "fa-money-bill-wave" },
    { name: "ARS", value: "ars", icon: "fa-money-bill-wave" },
    { name: "AUD", value: "aud", icon: "fa-dollar-sign" },
    { name: "AWG", value: "awg", icon: "fa-money-bill-wave" },
    { name: "AZN", value: "azn", icon: "fa-money-bill-wave" },
    { name: "BAM", value: "bam", icon: "fa-money-bill-wave" },
    { name: "BBD", value: "bbd", icon: "fa-money-bill-wave" },
    { name: "BDT", value: "bdt", icon: "fa-money-bill-wave" },
    { name: "BGN", value: "bgn", icon: "fa-money-bill-wave" },
    { name: "BHD", value: "bhd", icon: "fa-money-bill-wave" },
    { name: "BIF", value: "bif", icon: "fa-money-bill-wave" },
    { name: "BMD", value: "bmd", icon: "fa-dollar-sign" },
    { name: "BND", value: "bnd", icon: "fa-money-bill-wave" },
    { name: "BOB", value: "bob", icon: "fa-money-bill-wave" },
    { name: "BRL", value: "brl", icon: "fa-money-bill-wave" },
    { name: "BSD", value: "bsd", icon: "fa-money-bill-wave" },
    { name: "BWP", value: "bwp", icon: "fa-money-bill-wave" },
    { name: "BYN", value: "byn", icon: "fa-money-bill-wave" },
    { name: "BZD", value: "bzd", icon: "fa-money-bill-wave" },
    { name: "CAD", value: "cad", icon: "fa-dollar-sign" },
    { name: "CDF", value: "cdf", icon: "fa-money-bill-wave" },
    { name: "CHF", value: "chf", icon: "fa-money-bill-wave" },
    { name: "CLP", value: "clp", icon: "fa-money-bill-wave" },
    { name: "CNY", value: "cny", icon: "fa-yen-sign" },
    { name: "COP", value: "cop", icon: "fa-money-bill-wave" },
    { name: "CRC", value: "crc", icon: "fa-money-bill-wave" },
    { name: "CVE", value: "cve", icon: "fa-money-bill-wave" },
    { name: "CZK", value: "czk", icon: "fa-money-bill-wave" },
    { name: "DJF", value: "djf", icon: "fa-money-bill-wave" },
    { name: "DKK", value: "dkk", icon: "fa-money-bill-wave" },
    { name: "DOP", value: "dop", icon: "fa-money-bill-wave" },
    { name: "DZD", value: "dzd", icon: "fa-money-bill-wave" },
    { name: "EGP", value: "egp", icon: "fa-money-bill-wave" },
    { name: "ETB", value: "etb", icon: "fa-money-bill-wave" },
    { name: "EUR", value: "eur", icon: "fa-euro-sign" },
    { name: "FJD", value: "fjd", icon: "fa-money-bill-wave" },
    { name: "FKP", value: "fkp", icon: "fa-money-bill-wave" },
    { name: "GBP", value: "gbp", icon: "fa-pound-sign" },
    { name: "GEL", value: "gel", icon: "fa-money-bill-wave" },
    { name: "GIP", value: "gip", icon: "fa-money-bill-wave" },
    { name: "GMD", value: "gmd", icon: "fa-money-bill-wave" },
    { name: "GNF", value: "gnf", icon: "fa-money-bill-wave" },
    { name: "GTQ", value: "gtq", icon: "fa-money-bill-wave" },
    { name: "GYD", value: "gyd", icon: "fa-money-bill-wave" },
    { name: "HKD", value: "hkd", icon: "fa-dollar-sign" },
    { name: "HNL", value: "hnl", icon: "fa-money-bill-wave" },
    { name: "HRK", value: "hrk", icon: "fa-money-bill-wave" },
    { name: "HTG", value: "htg", icon: "fa-money-bill-wave" },
    { name: "HUF", value: "huf", icon: "fa-money-bill-wave" },
    { name: "IDR", value: "idr", icon: "fa-money-bill-wave" },
    { name: "ILS", value: "ils", icon: "fa-shekel-sign" },
    { name: "INR", value: "inr", icon: "fa-rupee-sign" },
    { name: "ISK", value: "isk", icon: "fa-money-bill-wave" },
    { name: "JMD", value: "jmd", icon: "fa-money-bill-wave" },
    { name: "JOD", value: "jod", icon: "fa-money-bill-wave" },
    { name: "JPY", value: "jpy", icon: "fa-yen-sign" },
    { name: "KES", value: "kes", icon: "fa-money-bill-wave" },
    { name: "KGS", value: "kgs", icon: "fa-money-bill-wave" },
    { name: "KHR", value: "khr", icon: "fa-money-bill-wave" },
    { name: "KMF", value: "kmf", icon: "fa-money-bill-wave" },
    { name: "KRW", value: "krw", icon: "fa-won-sign" },
    { name: "KWD", value: "kwd", icon: "fa-money-bill-wave" },
    { name: "KYD", value: "kyd", icon: "fa-money-bill-wave" },
    { name: "KZT", value: "kzt", icon: "fa-money-bill-wave" },
    { name: "LAK", value: "lak", icon: "fa-money-bill-wave" },
    { name: "LBP", value: "lbp", icon: "fa-money-bill-wave" },
    { name: "LKR", value: "lkr", icon: "fa-money-bill-wave" },
    { name: "LRD", value: "lrd", icon: "fa-money-bill-wave" },
    { name: "LSL", value: "lsl", icon: "fa-money-bill-wave" },
    { name: "MAD", value: "mad", icon: "fa-money-bill-wave" },
    { name: "MDL", value: "mdl", icon: "fa-money-bill-wave" },
    { name: "MGA", value: "mga", icon: "fa-money-bill-wave" },
    { name: "MKD", value: "mkd", icon: "fa-money-bill-wave" },
    { name: "MMK", value: "mmk", icon: "fa-money-bill-wave" },
    { name: "MNT", value: "mnt", icon: "fa-money-bill-wave" },
    { name: "MOP", value: "mop", icon: "fa-money-bill-wave" },
    { name: "MUR", value: "mur", icon: "fa-money-bill-wave" },
    { name: "MVR", value: "mvr", icon: "fa-money-bill-wave" },
    { name: "MWK", value: "mwk", icon: "fa-money-bill-wave" },
    { name: "MXN", value: "mxn", icon: "fa-dollar-sign" },
    { name: "MYR", value: "myr", icon: "fa-money-bill-wave" },
    { name: "MZN", value: "mzn", icon: "fa-money-bill-wave" },
    { name: "NAD", value: "nad", icon: "fa-money-bill-wave" },
    { name: "NGN", value: "ngn", icon: "fa-money-bill-wave" },
    { name: "NIO", value: "nio", icon: "fa-money-bill-wave" },
    { name: "NOK", value: "nok", icon: "fa-money-bill-wave" },
    { name: "NPR", value: "npr", icon: "fa-money-bill-wave" },
    { name: "NZD", value: "nzd", icon: "fa-dollar-sign" },
    { name: "OMR", value: "omr", icon: "fa-money-bill-wave" },
    { name: "PAB", value: "pab", icon: "fa-money-bill-wave" },
    { name: "PEN", value: "pen", icon: "fa-money-bill-wave" },
    { name: "PGK", value: "pgk", icon: "fa-money-bill-wave" },
    { name: "PHP", value: "php", icon: "fa-money-bill-wave" },
    { name: "PKR", value: "pkr", icon: "fa-money-bill-wave" },
    { name: "PLN", value: "pln", icon: "fa-money-bill-wave" },
    { name: "PYG", value: "pyg", icon: "fa-money-bill-wave" },
    { name: "QAR", value: "qar", icon: "fa-money-bill-wave" },
    { name: "RON", value: "ron", icon: "fa-money-bill-wave" },
    { name: "RSD", value: "rsd", icon: "fa-money-bill-wave" },
    { name: "RUB", value: "rub", icon: "fa-money-bill-wave" },
    { name: "RWF", value: "rwf", icon: "fa-money-bill-wave" },
    { name: "SAR", value: "sar", icon: "fa-money-bill-wave" },
    { name: "SBD", value: "sbd", icon: "fa-money-bill-wave" },
    { name: "SCR", value: "scr", icon: "fa-money-bill-wave" },
    { name: "SDG", value: "sdg", icon: "fa-money-bill-wave" },
    { name: "SEK", value: "sek", icon: "fa-money-bill-wave" },
    { name: "SGD", value: "sgd", icon: "fa-dollar-sign" },
    { name: "SHP", value: "shp", icon: "fa-money-bill-wave" },
    { name: "SLL", value: "sll", icon: "fa-money-bill-wave" },
    { name: "SOS", value: "sos", icon: "fa-money-bill-wave" },
    { name: "SRD", value: "srd", icon: "fa-money-bill-wave" },
    { name: "SSP", value: "ssp", icon: "fa-money-bill-wave" },
    { name: "STN", value: "stn", icon: "fa-money-bill-wave" },
    { name: "SYP", value: "syp", icon: "fa-money-bill-wave" },
    { name: "SZL", value: "szl", icon: "fa-money-bill-wave" },
    { name: "THB", value: "thb", icon: "fa-baht-sign" },
    { name: "TJS", value: "tjs", icon: "fa-money-bill-wave" },
    { name: "TMT", value: "tmt", icon: "fa-money-bill-wave" },
    { name: "TND", value: "tnd", icon: "fa-money-bill-wave" },
    { name: "TOP", value: "top", icon: "fa-money-bill-wave" },
    { name: "TRY", value: "try", icon: "fa-money-bill-wave" },
    { name: "TTD", value: "ttd", icon: "fa-money-bill-wave" },
    { name: "TVD", value: "tvd", icon: "fa-money-bill-wave" },
    { name: "TZS", value: "tzs", icon: "fa-money-bill-wave" },
    { name: "UAH", value: "uah", icon: "fa-money-bill-wave" },
    { name: "UGX", value: "ugx", icon: "fa-money-bill-wave" },
    { name: "USD", value: "usd", icon: "fa-dollar-sign" },
    { name: "UYU", value: "uyu", icon: "fa-money-bill-wave" },
    { name: "UZS", value: "uzs", icon: "fa-money-bill-wave" },
    { name: "VES", value: "ves", icon: "fa-money-bill-wave" },
    { name: "VND", value: "vnd", icon: "fa-money-bill-wave" },
    { name: "VUV", value: "vuv", icon: "fa-money-bill-wave" },
    { name: "WST", value: "wst", icon: "fa-money-bill-wave" },
    { name: "XAF", value: "xaf", icon: "fa-money-bill-wave" },
    { name: "XCD", value: "xcd", icon: "fa-money-bill-wave" },
    { name: "XDR", value: "xdr", icon: "fa-money-bill-wave" },
    { name: "XOF", value: "xof", icon: "fa-money-bill-wave" },
    { name: "XPF", value: "xpf", icon: "fa-money-bill-wave" },
    { name: "YER", value: "yer", icon: "fa-money-bill-wave" },
    { name: "ZAR", value: "zar", icon: "fa-money-bill-wave" },
    { name: "ZMK", value: "zmk", icon: "fa-money-bill-wave" },
    { name: "ZWL", value: "zwl", icon: "fa-money-bill-wave" },
  ];

  useEffect(() => {
    refetchPlans();
    refetchSubscription();
  }, [postChooseSubscriptionSuccess]);

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
                    <li className="breadcrumb-item active">Subscriptions</li>
                    <li className="breadcrumb-item">New subscription</li>
                  </ol>
                </div>
                <h4 className="page-title">Plans</h4>
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
                          <h3>Plans</h3>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-xl-12">
                        <ul
                          className="nav nav-pills navtab-bg"
                          id="monthSix"
                          style={{
                            marginBottom: "50px",
                          }}
                        >
                          <li className="nav-item">
                            <a
                              data-bs-toggle="tab"
                              aria-expanded="false"
                              className={`nav-link ${
                                activeTab === "month" ? "active" : ""
                              }`}
                              onClick={() => setActiveTab("month")}
                              style={{
                                cursor: "pointer",
                                backgroundColor:
                                  activeTab === "month" ? "" : "#edeff1",
                                borderRadius: "5px",
                                color: activeTab === "month" ? "" : "#6c757d",
                                fontSize: "14px",
                              }}
                            >
                              Monthly
                            </a>
                          </li>
                          <li
                            className="nav-item"
                            style={{
                              position: "relative",
                            }}
                          >
                            <a
                              data-bs-toggle="tab"
                              aria-expanded="true"
                              className={
                                "nav-link " +
                                (activeTab === "year" ? "active" : "")
                              }
                              onClick={() => setActiveTab("year")}
                              style={{
                                cursor: "pointer",
                                backgroundColor:
                                  activeTab === "year" ? "" : "#edeff1",
                                borderRadius: "5px",
                                color: activeTab === "year" ? "" : "#6c757d",

                                fontSize: "14px",
                              }}
                            >
                              Annually
                            </a>
                            <p
                              style={{
                                position: "absolute",
                                top: "90%",
                                right: "13%",
                                padding: "1px 10px",
                                borderRadius: "10px",
                                backgroundColor: "yellow",
                                fontSize: "12px",
                              }}
                            >
                              save 20%
                            </p>
                          </li>
                          <li>
                            <p>
                              <FaRightLeft
                                style={{
                                  fontSize: "20px",
                                  cursor: "pointer",
                                }}
                              />{" "}
                              Flexibility to consume credits at your own pace
                            </p>
                          </li>
                        </ul>
                        <div className="tab-content">
                          <div
                            className="tab-pane show active"
                            style={{ display: "block" }}
                          >
                            <div className="row">
                              <Grid container spacing={2}>
                                {!isLoading &&
                                  plans?.result?.length > 0 &&
                                  plans.result?.map((plan) => {
                                    if (plan?.name !== "Free") {
                                      return (
                                        <Grid
                                          item
                                          // center
                                          width={"100%"}
                                          alignItems={"center"}
                                          alignContent={"center"}
                                          justifyContent={"center"}
                                          content="center"
                                          xs={12}
                                          sm={6}
                                          md={6}
                                          lg={4}
                                          xl={4}
                                          key={plan._id}
                                          sx={{
                                            position: "relative",
                                            marginTop:
                                              plans?.result?.length > 3
                                                ? "50px"
                                                : "0",
                                          }}
                                        >
                                          {plan?.name === "Advance" ? (
                                            <div
                                              style={{
                                                position: "absolute",
                                                top: "-1.5%",
                                                left: "3.5%",
                                                right: "0",
                                                margin: "auto",
                                                backgroundColor: "#000",
                                                padding: "10px",
                                                borderRadius: "5px 5px 0 0 ",
                                                zIndex: "100",
                                                width: "96.8%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                              }}
                                            >
                                              <h4
                                                style={{
                                                  color: "white",
                                                }}
                                              >
                                                Most Popular{" "}
                                              </h4>
                                            </div>
                                          ) : (
                                            <div
                                              style={{
                                                position: "absolute",
                                                top: "2%",
                                                left: "3.5%",
                                                right: "0",
                                                margin: "auto",
                                                backgroundColor: "#000",
                                                padding: "6px",
                                                borderRadius: "5px 5px 0 0 ",
                                                zIndex: "100",
                                                width: "96.8%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                              }}
                                            ></div>
                                          )}
                                          <div className="" key={plan._id}>
                                            <div
                                              className="free-price"
                                              style={{
                                                height: "800px",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                              }}
                                            >
                                              <div style={{ height: "74%" }}>
                                                <div className="free-price-top pb-2">
                                                  <div
                                                    className="try-free"
                                                    style={{
                                                      display: "flex",
                                                      justifyContent:
                                                        "space-between",
                                                      flexDirection:
                                                        isSmallScreen
                                                          ? "column"
                                                          : "row",
                                                      gap: "10px",
                                                    }}
                                                  >
                                                    <div
                                                      className="try-free-left
                                                    "
                                                    >
                                                      <h2
                                                        style={{
                                                          fontSize:
                                                            isSmallScreen
                                                              ? "20px"
                                                              : "22px",
                                                        }}
                                                      >
                                                        {plan.name}
                                                      </h2>

                                                      {activeTab === "year" ? (
                                                        <p
                                                          style={{
                                                            minHeight: "30px",
                                                          }}
                                                        >
                                                          Billed Annually
                                                        </p>
                                                      ) : (
                                                        <p
                                                          style={{
                                                            minHeight: "30px",
                                                          }}
                                                        ></p>
                                                      )}
                                                    </div>
                                                    <div className="try-free-right">
                                                      <h2
                                                        style={{
                                                          marginTop:
                                                            isSmallScreen
                                                              ? "10px"
                                                              : "0",
                                                        }}
                                                      >
                                                        <i
                                                          className={`fa-solid ${
                                                            currencyOptions.find(
                                                              (currency) =>
                                                                currency.value ===
                                                                plan.price
                                                                  ?.currency
                                                            )?.icon
                                                          }`}
                                                        ></i>{" "}
                                                        {
                                                          plan?.price
                                                            .unit_amount
                                                        }
                                                      </h2>
                                                      <p>
                                                        {!isLoading &&
                                                          "Per Month"}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div
                                                  className="free-price-btm"
                                                  style={{ height: "100%" }}
                                                >
                                                  <div
                                                    className="also-include"
                                                    style={{ height: "100%" }}
                                                  >
                                                    <button
                                                      type="button"
                                                      className="btn btn-credit"
                                                      data-bs-toggle="tooltip"
                                                      data-bs-placement="top"
                                                      data-bs-custom-className="custom-tooltip"
                                                      data-bs-title="1 Credit = All Business and Personal Emails and Phones of 1 Profile"
                                                    >
                                                      {
                                                        plan?.product?.metadata
                                                          ?.credits
                                                      }{" "}
                                                      Credits{" "}
                                                      {!isLoading &&
                                                      activeTab === "month"
                                                        ? "/ Month"
                                                        : "/ Year"}
                                                    </button>
                                                    <div className="also-top-list plan_marketing_features">
                                                      <ul>
                                                        {plan?.product
                                                          ?.marketing_features
                                                          ?.length > 0 &&
                                                          plan?.product?.marketing_features.map(
                                                            (feature) => {
                                                              if (
                                                                feature?.name !==
                                                                  "<br>" &&
                                                                feature?.name !==
                                                                  "<br />"
                                                              )
                                                                return (
                                                                  <li
                                                                    style={{
                                                                      display:
                                                                        "flex",
                                                                      alignItems:
                                                                        "start",
                                                                    }}
                                                                  >
                                                                    <p>
                                                                      <i className="fa-solid fa-circle-check"></i>{" "}
                                                                    </p>
                                                                    <p
                                                                      style={{
                                                                        lineHeight:
                                                                          "30px",
                                                                      }}
                                                                    >
                                                                      {feature?.name?.replace(
                                                                        /(<([^>]+)>)/gi,
                                                                        ""
                                                                      )}
                                                                    </p>
                                                                  </li>
                                                                );
                                                            }
                                                          )}
                                                      </ul>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="d-grid gap-2">
                                                <button
                                                  className="btn btn-plans"
                                                  type="button"
                                                  onClick={() => {
                                                    setOpenDialog(true);
                                                    setPaymentPrice(
                                                      plan?.price?.id
                                                    );
                                                    setPlanId(plan?._id);
                                                    setShowMessage(true);
                                                    setPlanPrice(
                                                      plan?.price?.unit_amount
                                                    );
                                                    setPlanName(plan?.name);
                                                    setPlanMonthlyPrice(
                                                      plan?.monthlyPlanPrice
                                                    );
                                                    setPlanInterval(
                                                      plan?.interval
                                                    );
                                                  }}
                                                  disabled={
                                                    userData?.plan?.plan ===
                                                      plan?._id ||
                                                    auth?.result?.role ===
                                                      "admin"
                                                  }
                                                >
                                                  {userData?.plan?.plan ===
                                                  plan?._id
                                                    ? "Current Plan"
                                                    : "Choose Plan"}
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                          {isFetchingPlans && (
                                            <div
                                              style={{
                                                position: "absolute",
                                                top: "0px",
                                                height: "100%",
                                                width: "100%",
                                                background: "white",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                opacity: ".7",
                                              }}
                                            >
                                              <CircularProgress />
                                            </div>
                                          )}
                                        </Grid>
                                      );
                                    }
                                    return null;
                                  })}
                                {plans?.result &&
                                  plans?.result?.length === 0 && (
                                    <div className="col-12">
                                      <div
                                        className="alert alert-info"
                                        role="alert"
                                      >
                                        No Plans Available
                                      </div>
                                    </div>
                                  )}
                                {isLoading && (
                                  <div
                                    className="col-12"
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      backgroundColor: "#ffff",
                                    }}
                                  >
                                    <div>
                                      <CircularProgress />
                                    </div>
                                  </div>
                                )}
                              </Grid>
                              {/* <div className="col-md-4">
                                <div className="free-price">
                                  <div className="free-price-top pb-2">
                                    <div className="try-free">
                                      <div className="try-free-left">
                                        <h2>Advanced</h2>
                                      </div>
                                      <div className="try-free-right">
                                        <h2>$79</h2>
                                        <p>per month</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="free-price-btm">
                                    <div className="also-include">
                                      <button
                                        type="button"
                                        className="btn btn-credit"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        data-bs-custom-className="custom-tooltip"
                                        data-bs-title="1 Credit = All Business and Personal Emails and Phones of 1 Profile"
                                      >
                                        4,000 Credits / Month
                                      </button>
                                      <div className="also-top-list">
                                        <ul>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Credits renew every month{" "}
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Multiple users (up to 3){" "}
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Personal & Business Emails
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Personal & Company Phones
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Export Contacts to CSV/Excel
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Integrations with apps
                                          </li>
                                        </ul>
                                      </div>
                                      <div className="d-grid gap-2">
                                        <button
                                          className="btn btn-plans"
                                          type="button"
                                        >
                                          Choose Plan
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="free-price">
                                  <div className="free-price-top pb-2">
                                    <div className="try-free">
                                      <div className="try-free-left">
                                        <h2>Pro</h2>
                                      </div>
                                      <div className="try-free-right">
                                        <h2>$119</h2>
                                        <p>per month</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="free-price-btm">
                                    <div className="also-include">
                                      <button
                                        type="button"
                                        className="btn btn-credit"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        data-bs-custom-className="custom-tooltip"
                                        data-bs-title="1 Credit = All Business and Personal Emails and Phones of 1 Profile"
                                      >
                                        10,000 Credits / Month
                                      </button>
                                      <div className="also-top-list">
                                        <ul>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Credits renew every month
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Multiple users (up to 15)
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Personal & Business Emails
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Personal & Company Phones
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Export Contacts to CSV/Excel
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Integrations with apps
                                          </li>
                                        </ul>
                                      </div>

                                      <div className="d-grid gap-2">
                                        <button
                                          className="btn btn-plans"
                                          type="button"
                                        >
                                          Choose Plan
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div> */}
                            </div>
                          </div>
                          {/* <div
                            className={
                              "tab-pane" + activeTab === "six-month"
                                ? "  show active"
                                : ""
                            }
                            style={{
                              display:
                                activeTab === "six-month" ? "block" : "none",
                            }}
                          >
                            <div className="row">
                              <div className="col-md-4">
                                <div className="free-price">
                                  <div className="free-price-top">
                                    <div className="try-free">
                                      <div className="try-free-left">
                                        <h2>Starter</h2>
                                      </div>
                                      <div className="try-free-right">
                                        <h2>$31</h2>
                                        <p>per month</p>
                                      </div>
                                    </div>
                                    <div className="credit-month">
                                      <p>billed semi-annually</p>
                                    </div>
                                  </div>
                                  <div className="free-price-btm">
                                    <div className="also-include">
                                      <button
                                        type="button"
                                        className="btn btn-credit"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        data-bs-custom-className="custom-tooltip"
                                        data-bs-title="1 Credit = All Business and Personal Emails and Phones of 1 Profile"
                                      >
                                        6,000 Credits
                                      </button>
                                      <div className="also-top-list">
                                        <ul>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Credits renew every 6 months
                                          </li>
                                          <li className="text-decoration-line-through">
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Multiple users
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Personal & Business Emails
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Personal & Company Phones
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Export Contacts to CSV/Excel
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Integrations with apps
                                          </li>
                                        </ul>
                                      </div>
                                      <div className="d-grid gap-2">
                                        <button
                                          className="btn btn-plans"
                                          type="button"
                                        >
                                          Choose Plan
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="free-price">
                                  <div className="free-price-top">
                                    <div className="try-free">
                                      <div className="try-free-left">
                                        <h2>Advanced</h2>
                                      </div>
                                      <div className="try-free-right">
                                        <h2>$63</h2>
                                        <p>per month</p>
                                      </div>
                                    </div>
                                    <div className="credit-month">
                                      <p>billed semi-annually</p>
                                    </div>
                                  </div>
                                  <div className="free-price-btm">
                                    <div className="also-include">
                                      <button
                                        type="button"
                                        className="btn btn-credit"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        data-bs-custom-className="custom-tooltip"
                                        data-bs-title="1 Credit = All Business and Personal Emails and Phones of 1 Profile"
                                      >
                                        24,000 Credits
                                      </button>
                                      <div className="also-top-list">
                                        <ul>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Credits renew every 6 months{" "}
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Multiple users (up to 3){" "}
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Personal & Business Emails
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Personal & Company Phones
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Export Contacts to CSV/Excel
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Integrations with apps
                                          </li>
                                        </ul>
                                      </div>
                                      <div className="d-grid gap-2">
                                        <button
                                          className="btn btn-plans"
                                          type="button"
                                        >
                                          Choose Plan
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="free-price">
                                  <div className="free-price-top">
                                    <div className="try-free">
                                      <div className="try-free-left">
                                        <h2>Pro</h2>
                                      </div>
                                      <div className="try-free-right">
                                        <h2>$95</h2>
                                        <p>per month</p>
                                      </div>
                                    </div>
                                    <div className="credit-month">
                                      <p>billed semi-annually</p>
                                    </div>
                                  </div>
                                  <div className="free-price-btm">
                                    <div className="also-include">
                                      <button
                                        type="button"
                                        className="btn btn-credit"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        data-bs-custom-className="custom-tooltip"
                                        data-bs-title="1 Credit = All Business and Personal Emails and Phones of 1 Profile"
                                      >
                                        60,000 Credits
                                      </button>
                                      <div className="also-top-list">
                                        <ul>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Credits renew every 6 months
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Multiple users (up to 15)
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Personal & Business Emails
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Personal & Company Phones
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Export Contacts to CSV/Excel
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            Integrations with apps
                                          </li>
                                        </ul>
                                      </div>

                                      <div className="d-grid gap-2">
                                        <button
                                          className="btn btn-plans"
                                          type="button"
                                        >
                                          Choose Plan
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div> */}
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
        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setCurrentPlan(null);
            setAddingNewPaymentMethod(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {subscriptionData?.result?.data?.length <= 0 ||
          addingNewPaymentMethod ? (
            <>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <PaymentForm
                    setPaymentMethod={setOpenDialog}
                    paymentPrice={paymentPrice}
                    openDialog={openDialog}
                    showMessage={showMessage}
                    setShowMessage={setShowMessage}
                    planName={planName}
                    planPrice={planPrice}
                    planMonthlyPrice={planMonthlyPrice}
                    planInterval={planInterval}
                    addingNewPaymentMethod={addingNewPaymentMethod}
                    setAddingNewPaymentMethod={setAddingNewPaymentMethod}
                  />
                </DialogContentText>
              </DialogContent>
            </>
          ) : (
            <>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {showMessage && (
                    <Box>
                      {/* checks for 5limit folders, 5 sequence and 5 statuses */}
                      {!planInfoLoading &&
                        !isFetchingPlanInfo &&
                        (planName === "Basic" || planName === "Free") && (
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
                              marginBottom: "30px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "18px",
                                fontWeight: 600,
                                color: "#424770",
                                marginBottom: "20px",
                              }}
                            >
                              By changing your plan to {planName}, you will need
                              to meet the limit of 5 folders, 5 active sequences
                              and 5 active statuses:
                            </span>
                            <span
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "flex-start",
                                textAlign: "left",
                              }}
                            >
                              {planInfo?.result?.userFolders > 5 ? (
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
                                        marginTop: "3px",
                                      }}
                                    />
                                  </span>
                                </Tooltip>
                              ) : (
                                <FaCheckCircle
                                  color="green"
                                  style={{
                                    marginTop: "3px",
                                  }}
                                />
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
                                5 Folders are allowed in {planName} Plan. You
                                have {planInfo?.result?.userFolders} folders.
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
                              {planInfo?.result?.userSequences > 5 ? (
                                <Tooltip
                                  title="Remove the sequences by clicking on lead manager and then sequences."
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
                                        color: "#f34336",
                                      },
                                    },
                                  }}
                                >
                                  <span>
                                    <FaTimesCircle
                                      color="red"
                                      style={{
                                        cursor: "pointer",
                                        marginTop: "3px",
                                      }}
                                    />
                                  </span>
                                </Tooltip>
                              ) : (
                                <FaCheckCircle
                                  color="green"
                                  style={{
                                    marginTop: "3px",
                                  }}
                                />
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
                                5 Active Sequences are allowed in {planName}{" "}
                                Plan. You have {planInfo?.result?.userSequences}{" "}
                                sequences
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
                              {planInfo?.result?.userStatuses > 5 ? (
                                <Tooltip
                                  title="Go to Lead Manager and either delete or deactive the statuses at lead statuse."
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
                                    <FaTimesCircle
                                      color="red"
                                      style={{
                                        cursor: "pointer",
                                        marginTop: "3px",
                                      }}
                                    />
                                  </span>
                                </Tooltip>
                              ) : (
                                <FaCheckCircle
                                  color="green"
                                  style={{
                                    marginTop: "3px",
                                  }}
                                />
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
                                5 Active Statuses are allowed in {planName}{" "}
                                Plan. You have {planInfo?.result?.userStatuses}{" "}
                                statuses
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
                              {planInfo?.result?.templateWithMaxFollowups >
                              5 ? (
                                <Tooltip
                                  title="go to sequence Templates in lead manager and either delete or disabled the templates."
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
                                        color: "#f34336",
                                      },
                                    },
                                  }}
                                >
                                  <span>
                                    <FaTimesCircle
                                      color="red"
                                      style={{
                                        cursor: "pointer",
                                        marginTop: "3px",
                                      }}
                                    />
                                  </span>
                                </Tooltip>
                              ) : (
                                <FaCheckCircle
                                  color="green"
                                  size={22}
                                  style={{
                                    marginTop: "3px",
                                  }}
                                />
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
                                5 Follow-ups are allowed in {planName} Plan. You
                                have{" "}
                                {planInfo?.result?.templateWithMaxFollowups}{" "}
                                templates with more than 5 Follow-ups.
                              </span>
                            </span>
                          </Typography>
                        )}
                      {(planName === "Basic" || planName === "Free") &&
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

                      <Typography
                        variant="body1"
                        gutterBottom
                        sx={{
                          textAlign: "center",
                          color: "#424770",
                          fontSize: "16px",
                          fontWeight: 400,
                          backgroundColor: "#f5f5f5",
                          padding: 2,
                          borderRadius: 1,
                          color: "#424770",
                        }}
                      >
                        {planInterval === "year" ? (
                          <span>
                            {`You have chosen ${planName} Annual Plan to save 20%. Instead of $${planMonthlyPrice}/Month, you agree to pay $${planPrice}/Month (Billed Annually)  which is $${planPrice}X12 = $${
                              planPrice * 12
                            } Up Front it will be charged 	instantly, and it will be renewed every year until cancelled.`}
                          </span>
                        ) : (
                          <span>
                            {`You have chosen ${planName} Monthly Plan For $${planPrice} it will be charged instantly, and will be renewed every month until cancelled`}
                          </span>
                        )}
                      </Typography>
                    </Box>
                  )}
                </DialogContentText>
              </DialogContent>
              <div>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    paddingX: "24px",
                  }}
                >
                  <Button
                    onClick={handleCustomerBillingPortal}
                    variant="contained"
                    style={{ backgroundColor: "#ff000d" }}
                  >
                    Update Card Details
                  </Button>
                </Box>
              </div>
              {(planName === "Basic" || planName === "Free") &&
              planInfo?.result?.userStatuses <= 5 &&
              planInfo?.result?.userSequences <= 5 &&
              planInfo?.result?.userFolders <= 5 &&
              planInfo?.result?.templateWithMaxFollowups === 0 ? (
                <DialogTitle id="alert-dialog-title">
                  {"Do you want to subscribe to this plan?"}
                </DialogTitle>
              ) : (
                (planName === "Advance" || planName === "Enterprise") && (
                  <DialogTitle id="alert-dialog-title">
                    {"Do you want to subscribe to this plan?"}
                  </DialogTitle>
                )
              )}
              {(planName === "Basic" || planName === "Free") &&
              planInfo?.result?.userStatuses <= 5 &&
              planInfo?.result?.userSequences <= 5 &&
              planInfo?.result?.userFolders <= 5 ? (
                <DialogActions>
                  <Button
                    onClick={() => {
                      setOpenDialog(false);
                      setCurrentPlan(null);
                    }}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      postChooseSubscriptionLoading ||
                      ((userData?.plan?.planName === "Advance" ||
                        userData?.plan?.planName === "Enterprise") &&
                        (planInfo?.result?.userStatuses > 5 ||
                          planInfo?.result?.userSequences > 5 ||
                          planInfo?.result?.userFolders > 5))
                    }
                    onClick={handleChoosePlan}
                    color="primary"
                    autoFocus
                  >
                    {postChooseSubscriptionLoading ? (
                      <CircularProgress color="secondary" size={20} />
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </DialogActions>
              ) : (
                (planName === "Advance" || planName === "Enterprise") && (
                  <DialogActions>
                    <Button
                      onClick={() => {
                        setOpenDialog(false);
                        setCurrentPlan(null);
                      }}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={
                        postChooseSubscriptionLoading ||
                        ((planName === "Basic" || planName === "Free") &&
                          (planInfo?.result?.userStatuses > 5 ||
                            planInfo?.result?.userSequences > 5 ||
                            planInfo?.result?.userFolders > 5))
                      }
                      onClick={handleChoosePlan}
                      color="primary"
                      autoFocus
                    >
                      {postChooseSubscriptionLoading ? (
                        <CircularProgress color="secondary" size={20} />
                      ) : (
                        "Subscribe"
                      )}
                    </Button>
                  </DialogActions>
                )
              )}
            </>
          )}
        </Dialog>

        {/* <!-- container --> */}
      </div>
      {/* <!-- content --> */}

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

export default Plan;

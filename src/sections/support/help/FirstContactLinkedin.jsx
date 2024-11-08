import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { CircularProgress, useMediaQuery } from "@mui/material";
import {
  useGetCategoryAnswerQuery,
  useGetHelpQuery,
  useLazyGetCategoryQuestionsQuery,
} from "../../../slices/adminSlice";
import Footer from "../../../components/Footer";
import { daysAgo } from "../../../utils/timeAgo";

const FirstContactLinkedin = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const { auth } = useSelector((state) => state.auth);
  const { id } = useParams();
  const { data, isLoading, isSuccess } = useGetHelpQuery(id);
  const { data: questionsData, isSuccess: categoryQuestionSuccess } =
    useGetCategoryAnswerQuery({ id });

  useEffect(() => {
    if (categoryQuestionSuccess) {
      console.log("useGetCategoryAnswerQuery :", questionsData);
    }
  }, [id]);

  return (
    <div className="wrapper">
      <section id="topNav">
        <nav
          className="navbar navbar-expand-lg fixed-top"
          style={{
            backgroundColor: "#fff6f7",
            padding: "14px 0px",

            boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            className="container-fluid"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "70%",
            }}
          >
            <a className="" href="index.html">
              <img
                src="https://d2ds8yldqp7gxv.cloudfront.net/lead/jarvis-logo.png"
                alt="logo"
                width="200"
                height="33"
              />
            </a>
            {/* <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button> */}
            <div className="navbar-nav" id="navbarSupportedContent">
              {/* <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="pricing.html"
                    style={{ fontWeight: 600 }}
                  >
                    Pricing
                  </a>
                </li>
              </ul> */}
              <div
                role="search"
                style={{
                  display: isSmallScreen ? "none" : "flex",
                }}
              >
                {auth && auth?.result ? (
                  <button
                    className="btn get-free me-3"
                    type="button"
                    onClick={() => navigate("/")}
                    style={{
                      fontSize: isSmallScreen ? "10px" : "14px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Back To HomePage
                  </button>
                ) : (
                  <button
                    className="btn login"
                    type="button"
                    onClick={() => navigate("/login")}
                  >
                    <FaArrowRightToBracket
                      style={{ marginRight: "10px", fontSize: "16px" }}
                    />
                    Login
                  </button>
                )}
                <button
                  className="btn get-free"
                  type="submit"
                  style={{
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 600,
                  }}
                  onClick={() => navigate("/register")}
                >
                  <FaCheckCircle
                    style={{ marginRight: "5px", fontSize: "16px" }}
                  />
                  Get it free
                </button>
              </div>
            </div>
          </div>
        </nav>
      </section>

      <section id="helpCenter">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="row mb-5">
                <div className="col-lg-8 mx-auto">
                  {/* <div id="searchingHelp">
                    <div className="input-group">
                      <input
                        type="search"
                        placeholder="Search for articles..."
                        aria-describedby="button-addon1"
                        className="form-control border-0 bg-search"
                      />
                      <div className="input-group-append">
                        <button
                          id="button-addon1"
                          type="submit"
                          className="btn"
                        >
                          <i className="fa fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="getCollection">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div id="getBreadcrumb">
                <nav
                  style={{ backgroundColor: "transparent" }}
                  aria-label="breadcrumb"
                >
                  <ol className="breadcrumb">
                    <li
                      className="breadcrumb-item"
                      onClick={() => navigate("/help")}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      All Collections
                    </li>
                    {categoryQuestionSuccess && questionsData?.result && (
                      <>
                        <li
                          onClick={() => navigate(-1)}
                          className="breadcrumb-item active"
                          aria-current="page"
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          {questionsData?.result?.category.categoryName}
                        </li>
                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          {questionsData?.result?.question}
                        </li>
                      </>
                    )}
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="firstgetlinked">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              {!categoryQuestionSuccess ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                    backgroundColor: "transparent",
                    // height: "100vh",
                  }}
                >
                  <CircularProgress
                    style={{ color: "red", fontSize: "100px" }}
                  />
                </div>
              ) : (
                <div className="row">
                  <div className="col-lg-8">
                    {categoryQuestionSuccess && questionsData?.result && (
                      <>
                        <div className="get-start-self">
                          <h2>{questionsData?.result?.question}</h2>
                          <p>
                            Updated {daysAgo(questionsData?.result?.createdAt)}
                          </p>
                        </div>
                        <div
                          className="discover-box"
                          dangerouslySetInnerHTML={{
                            __html: questionsData?.result?.answer,
                          }}
                        ></div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
      {/* <section id="leadFooter">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="foot-logo">
                <img
                  src="https://d2ds8yldqp7gxv.cloudfront.net/lead/jarvis-logo.png"
                  alt="logo"
                  width="200"
                  height="33"
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="lead-foot-list">
                <h4>Support</h4>
                <ul>
                  <li>
                    <a href="integrations.html">Install Extension</a>
                  </li>
                  <li>
                    <a href="help.html">Help Center</a>
                  </li>
                  <li>
                    <a href="#">Tutorials</a>
                  </li>
                  <li>
                    <a href="#">Blog</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-3">
              <div className="lead-foot-list">
                <h4>Product</h4>
                <ul>
                  <li>
                    <a href="email-finder.html">Email Finder</a>
                  </li>
                  <li>
                    <a href="pricing.html">Pricing</a>
                  </li>
                  <li>
                    <a href="#">Changelog</a>
                  </li>
                  <li>
                    <a href="affiliates.html">Affiliate Program</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-3">
              <div className="lead-foot-list">
                <h4>Legal</h4>
                <ul>
                  <li>
                    <a href="terms-condition.html">Terms of Service</a>
                  </li>
                  <li>
                    <a href="privacy-policy.html"> Privacy Policy</a>
                  </li>
                  <li>
                    <a href="gdpr-compliance.html">GDPR Compliance</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row pt-4 line-top">
            <div className="col-md-6">
              <div className="leda-copy">
                <p>© 2024 Jarvis Reach Americas Inc. - All Rights Reserved.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="social-link">
                <ul>
                  <li>
                    <a href="">
                      <i className="fa-brands fa-linkedin-in"></i>
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <i className="fa-brands fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <i className="fa-brands fa-youtube"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default FirstContactLinkedin;

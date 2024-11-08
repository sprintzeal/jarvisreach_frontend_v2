import React, { useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import {
  FaArrowRightToBracket,
  FaFacebookF,
  FaFileCircleCheck,
  FaFolderOpen,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  useGetCreateCategoryQuery,
  useGetHelpQuery,
  useLazyGetCategoryQuestionsQuery,
} from "../../slices/adminSlice";
import { CircularProgress, useMediaQuery } from "@mui/material";
import Footer from "../../components/Footer";

const Help = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const { auth } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const {
    data: category,
    isLoading,
    isSuccess: categorySuccess,
  } = useGetCreateCategoryQuery({
    page: 1,
    limit: 10,
    pagination: false,
    search: search,
    status: "Active",
  });
  const [
    triggerGetCategoryQuestionsQuery,
    { data: questionsData, isSuccess: categoryQuestionSuccess },
  ] = useLazyGetCategoryQuestionsQuery();
  // const {data, categorySuccess}=useGetCreateCategoryQuery();
  // console.log("Data in Helpssssssssssss :", questionsData);

  useEffect(() => {
    if (categorySuccess) {
      console.log("Data in Help :", category);
    }
  }, [categorySuccess]);
  useEffect(() => {
    if (categoryQuestionSuccess) {
      console.log("questionsData :", questionsData);
    }
  }, [categoryQuestionSuccess]);

  const getCategoryData = (id) => {
    // console.log("Idssss :", id)
    navigate(`/getting-start/${id}`);
  };

  const debounce = useRef();
  const handleSearchDebounced = (value) => {
    console.log("Valueeee :", value);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setSearch(value);
      console.log("Search => ", search);
    }, 300);
  };
  const handleSearchInput = (e) => {
    const inputVal = e.target.value;
    console.log(inputVal);
    setQuery(inputVal);
    handleSearchDebounced(inputVal);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
              <div className="search-head">
                <h1>Advice and answers from the Jarvis Reach</h1>
              </div>

              <div className="row mb-5">
                <div className="col-lg-8 mx-auto">
                  <div id="searchingHelp">
                    <div className="input-group">
                      <input
                        type="search"
                        placeholder="Search for articles..."
                        aria-describedby="button-addon1"
                        className="form-control border-0 bg-search"
                        value={query}
                        onChange={(e) => {
                          handleSearchInput(e);
                        }}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="getStart">
        <div className="container">
          <div className="row">
            {!categorySuccess ? (
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
                <CircularProgress style={{ color: "red", fontSize: "100px" }} />
              </div>
            ) : (
              <div className="col-lg-12">
                {categorySuccess &&
                  category &&
                  category?.result?.map((categoryName, index) => {
                    if (categoryName?.status === "Active")
                      return (
                        <a
                          target="_blank"
                          className="get-start-box"
                          onClick={() => getCategoryData(categoryName._id)}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <div className="get-start-box-left">
                            <p>
                              {index === 0 ? (
                                <FaFileCircleCheck
                                  style={{ color: "#ff000d", fontSize: "40px" }}
                                />
                              ) : (
                                <i class="fa-solid fa-folder-open"></i>
                              )}
                            </p>
                          </div>
                          <div className="get-start-box-right">
                            <h5>{categoryName.categoryName}</h5>
                            <p>
                              {categoryName.helpSupportCount === 0
                                ? "No articles available."
                                : categoryName.helpSupportCount === 1
                                ? "1 article"
                                : `${categoryName.helpSupportCount} articles`}
                            </p>
                          </div>
                        </a>
                      );
                  })}
                {category?.result?.length === 0 && (
                  <a>
                    <div
                      className="get-start-box-left"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <p>No Categories Found.</p>
                    </div>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Help;

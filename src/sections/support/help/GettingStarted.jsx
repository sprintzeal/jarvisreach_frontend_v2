import React, { useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowRightToBracket, FaChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
  useGetCreateCategoryQuery,
  useLazyGetCategoryQuestionsQuery,
} from "../../../slices/adminSlice";
import { CircularProgress, useMediaQuery } from "@mui/material";

const GettingStarted = () => {
  const [search, setSearch] = useState("");
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state.auth);
  const [
    triggerGetCategoryQuestionsQuery,
    { data: questionsData, isSuccess: categoryQuestionSuccess },
  ] = useLazyGetCategoryQuestionsQuery({ search: search });
  const { id } = useParams();
  console.log("Idssss :", id);
  const {
    data: category,
    isLoading,
    isSuccess: categorySuccess,
  } = useGetCreateCategoryQuery({
    page: 1,
    limit: 10,
    pagination: false,
    status: "Active",
  });
  useEffect(() => {
    // console.log("If Id then console :", id)
    try {
      triggerGetCategoryQuestionsQuery({ id, search });
      // navigate(`/getting-start/${id}`)
    } catch (error) {
      console.log("Error :", error.data.message);
    }

    // save categoryName in state if match with id
  }, [id, search]);

  const debounce = useRef();
  const handleSearchDebounced = (value) => {
    console.log("Valueeee :", value);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setSearch(value);
      console.log("Search => ", search);
    }, 300);
  };
  const handleInputChange = (e) => {
    const inputVal = e.target.value;
    console.log(inputVal);
    setQuery(inputVal);
    handleSearchDebounced(inputVal);
  };

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
                  <div id="searchingHelp">
                    <div className="input-group">
                      <input
                        type="search"
                        placeholder="Search for articles..."
                        aria-describedby="button-addon1"
                        className="form-control border-0 bg-search"
                        value={query}
                        onChange={handleInputChange}
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
                    <li className="breadcrumb-item">
                      <a
                        style={{
                          textDecoration: "none",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate("/help")}
                      >
                        All Collections
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {category?.result.length > 0 &&
                        category?.result?.find((cat) => cat._id === id)
                          ?.categoryName}
                    </li>
                  </ol>
                </nav>
              </div>

              <div
                className="get-articale
                "
                style={{
                  whiteSpace: "no-wrap",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <p>
                  <i className="fa-solid fa-file-circle-check"></i>
                </p>
                <h2>
                  {" "}
                  {category?.result.length > 0 &&
                    category?.result?.find((cat) => cat._id === id)
                      ?.categoryName}
                </h2>
              </div>
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
                <div className="get-list-group">
                  <div className="get-links">
                    {categoryQuestionSuccess &&
                      questionsData?.result.map((question, index) => (
                        <a
                          onClick={() =>
                            navigate(`/first-contact-linkedin/${question?._id}`)
                          }
                          style={{
                            cursor: "pointer",
                          }}
                          key={index}
                        >
                          {question.question}
                          <span>
                            <FaChevronRight
                              style={{ fontSize: "10px", color: "#000" }}
                            />
                          </span>
                        </a>
                      ))}
                    {questionsData?.result.length === 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "10px",
                          backgroundColor: "transparent",
                        }}
                      >
                        <h1>No Question Found</h1>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GettingStarted;

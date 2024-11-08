import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import {
  FaArrowLeft,
  FaArrowRightToBracket,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useGetBlogListQuery } from "../slices/adminSlice";
import { CircularProgress } from "@mui/material";
import { useGetBlogCategorizedQuery } from "../slices/customerSlice";

const Blog = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state.auth);
  const {
    data: getBlog,
    isLoading: blogLoading,
    isError: blogError,
  } = useGetBlogListQuery({ page: 1, limit: 20 });
  const {
    data: getBlogCategorized,
    isLoading: blogCategorizedLoading,
    isError: blogCategorizedError,
  } = useGetBlogCategorizedQuery({ page: 1, limit: 20 });

  const slugHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    let text = div.textContent || div.innerText || "";

    return text;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (blogLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

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
              justifyContent: "center",
              alignItems: "center",
              width: "70%",
            }}
          >
            <a
              className=""
              style={{
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
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
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                {/* <li className="nav-item">
                  <a
                    className="nav-link"
                    href="pricing.html"
                    style={{ fontWeight: 600 }}
                  >
                    Pricing
                  </a>
                </li> */}
              </ul>
              <div className="d-flex" role="search">
                {auth && auth?.result ? (
                  <button
                    className="btn get-free me-3"
                    type="button"
                    onClick={() => navigate("/")}
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
      <section id="blogUser">
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <FaArrowLeft
              style={{
                fontSize: "20px",
                cursor: "pointer",
              }}
            />
            <span
              style={{
                fontSize: "20px",
                fontWeight: 600,
              }}
            >
              Back to Home
            </span>
          </div>
          {getBlogCategorized?.result?.length > 0 ? (
            <div className="row">
              <div className="col-md-8">
                {/* {getBlog?.result?.find(
                (blog) => blog?.category.categoryName === "main"
              ) && ( */}
                <div
                  className="top-blog mb-2"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate(
                      `/blog-details/${getBlogCategorized?.result[0]?.blogs[0]?.blogInfo.slugUrl}`
                    )
                  }
                >
                  <a
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={
                        getBlogCategorized?.result[0]?.blogs[0]?.blogBannerImage
                      }
                      // className="img-fluid"
                      style={{
                        height: "80%",
                        objectFit: "fill",
                        width: "100%",
                      }}
                    />
                  </a>
                  <div className="blog-top-cnt">
                    <h5>
                      {getBlogCategorized?.result[0]?.blogs[0]?.blogInfo?.title}
                    </h5>
                    <h2>
                      <a>
                        {
                          getBlogCategorized?.result[0]?.blogs[0]?.blogInfo
                            ?.h1Tag
                        }
                      </a>
                    </h2>
                    <p>
                      {new Date(
                        getBlogCategorized?.result[0]?.blogs[0]?.createdAt
                      ).toDateString()}
                    </p>
                  </div>
                </div>
                {/* )} */}

                <div className="row mb-4">
                  {getBlogCategorized?.result[0]?.blogs?.length > 1 &&
                    getBlogCategorized?.result[0]?.blogs
                      ?.slice(1)
                      ?.map((blog, index) => {
                        const div = document.createElement("div");
                        div.innerHTML = blog?.blogInfo?.description;
                        const text = div.textContent || div.innerText || "";

                        return (
                          <div className="col-md-6">
                            <div
                              className="top-blog-left"
                              style={{ paddingRight: "10px" }}
                              onClick={() =>
                                navigate(
                                  `/blog-details/${blog?.blogInfo.slugUrl}`
                                )
                              }
                            >
                              <a href="">
                                <img
                                  src={blog?.blogBannerImage}
                                  width="100%"
                                  height="220px"
                                />
                              </a>
                              <div className="blog-top-test">
                                <h4>{blog?.blogInfo?.title}</h4>
                                <a href="">{blog?.blogInfo?.h1Tag}</a>
                                <br />
                                <span>
                                  {" "}
                                  {new Date(blog?.createdAt).toDateString()}
                                </span>
                                <p>
                                  {text.length > 100
                                    ? text.substring(0, 120) + "..."
                                    : text}

                                  {/* There are lots of reasons why you might want to
                                find someone’s email address. Whether you’re
                                looking to reach out… */}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                </div>

                {/* <div className="row">
                <div className="col-md-6">
                  {getBlog?.result?.length > 3 &&
                    getBlog?.result?.slice(4, 6).map((blog, index) => (
                      <div className="top-blog-left">
                        <a href="">
                          <img
                            src="../../src/assets/images/lead-generation.png"
                            className="img-fluid"
                            width="100%"
                          />
                        </a>
                        <div className="blog-top-test">
                          <h4>{blog?.blogInfo?.title}</h4>
                          <a href="">
                            {blog?.blogInfo?.h1Tag}
                          </a>
                          <span>
                            {new Date(blog?.createdAt).toDateString()} 5 Mins
                            Read
                          </span>
                          <p>
                            {/*                         {blog?.blogInfo?.description}
                             */}
                {/* There are lots of reasons why you might want to find
                            someone’s email address. Whether you’re looking to
                            reach out…
                          </p> */}
                {/* </div>
                      </div> */}
                {/* ))}
                </div>
              </div> */}

                {getBlogCategorized?.result[1]?.blogs?.length > 0 && (
                  <div className="top-blog">
                    <a
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        navigate(
                          `/blog-details/${getBlogCategorized?.result[1]?.blogs[0]?.blogInfo.slugUrl}`
                        )
                      }
                    >
                      <img
                        src={
                          getBlogCategorized?.result[1]?.blogs[0]
                            ?.blogBannerImage
                        }
                        className="img-fluid"
                        width="100%"
                      />
                    </a>
                    <div className="blog-top-cnt">
                      <h5>
                        {
                          getBlogCategorized?.result[1]?.blogs[0]?.blogInfo
                            ?.title
                        }
                      </h5>
                      <h2>
                        <a href="">
                          {
                            getBlogCategorized?.result[1]?.blogs[0]?.blogInfo
                              ?.h1Tag
                          }
                        </a>
                      </h2>
                      <p>
                        {new Date(
                          getBlogCategorized?.result[1]?.blogs[0]?.createdAt
                        ).toDateString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="row">
                  {getBlogCategorized?.result[1]?.blogs?.length > 0 &&
                    getBlogCategorized?.result[1]?.blogs
                      ?.slice(1)
                      ?.map((blog, index) => {
                        const div = document.createElement("div");
                        div.innerHTML = blog?.blogInfo?.description;
                        const text = div.textContent || div.innerText || "";

                        return (
                          <div className="col-md-6">
                            <div
                              className="top-blog-left"
                              onClick={() =>
                                navigate(
                                  `/blog-details/${blog?.blogInfo.slugUrl}`
                                )
                              }
                            >
                              <a href="">
                                <img
                                  src={blog?.blogBannerImage}
                                  className="img-fluid"
                                  width="100%"
                                />
                              </a>
                              <div className="blog-top-test">
                                <h4>{blog?.blogInfo?.title}</h4>
                                <a href="">{blog?.blogInfo?.h1Tag}</a>
                                <br />
                                <span>
                                  {" "}
                                  {new Date(blog?.createdAt).toDateString()}
                                </span>
                                <p>
                                  {text.length > 100
                                    ? text.substring(0, 120) + "..."
                                    : text}

                                  {/* There are lots of reasons why you might want to
                                find someone’s email address. Whether you’re
                                looking to reach out… */}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>
              <div className="col-md-4">
                {getBlogCategorized?.result[2]?.blogs?.length > 0 && (
                  <div className="blog-update-left">
                    <div
                      className="top-blog-left"
                      onClick={() =>
                        navigate(
                          `/blog-details/${getBlogCategorized?.result[2]?.blogs[0]?.blogInfo.slugUrl}`
                        )
                      }
                    >
                      <h3
                        style={{
                          marginBottom: "20px",
                        }}
                      >
                        {getBlogCategorized?.result[2] &&
                          getBlogCategorized?.result[2]?.blogs[0]
                            ?.categoryDetails?.categoryName}
                      </h3>

                      <a href="">
                        <img
                          src={
                            getBlogCategorized?.result[2]?.blogs[0]
                              ?.blogBannerImage
                          }
                          className="img-fluid"
                          width="100%"
                        />
                      </a>
                      <div className="blog-top-test">
                        <h4>
                          {
                            getBlogCategorized?.result[2]?.blogs[0]?.blogInfo
                              ?.title
                          }
                        </h4>
                        <a href="">
                          {
                            getBlogCategorized?.result[2]?.blogs[0]?.blogInfo
                              ?.h1Tag
                          }
                        </a>
                        <br />
                        <span>
                          {new Date(
                            getBlogCategorized?.result[2]?.blogs[0]?.createdAt
                          ).toDateString()}{" "}
                        </span>
                        <p>
                          {slugHtml(
                            getBlogCategorized?.result[2]?.blogs[0]?.blogInfo
                              ?.description
                          )?.length > 100
                            ? slugHtml(
                                getBlogCategorized?.result[2]?.blogs[0]
                                  ?.blogInfo?.description
                              )?.substring(0, 120) + "..."
                            : slugHtml(
                                getBlogCategorized?.result[2]?.blogs[0]
                                  ?.blogInfo?.description
                              )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {getBlogCategorized?.result[2]?.blogs?.length > 1 &&
                  getBlogCategorized?.result[2]?.blogs
                    ?.slice(1)
                    ?.map((blog, index) => {
                      const div = document.createElement("div");
                      div.innerHTML = blog?.blogInfo?.description;
                      const text = div.textContent || div.innerText || "";

                      return (
                        <a
                          style={{ cursor: "pointer" }}
                          className="bloging-post"
                          onClick={() =>
                            navigate(`/blog-details/${blog?.blogInfo.slugUrl}`)
                          }
                        >
                          <div className="bloging-post-left">
                            <img
                              src={blog?.blogBannerImage}
                              className="img-fluid"
                            />
                          </div>
                          <div className="bloging-post-right">
                            <p>{blog?.blogInfo?.title}</p>
                          </div>
                        </a>
                      );
                    })}
                <div className="blog-update-left">
                  <div
                    className="top-blog-left"
                    onClick={() =>
                      navigate(
                        `/blog-details/${getBlogCategorized?.result[3]?.blogs[0]?.blogInfo.slugUrl}`
                      )
                    }
                  >
                    <h3
                      style={{
                        marginBottom: "20px",
                      }}
                    >
                      {getBlogCategorized?.result[3] &&
                        getBlogCategorized?.result[3]?.blogs[0]?.categoryDetails
                          ?.categoryName}
                    </h3>

                    <a href="">
                      <img
                        src={
                          getBlogCategorized?.result[3] &&
                          getBlogCategorized?.result[3]?.blogs[0]
                            ?.blogBannerImage
                        }
                        className="img-fluid"
                        width="100%"
                      />
                    </a>
                    <div className="blog-top-test">
                      <h4>
                        {getBlogCategorized?.result[3] &&
                          getBlogCategorized?.result[3]?.blogs[0]?.blogInfo
                            ?.title}
                      </h4>
                      <a href="">
                        {getBlogCategorized?.result[3] &&
                          getBlogCategorized?.result[3]?.blogs[0]?.blogInfo
                            ?.h1Tag}
                      </a>
                      <br />

                      <span>
                        {getBlogCategorized?.result[3] &&
                          new Date(
                            getBlogCategorized?.result[3]?.blogs[0]?.createdAt
                          ).toDateString()}{" "}
                      </span>
                      <p>
                        {getBlogCategorized?.result[3] &&
                          (slugHtml(
                            getBlogCategorized?.result[3]?.blogs[0]?.blogInfo
                              ?.description
                          )?.length > 100
                            ? slugHtml(
                                getBlogCategorized?.result[3]?.blogs[0]
                                  ?.blogInfo?.description
                              )?.substring(0, 120) + "..."
                            : slugHtml(
                                getBlogCategorized?.result[3]?.blogs[0]
                                  ?.blogInfo?.description
                              ))}
                      </p>
                    </div>
                  </div>
                </div>

                {getBlogCategorized?.result[3]?.blogs?.length > 1 &&
                  getBlogCategorized?.result[3]?.blogs
                    ?.slice(0)
                    ?.map((blog, index) => {
                      const div = document.createElement("div");
                      div.innerHTML = blog?.blogInfo?.description;
                      const text = div.textContent || div.innerText || "";

                      return (
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(
                              `/blog-details/${getBlog?.result[0]?.blogInfo.slugUrl}`
                            )
                          }
                          className="bloging-post"
                        >
                          <div className="bloging-post-left">
                            <img
                              src={getBlog?.result[0]?.blogBannerImage}
                              className="img-fluid"
                            />
                          </div>
                          <div className="bloging-post-right">
                            <p>{blog?.blogInfo?.title}</p>
                          </div>
                        </a>
                      );
                    })}
                <div className="blog-update-left">
                  <div
                    className="top-blog-left"
                    onClick={() =>
                      navigate(
                        `/blog-details/${getBlogCategorized?.result[5]?.blogs[0]?.blogInfo.slugUrl}`
                      )
                    }
                  >
                    <h3
                      style={{
                        marginBottom: "20px",
                      }}
                    >
                      {getBlogCategorized?.result[5] &&
                        getBlogCategorized?.result[5]?.blogs[0]?.categoryDetails
                          ?.categoryName}
                    </h3>

                    <a href="">
                      <img
                        src={
                          getBlogCategorized?.result[5] &&
                          getBlogCategorized?.result[5]?.blogs[0]
                            ?.blogBannerImage
                        }
                        className="img-fluid"
                        width="100%"
                      />
                    </a>
                    <div className="blog-top-test">
                      <h5>
                        {getBlogCategorized?.result[5] &&
                          getBlogCategorized?.result[5]?.blogs[0]?.blogInfo
                            ?.title}
                      </h5>
                      <a href="">
                        {getBlogCategorized?.result[5] &&
                          getBlogCategorized?.result[5]?.blogs[0]?.blogInfo
                            ?.h1Tag}
                      </a>
                      <br />

                      <span>
                        {getBlogCategorized?.result[5] &&
                          new Date(
                            getBlogCategorized?.result[5]?.blogs[0]?.createdAt
                          ).toDateString()}{" "}
                      </span>
                      <p>
                        {getBlogCategorized?.result[5] &&
                          (slugHtml(
                            getBlogCategorized?.result[5]?.blogs[0]?.blogInfo
                              ?.description
                          )?.length > 100
                            ? slugHtml(
                                getBlogCategorized?.result[5]?.blogs[0]
                                  ?.blogInfo?.description
                              )?.substring(0, 120) + "..."
                            : slugHtml(
                                getBlogCategorized?.result[5]?.blogs[0]
                                  ?.blogInfo?.description
                              ))}
                      </p>
                    </div>
                  </div>
                </div>

                {getBlogCategorized?.result[5]?.blogs?.length > 1 &&
                  getBlogCategorized?.result[5]?.blogs
                    ?.slice(0)
                    ?.map((blog, index) => {
                      const div = document.createElement("div");
                      div.innerHTML = blog?.blogInfo?.description;
                      const text = div.textContent || div.innerText || "";

                      return (
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(
                              `/blog-details/${getBlog?.result[0]?.blogInfo.slugUrl}`
                            )
                          }
                          className="bloging-post"
                        >
                          <div className="bloging-post-left">
                            <img
                              src={getBlog?.result[0]?.blogBannerImage}
                              className="img-fluid"
                            />
                          </div>
                          <div className="bloging-post-right">
                            <p>{blog?.blogInfo?.title}</p>
                          </div>
                        </a>
                      );
                    })}
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-8">
                <div
                  className="top-blog mb-2"
                  style={{
                    height: "30%",
                    objectFit: "cover",
                    width: "100%",
                  }}
                >
                  No Blog Found
                </div>
              </div>
            </div>
          )}

          {/* <nav aria-label="Page navigation example mt-4">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#">
                  Previous
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  Next
                </a>
              </li>
            </ul>
          </nav> */}
        </div>
      </section>

      <section id="joinToday">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="join-free">
                <h2>Join Today. It’s free</h2>
                <p>
                  Start now and discover dependable contact information on
                  LinkedIn for free, featuring categorized and verified email
                  addresses and phone numbers.
                </p>
                <a style={{ cursor: "pointer" }}>Get started, It's Free</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="leadFooter">
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
                    <a style={{ cursor: "pointer" }}>Install Extension</a>
                  </li>
                  <li>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/help")}
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a style={{ cursor: "pointer" }}>Tutorials</a>
                  </li>
                  <li>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/blog-user")}
                    >
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-3">
              <div className="lead-foot-list">
                <h4>Product</h4>
                <ul>
                  <li>
                    <a>Email Finder</a>
                  </li>
                  <li>
                    <a>Pricing</a>
                  </li>
                  <li>
                    <a>Changelog</a>
                  </li>
                  <li>
                    <a>Affiliate Program</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-3">
              <div className="lead-foot-list">
                <h4>Legal</h4>
                <ul>
                  <li>
                    <a>Terms of Service</a>
                  </li>
                  <li>
                    <a> Privacy Policy</a>
                  </li>
                  <li>
                    <a>GDPR Compliance</a>
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
                    <a>
                      <FaLinkedin />
                    </a>
                  </li>
                  <li>
                    <a>
                      <FaFacebook />
                    </a>
                  </li>
                  <li>
                    <a>
                      <FaTwitter />
                    </a>
                  </li>
                  <li>
                    <a>
                      <FaInstagram />
                    </a>
                  </li>
                  <li>
                    <a>
                      <FaYoutube />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;

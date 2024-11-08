import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowLeft, FaArrowRightToBracket } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useGetBlogListQuery } from "../slices/adminSlice";
import { Avatar, CircularProgress } from "@mui/material";
import { useGetBlogCategorizedQuery } from "../slices/customerSlice";

const BlogDetails = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state.auth);
  const [paramId, setParamId] = useState("");
  const {
    data: getBlog,
    isLoading: blogLoading,
    isError: blogError,
  } = useGetBlogListQuery({ page: 1, limit: 10 });

  const {
    data: getBlogCategorized,
    isLoading: blogCategorizedLoading,
    isError: blogCategorizedError,
  } = useGetBlogCategorizedQuery({ page: 1, limit: 20 });

  useEffect(() => {
    // come to the top of the page
    window.scrollTo(0, 0);
    const path = window.location.pathname.split("/");
    const paramId = path[path.length - 1];
    // remove space from paramId
    paramId && setParamId(paramId.replace(/%20/g, " "));
  }, [window.location.pathname]);

  const slugHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    let text = div.textContent || div.innerText || "";

    return text;
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
                <li className="nav-item">
                  {/* <a
                    className="nav-link"
                    href="pricing.html"
                    style={{ fontWeight: 600 }}
                  >
                    Pricing
                  </a> */}
                </li>
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
      <section
        id="blogUser"
        style={{
          marginTop: "100px",
          marginBottom: "100px",
        }}
      >
        <div className="container">
          {/* backButton */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/blog-user")}
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
              Back to Blog
            </span>
          </div>
          <div className="row">
            {getBlogCategorized &&
              getBlogCategorized?.result &&
              getBlogCategorized?.result.length > 0 &&
              getBlogCategorized?.result?.map((blogs) => {
                return blogs?.blogs?.map((blog) => {
                  if (blog?.blogInfo?.slugUrl === paramId) {
                    return (
                      <div className="col-md-8" key={blog?.blogInfo?.slugUrl}>
                        {/* author info */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "20px",
                          }}
                        >
                          <div
                            className="author-info"
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "20px",
                            }}
                          >
                            <div className="author-info-left">
                              <Avatar
                                src={blog?.authorProfile?.authorImage}
                                alt="author"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                }}
                              />
                            </div>
                            <div className="author-info-right">
                              <h3
                                style={{
                                  fontSize: "20px",
                                  fontWeight: 600,
                                  marginBottom: "5px",
                                }}
                              >
                                {blog?.authorProfile?.authorName}
                              </h3>
                              <span
                                style={{
                                  fontSize: "14px",
                                  color: "#666",
                                  fontWeight: 500,
                                  width: "30%",
                                }}
                              >
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      blog?.authorProfile?.authorDescription,
                                  }}
                                />
                              </span>
                              <span
                                style={{
                                  fontSize: "14px",
                                  color: "#666",
                                  fontWeight: 500,
                                }}
                              >
                                {new Date(blog?.createdAt).toDateString()}
                              </span>
                            </div>
                          </div>

                          {/* social media links */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: "10px",
                              cursor: "pointer",
                            }}
                          >
                            {blog?.authorSocialLinks?.facebook && (
                              <i
                                className="fab fa-facebook-square"
                                onClick={() =>
                                  window.open(
                                    `https://${blog.authorSocialLinks.facebook}`,
                                    "_blank"
                                  )
                                }
                              ></i>
                            )}
                            {/* Repeat other social media links here */}
                          </div>
                        </div>

                        <div className="top-blog">
                          <a>
                            <img
                              src={blog?.blogBannerImage}
                              className="img-fluid"
                              width="100%"
                            />
                          </a>
                        </div>

                        <div className="blog-lead-details mt-4">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: blog?.blogInfo?.description,
                            }}
                          />
                        </div>
                        <h1
                          style={{
                            fontSize: "30px",
                            fontWeight: 600,
                            marginTop: "60px",
                            marginBottom: "30px",
                          }}
                        >
                          FAQs
                        </h1>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "50px",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                          }}
                        >
                          {blog?.tableOfContents?.map((content) => {
                            return (
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    width: "100%",
                                  }}
                                >
                                  <h3
                                    style={{
                                      fontSize: "20px",
                                      fontWeight: 600,
                                      marginBottom: "10px",
                                    }}
                                  >
                                    {content?.question}
                                  </h3>
                                  <div
                                    style={{ textAlign: "left" }}
                                    dangerouslySetInnerHTML={{
                                      __html: content?.description,
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="top-blog-left">
                              <a>
                                <img
                                  src={blog?.blogThumbnailImage}
                                  className="img-fluid"
                                  width="100%"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null; // Fallback for blogs that don't match paramId
                });
              })}
            {blogLoading && (
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
            )}
            <div className="col-md-4">
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
                      getBlogCategorized?.result[2]?.blogs[0]?.categoryDetails
                        ?.categoryName}
                  </h3>

                  <a href="">
                    <img
                      src={
                        getBlogCategorized?.result[2]?.blogs[0]?.blogBannerImage
                      }
                      className="img-fluid"
                      width="100%"
                    />
                  </a>
                  <div className="blog-top-test">
                    <h4>
                      {getBlogCategorized?.result[2]?.blogs[0]?.blogInfo?.title}
                    </h4>
                    <a href="">
                      {getBlogCategorized?.result[2]?.blogs[0]?.blogInfo?.h1Tag}
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
                            getBlogCategorized?.result[2]?.blogs[0]?.blogInfo
                              ?.description
                          )?.substring(0, 120) + "..."
                        : slugHtml(
                            getBlogCategorized?.result[2]?.blogs[0]?.blogInfo
                              ?.description
                          )}
                    </p>
                  </div>
                </div>
              </div>
              {getBlogCategorized?.result[2]?.blogs?.length > 0 &&
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
                          {/* <img
                            src={blog?.blogBannerImage}
                            className="img-fluid"
                          /> */}
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
                        getBlogCategorized?.result[3]?.blogs[0]?.blogBannerImage
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
                              getBlogCategorized?.result[3]?.blogs[0]?.blogInfo
                                ?.description
                            )?.substring(0, 120) + "..."
                          : slugHtml(
                              getBlogCategorized?.result[3]?.blogs[0]?.blogInfo
                                ?.description
                            ))}
                    </p>
                  </div>
                </div>
              </div>

              {getBlogCategorized?.result[3]?.blogs?.length > 1 &&
                getBlogCategorized?.result[3]?.blogs
                  ?.slice(1)

                  ?.map((blog, index) => {
                    const div = document.createElement("div");
                    div.innerHTML = blog?.blogInfo?.description;
                    const text = div.textContent || div.innerText || "";

                    return (
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/blog-details/${blog?.blogInfo.slugUrl}`)
                        }
                        className="bloging-post"
                      >
                        <div className="bloging-post-left">
                          {/* <img
                            src={blog.blogBannerImage}
                            className="img-fluid"
                          /> */}
                        </div>
                        <div className="bloging-post-right">
                          <p>{blog?.blogInfo?.title}</p>
                        </div>
                      </a>
                    );
                  })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetails;

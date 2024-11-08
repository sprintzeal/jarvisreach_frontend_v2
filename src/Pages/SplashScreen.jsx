import { CircularProgress, Dialog, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import {
  FaArrowRightToBracket,
  FaCheck,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaQuoteLeft,
  FaQuoteRight,
  FaStar,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state.auth);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  useEffect(() => {
    if (auth) {
      if (auth.result.role === "admin") {
        navigate("/dashboard");
      } else if (
        auth.result.role !== "admin" &&
        window.location.pathname === "/"
      ) {
        navigate("/folder");
      }
    }
  }),
    [auth, navigate];

  if (auth) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "transparent",
          height: "100vh",
        }}
      >
        <img
          src="https://d2ds8yldqp7gxv.cloudfront.net/lead/jarvis-logo.png"
          alt="logo"
          width="200"
          height="33"
        />
        <CircularProgress style={{ color: "red", fontSize: "100px" }} />
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: isSmallScreen ? "90%" : "70%",
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
            <div className=" navbar-nav" id="navbarSupportedContent">
              {/* <ul className="navbar-nav mx-auto mb-2 mb-lg-0 ">
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
              <div className="d-flex" role="search">
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
                <button
                  className="btn get-free"
                  type="submit"
                  style={{
                    borderRadius: "10px",
                    display: isSmallScreen ? "none" : "block",
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

      <section id="superCharge" className="super-charge">
        <div className="container">
          <div className="website">
            <img
              src="https://d2ds8yldqp7gxv.cloudfront.net/lead/website.png"
              className="img-fluid"
            />
          </div>
          <div className="row d-flex align-items-center">
            <div className="col-md-7">
              <div className="super-charger">
                <h1>Elevate your LinkedIn prospecting </h1>
                <p>
                  Leverage Jarvis Reach to obtain email addresses for your
                  LinkedIn prospects, even if you're not yet connected.
                </p>
                <a
                  onClick={() => navigate("/register")}
                  style={{
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  className="banner-btn"
                >
                  Start Now, It’s Free
                </a>
                <ul>
                  <li>
                    <FaStar style={{ color: "#FFC107" }} />
                  </li>
                  <li>
                    <FaStar style={{ color: "#FFC107" }} />
                  </li>
                  <li>
                    <FaStar style={{ color: "#FFC107" }} />
                  </li>
                  <li>
                    <FaStar style={{ color: "#FFC107" }} />
                  </li>
                  <li>
                    <FaStar style={{ color: "#FFC107" }} />
                  </li>
                  <li>
                    <strong>1,000+</strong> App Reviews
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-5">
              <div className="lead-top-banner">
                <div className="banner-bg">
                  <img src="https://d2ds8yldqp7gxv.cloudfront.net/lead/banner.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="joinCompany">
        <div className="container">
          <div className="join-tittle">
            <h6>
              Join 200,000 companies connecting directly with business
              professionals using Jarvis Reach.
            </h6>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div id="joinBrand">
                <div
                  className="owl-carousel owl-theme join-company"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: isSmallScreen ? "column" : "row",
                    gap: "10px",
                  }}
                >
                  <div className="join">
                    <img src="https://d2ds8yldqp7gxv.cloudfront.net/lead/brand-one.png" />
                  </div>
                  <div className="join">
                    <img src="https://d2ds8yldqp7gxv.cloudfront.net/lead/brand-two.png" />
                  </div>
                  <div className="join">
                    <img src="https://d2ds8yldqp7gxv.cloudfront.net/lead/brand-three.png" />
                  </div>
                  <div className="join">
                    <img src="https://d2ds8yldqp7gxv.cloudfront.net/lead/brand-four.png" />
                  </div>
                  <div className="join">
                    <img src="https://d2ds8yldqp7gxv.cloudfront.net/lead/brand-five.png" />
                  </div>
                  <div className="join">
                    <img src="https://d2ds8yldqp7gxv.cloudfront.net/lead/brand-six.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="trySprint">
        <div className="container">
          <div className="row">
            <div className="col-md-10 offset-md-1">
              <div className="try-your-self">
                <img
                  src="https://d2ds8yldqp7gxv.cloudfront.net/lead/your-self.png"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="emailFinder">
        <div className="container">
          <div className="row d-flex align-items-center">
            <div className="col-md-4">
              <div className="browser-img">
                <img
                  src="https://d2ds8yldqp7gxv.cloudfront.net/lead/email-finder.webp"
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="col-md-7 offset-md-1">
              <div className="browser-content">
                <h3>OUR BROWSER EXTENSION </h3>
                <h2>
                  The Email Finder Preferred <br />
                  by Professionals
                </h2>
                <p>
                  Our proprietary engine locates emails and phone numbers from
                  various sources and validates them within seconds.
                </p>
                <a href="email-finder.html">Learn More</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="topRated">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="top-rate">
                <h2>Top Rated</h2>
                <p>
                  Jarvis Reach consistently earns top marks on quality review
                  sites.
                </p>
                <img
                  src="https://d2ds8yldqp7gxv.cloudfront.net/lead/top-rated.webp"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="easyPeasy">
        <div className="container">
          <div className="row d-flex align-items-center">
            <div className="col-md-5">
              <div className="easy-peasy-cnt">
                <h3>EASY PEASY</h3>
                <h2>
                  Build Accurate <br />
                  Lead Lists{" "}
                </h2>
                <p>
                  Effortlessly save prospects and find contact information at
                  scale. Jarvis Reach extracts and enriches over 40 data points
                  per contact.
                </p>
                <a href="contact.html">Learn More</a>
              </div>
            </div>
            <div className="col-md-6 offset-md-1">
              <div className="easy-peasy-img">
                <img
                  src="https://d2ds8yldqp7gxv.cloudfront.net/lead/easy-peasy.png"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="blueSection">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="simple-fast">
                <h3>SIMPLE & FAST </h3>
                <h2>Effortlessly Manage Your Leads </h2>
                <h4>
                  Enhance your productivity with unparalleled lead management
                  capabilities.
                </h4>
                <div className="simple-fast-img">
                  <img
                    src="https://d2ds8yldqp7gxv.cloudfront.net/lead/simple-fast-one.png"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="integrationPart">
        <div className="container-fluid">
          <div className="row d-flex align-items-center">
            <div className="col-md-6">
              <div className="integration-left">
                <img
                  src="https://d2ds8yldqp7gxv.cloudfront.net/lead/integrations-one.png"
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="col-md-4 offset-md-1">
              <div className="integration-cont">
                <h3>INTEGRATIONS</h3>
                <h2>Direct High-Quality Leads Where You Need Them </h2>
                <p>
                  Jarvis Reach seamlessly integrates with numerous apps,
                  including leading CRM, outreach, and productivity tools.
                </p>
                <a href="integrations.html">See our integrations</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="customerReview">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="testimonali-top">
                <h3>TESTIMONIALS </h3>
                <h2>Feedback from Our Valued Customers</h2>
              </div>

              <div id="aluminiReview">
                <div
                  className="owl-carousel owl-theme instructorsreview"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: isSmallScreen ? "column" : "row",
                    gap: isSmallScreen ? "10px" : "",
                  }}
                >
                  <div className="testimonial-three">
                    <div className="alumini-test">
                      <div className="alumini-test-left">
                        <img src="https://www.upgrad.com/_ww3-next/image/?url=https%3A%2F%2Fd2o2utebsixu4k.cloudfront.net%2FMBA%20GGU_Murat%20Wahab%20Dweb%20-149429a398874acc8b784048dcf8233f.webp&w=96&q=75" />
                      </div>
                      <div className="alumini-test-right">
                        <h4>Murat Wahab</h4>
                        <p>Founder and Principal</p>
                        <ul>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="alumini-content">
                      <div className="alumini-content">
                        <p>
                          <FaQuoteLeft style={{ fontSize: "20px" }} />
                          Here's what one of the incoming learners has to say
                          about Golden Gate University San Francisco's MBA
                          <FaQuoteRight style={{ fontSize: "20px" }} />
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-three">
                    <div className="alumini-test">
                      <div className="alumini-test-left">
                        <img src="https://www.upgrad.com/_ww3-next/image/?url=https%3A%2F%2Fd2o2utebsixu4k.cloudfront.net%2FMBA%20GGU_Murat%20Wahab%20Dweb%20-149429a398874acc8b784048dcf8233f.webp&w=96&q=75" />
                      </div>
                      <div className="alumini-test-right">
                        <h4>Murat Wahab</h4>
                        <p>Founder and Principal</p>
                        <ul>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="alumini-content">
                      <div className="alumini-content">
                        <p>
                          <FaQuoteLeft style={{ fontSize: "20px" }} />
                          Here's what one of the incoming learners has to say
                          about Golden Gate University San Francisco's MBA
                          <FaQuoteRight style={{ fontSize: "20px" }} />
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-three">
                    <div className="alumini-test">
                      <div className="alumini-test-left">
                        <img src="https://www.upgrad.com/_ww3-next/image/?url=https%3A%2F%2Fd2o2utebsixu4k.cloudfront.net%2FMBA%20GGU_Murat%20Wahab%20Dweb%20-149429a398874acc8b784048dcf8233f.webp&w=96&q=75" />
                      </div>
                      <div className="alumini-test-right">
                        <h4>Murat Wahab</h4>
                        <p>Founder and Principal</p>
                        <ul>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="alumini-content">
                      <div className="alumini-content">
                        <p>
                          <FaQuoteLeft style={{ fontSize: "20px" }} />
                          Here's what one of the incoming learners has to say
                          about Golden Gate University San Francisco's MBA
                          <FaQuoteRight style={{ fontSize: "20px" }} />
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-three">
                    <div className="alumini-test">
                      <div className="alumini-test-left">
                        <img src="https://www.upgrad.com/_ww3-next/image/?url=https%3A%2F%2Fd2o2utebsixu4k.cloudfront.net%2FMBA%20GGU_Murat%20Wahab%20Dweb%20-149429a398874acc8b784048dcf8233f.webp&w=96&q=75" />
                      </div>
                      <div className="alumini-test-right">
                        <h4>Murat Wahab</h4>
                        <p>Founder and Principal</p>
                        <ul>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="alumini-content">
                      <div className="alumini-content">
                        <p>
                          <FaQuoteLeft style={{ fontSize: "20px" }} />
                          Here's what one of the incoming learners has to say
                          about Golden Gate University San Francisco's MBA
                          <FaQuoteRight style={{ fontSize: "20px" }} />
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-three">
                    <div className="alumini-test">
                      <div className="alumini-test-left">
                        <img src="https://www.upgrad.com/_ww3-next/image/?url=https%3A%2F%2Fd2o2utebsixu4k.cloudfront.net%2FMBA%20GGU_Murat%20Wahab%20Dweb%20-149429a398874acc8b784048dcf8233f.webp&w=96&q=75" />
                      </div>
                      <div className="alumini-test-right">
                        <h4>Murat Wahab</h4>
                        <p>Founder and Principal</p>
                        <ul>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                          <li>
                            <FaStar style={{ color: "#FFC107" }} />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="alumini-content">
                      <div className="alumini-content">
                        <p>
                          <FaQuoteLeft style={{ fontSize: "20px" }} />
                          Here's what one of the incoming learners has to say
                          about Golden Gate University San Francisco's MBA
                          <FaQuoteRight style={{ fontSize: "20px" }} />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                <a
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/register")}
                >
                  Get started, It's Free
                </a>
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
                      onClick={() => {
                        navigate("/help");
                      }}
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
                    <a href="#">Changelog</a>
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
                    <a x>
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

export default SplashScreen;

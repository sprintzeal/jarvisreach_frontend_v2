import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const BulOnSaleNavigator = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state.auth);
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
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="pricing.html"
                    style={{ fontWeight: 600 }}
                  >
                    Pricing
                  </a>
                </li>
              </ul>
              <div className="d-flex" role="search">
                {auth && auth?.result ? (
                  <button
                    className="btn btn-primary me-2 radius-50"
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

      <section id="getnavbar">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div id="getBreadcrumb">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">All Collections</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Bulk Enrichment
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Bulk Enrichment on Sales Navigator
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="UnderstandingCredit">
        <div className="container">
          <div className="row">
            <div className="col-sm-9">
              <div className="tab-content pt-0" id="credit-understanding">
                <div
                  className="tab-pane fade active show"
                  id="what-happens"
                  role="tabpanel"
                  aria-labelledby="what-happens-tab2"
                >
                  <div className="person-twice">
                    <h3>Bulk Enrichment on Sales Navigator</h3>
                    <span>Updated over a week ago</span>
                    <p>
                      Jarvis Reach charges one credit every time it successfully
                      retrieves at least one email address for a LinkedIn
                      profile. It is important to note that only one credit will
                      be deducted per contact, irrespective of the number of
                      email addresses found.
                    </p>
                    <p>
                      Additionally, our paid account holders are entitled to
                      access company details and mobile phone numbers (if
                      available) at no extra cost.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>
                      To recap: One credit equals one contact with one or more
                      emails (phones are not charged)
                    </h4>
                    <p>
                      Furthermore, when contacts are added using LinkedIn URLs,
                      our credit valuation process remains consistent. Credits
                      are only consumed when a valid URL is provided and the
                      associated LinkedIn profile contains at least one email
                      address.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>
                      How Credits and Daily Rate Limits Work with API Calls
                    </h4>
                    <p>
                      <strong>Credit Consumption: </strong> Each API call
                      consumes one credit, but only if it returns results. This
                      means that if you make an API call and there are no
                      results, your credit balance remains unchanged.
                    </p>
                    <p>
                      <strong>Daily Rate Limits:</strong> Regardless of whether
                      the API call returns results, each call contributes to the
                      daily rate limit. It's important to know that the rate
                      limit is separate from credit usage and is based on the
                      number of calls you make within a 24-hour period.
                    </p>
                    <p>
                      <strong>Starter and Advanced Plans:</strong> In both
                      plans, the daily rate limit is set at 600 API calls. This
                      means you can make up to 600 calls per day without
                      exceeding the limit.
                    </p>
                    <p>
                      If you need to exceed the daily API call limits of the
                      Starter or Advanced plans, the only plan that offers a
                      higher limit is the{" "}
                      <strong>
                        Pro 6 Semi-Annual subscription 20k per day.
                      </strong>{" "}
                      This plan is designed for users who require more
                      flexibility with a larger daily call capacity.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>What happens if I add the same person twice?</h4>
                    <p>
                      Our system automatically detects the duplication and you
                      are not charged again. Profiles are not duplicated, and
                      the system will automatically update the profile data if
                      necessary.{" "}
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>Will my unused credits roll over?</h4>
                    <p>
                      We offer a convenient monthly plan whereby new credits are
                      allocated at the start of each billing cycle. However any
                      unused credits will expire at the end of the cycle and
                      will not be carried forward.
                    </p>
                    <p>
                      For clients subscribed to our semi-annual plans, we
                      provide fresh credits at the beginning of every six-month
                      cycle, so you can utilize them according to your
                      requirements without any time constraints. It is important
                      to note, however, that any credits left unutilized at the
                      end of the cycle will expire and cannot be carried forward
                      to the next cycle.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>What happens if I decide to cancel my subscription?</h4>
                    <p>
                      In the event of a subscription termination, all premium
                      features will become restricted, reverting to the
                      limitations of a free account. This means that certain
                      features such as contact exports, integrations, and phone
                      number views will no longer be available.
                    </p>
                    <p>
                      Profiles added to Jarvis Reach are continually updated
                      with the latest information, including experience,
                      industry, emails, and phone numbers. This ensures that all
                      the profiles you add remain 'fresh' and accurate.
                    </p>
                    <p>
                      Please note that phone numbers are not included in the
                      free plan. If you wish to continue accessing this feature,
                      it will be necessary to upgrade to a paid plan, which
                      offers phone number refresh as an additional feature.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>
                      Can I delete profiles if I want to free up credits or if
                      the results are not relevant?{" "}
                    </h4>
                    <p>
                      Once credits are consumed for a particular email
                      retrieval, classification, and validation process, they
                      cannot be reclaimed or refunded.
                    </p>
                  </div>

                  <div className="artical-linka">
                    <h3>Related Articles</h3>
                    <ul>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          What are LinkedIn limits?
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          Import Data from a List of URLs using Jarvis Reach
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          Understanding Unverifiable Email Addresses: The
                          Warning Icon Explained
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          Changing my Subscription- Upgrading or Downgrading
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          How to Get My Monthly Free Credits
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="did-answer">
                    <h5>Did this answer your question?</h5>
                    <ul>
                      <li>
                        <a href="">😞</a>
                      </li>
                      <li>
                        <a href="">😐</a>
                      </li>
                      <li>
                        <a href="">😃</a>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* <div
                  className="tab-pane fade"
                  id="unused-credits"
                  role="tabpanel"
                  aria-labelledby="unused-credits"
                >
                  <div className="person-twice">
                    <h3>Understanding How Credits are Charged</h3>
                    <span>Updated over a week ago</span>
                    <p>
                      Jarvis Reach charges one credit every time it successfully
                      retrieves at least one email address for a LinkedIn
                      profile. It is important to note that only one credit will
                      be deducted per contact, irrespective of the number of
                      email addresses found.
                    </p>
                    <p>
                      Additionally, our paid account holders are entitled to
                      access company details and mobile phone numbers (if
                      available) at no extra cost.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>
                      To recap: One credit equals one contact with one or more
                      emails (phones are not charged)
                    </h4>
                    <p>
                      Furthermore, when contacts are added using LinkedIn URLs,
                      our credit valuation process remains consistent. Credits
                      are only consumed when a valid URL is provided and the
                      associated LinkedIn profile contains at least one email
                      address.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>
                      How Credits and Daily Rate Limits Work with API Calls
                    </h4>
                    <p>
                      <strong>Credit Consumption: </strong> Each API call
                      consumes one credit, but only if it returns results. This
                      means that if you make an API call and there are no
                      results, your credit balance remains unchanged.
                    </p>
                    <p>
                      <strong>Daily Rate Limits:</strong> Regardless of whether
                      the API call returns results, each call contributes to the
                      daily rate limit. It's important to know that the rate
                      limit is separate from credit usage and is based on the
                      number of calls you make within a 24-hour period.
                    </p>
                    <p>
                      <strong>Starter and Advanced Plans:</strong> In both
                      plans, the daily rate limit is set at 600 API calls. This
                      means you can make up to 600 calls per day without
                      exceeding the limit.
                    </p>
                    <p>
                      If you need to exceed the daily API call limits of the
                      Starter or Advanced plans, the only plan that offers a
                      higher limit is the{" "}
                      <strong>
                        Pro 6 Semi-Annual subscription 20k per day.
                      </strong>{" "}
                      This plan is designed for users who require more
                      flexibility with a larger daily call capacity.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>What happens if I add the same person twice?</h4>
                    <p>
                      Our system automatically detects the duplication and you
                      are not charged again. Profiles are not duplicated, and
                      the system will automatically update the profile data if
                      necessary.{" "}
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>Will my unused credits roll over?</h4>
                    <p>
                      We offer a convenient monthly plan whereby new credits are
                      allocated at the start of each billing cycle. However any
                      unused credits will expire at the end of the cycle and
                      will not be carried forward.
                    </p>
                    <p>
                      For clients subscribed to our semi-annual plans, we
                      provide fresh credits at the beginning of every six-month
                      cycle, so you can utilize them according to your
                      requirements without any time constraints. It is important
                      to note, however, that any credits left unutilized at the
                      end of the cycle will expire and cannot be carried forward
                      to the next cycle.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>What happens if I decide to cancel my subscription?</h4>
                    <p>
                      In the event of a subscription termination, all premium
                      features will become restricted, reverting to the
                      limitations of a free account. This means that certain
                      features such as contact exports, integrations, and phone
                      number views will no longer be available.
                    </p>
                    <p>
                      Profiles added to Jarvis Reach are continually updated
                      with the latest information, including experience,
                      industry, emails, and phone numbers. This ensures that all
                      the profiles you add remain 'fresh' and accurate.
                    </p>
                    <p>
                      Please note that phone numbers are not included in the
                      free plan. If you wish to continue accessing this feature,
                      it will be necessary to upgrade to a paid plan, which
                      offers phone number refresh as an additional feature.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>
                      Can I delete profiles if I want to free up credits or if
                      the results are not relevant?{" "}
                    </h4>
                    <p>
                      Once credits are consumed for a particular email
                      retrieval, classification, and validation process, they
                      cannot be reclaimed or refunded.
                    </p>
                  </div>

                  <div className="artical-linka">
                    <h3>Related Articles</h3>
                    <ul>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          What are LinkedIn limits?
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          Import Data from a List of URLs using Jarvis Reach
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          Understanding Unverifiable Email Addresses: The
                          Warning Icon Explained
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          Changing my Subscription- Upgrading or Downgrading
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          How to Get My Monthly Free Credits
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="did-answer">
                    <h5>Did this answer your question?</h5>
                    <ul>
                      <li>
                        <a href="">😞</a>
                      </li>
                      <li>
                        <a href="">😐</a>
                      </li>
                      <li>
                        <a href="">😃</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="my-subscription"
                  role="tabpanel"
                  aria-labelledby="my-subscription-tab2"
                >
                  <div className="person-twice">
                    <h3>Understanding How Credits are Charged</h3>
                    <span>Updated over a week ago</span>
                    <p>
                      Jarvis Reach charges one credit every time it successfully
                      retrieves at least one email address for a LinkedIn
                      profile. It is important to note that only one credit will
                      be deducted per contact, irrespective of the number of
                      email addresses found.
                    </p>
                    <p>
                      Additionally, our paid account holders are entitled to
                      access company details and mobile phone numbers (if
                      available) at no extra cost.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>
                      To recap: One credit equals one contact with one or more
                      emails (phones are not charged)
                    </h4>
                    <p>
                      Furthermore, when contacts are added using LinkedIn URLs,
                      our credit valuation process remains consistent. Credits
                      are only consumed when a valid URL is provided and the
                      associated LinkedIn profile contains at least one email
                      address.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>
                      How Credits and Daily Rate Limits Work with API Calls
                    </h4>
                    <p>
                      <strong>Credit Consumption: </strong> Each API call
                      consumes one credit, but only if it returns results. This
                      means that if you make an API call and there are no
                      results, your credit balance remains unchanged.
                    </p>
                    <p>
                      <strong>Daily Rate Limits:</strong> Regardless of whether
                      the API call returns results, each call contributes to the
                      daily rate limit. It's important to know that the rate
                      limit is separate from credit usage and is based on the
                      number of calls you make within a 24-hour period.
                    </p>
                    <p>
                      <strong>Starter and Advanced Plans:</strong> In both
                      plans, the daily rate limit is set at 600 API calls. This
                      means you can make up to 600 calls per day without
                      exceeding the limit.
                    </p>
                    <p>
                      If you need to exceed the daily API call limits of the
                      Starter or Advanced plans, the only plan that offers a
                      higher limit is the{" "}
                      <strong>
                        Pro 6 Semi-Annual subscription 20k per day.
                      </strong>{" "}
                      This plan is designed for users who require more
                      flexibility with a larger daily call capacity.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>What happens if I add the same person twice?</h4>
                    <p>
                      Our system automatically detects the duplication and you
                      are not charged again. Profiles are not duplicated, and
                      the system will automatically update the profile data if
                      necessary.{" "}
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>Will my unused credits roll over?</h4>
                    <p>
                      We offer a convenient monthly plan whereby new credits are
                      allocated at the start of each billing cycle. However any
                      unused credits will expire at the end of the cycle and
                      will not be carried forward.
                    </p>
                    <p>
                      For clients subscribed to our semi-annual plans, we
                      provide fresh credits at the beginning of every six-month
                      cycle, so you can utilize them according to your
                      requirements without any time constraints. It is important
                      to note, however, that any credits left unutilized at the
                      end of the cycle will expire and cannot be carried forward
                      to the next cycle.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>What happens if I decide to cancel my subscription?</h4>
                    <p>
                      In the event of a subscription termination, all premium
                      features will become restricted, reverting to the
                      limitations of a free account. This means that certain
                      features such as contact exports, integrations, and phone
                      number views will no longer be available.
                    </p>
                    <p>
                      Profiles added to Jarvis Reach are continually updated
                      with the latest information, including experience,
                      industry, emails, and phone numbers. This ensures that all
                      the profiles you add remain 'fresh' and accurate.
                    </p>
                    <p>
                      Please note that phone numbers are not included in the
                      free plan. If you wish to continue accessing this feature,
                      it will be necessary to upgrade to a paid plan, which
                      offers phone number refresh as an additional feature.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>
                      Can I delete profiles if I want to free up credits or if
                      the results are not relevant?{" "}
                    </h4>
                    <p>
                      Once credits are consumed for a particular email
                      retrieval, classification, and validation process, they
                      cannot be reclaimed or refunded.
                    </p>
                  </div>

                  <div className="artical-linka">
                    <h3>Related Articles</h3>
                    <ul>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          What are LinkedIn limits?
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          Import Data from a List of URLs using Jarvis Reach
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          Understanding Unverifiable Email Addresses: The
                          Warning Icon Explained
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          Changing my Subscription- Upgrading or Downgrading
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          How to Get My Monthly Free Credits
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="did-answer">
                    <h5>Did this answer your question?</h5>
                    <ul>
                      <li>
                        <a href="">😞</a>
                      </li>
                      <li>
                        <a href="">😐</a>
                      </li>
                      <li>
                        <a href="">😃</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="delete-profiles"
                  role="tabpanel"
                  aria-labelledby="delete-profiles-tab2"
                >
                  <div className="person-twice">
                    <h3>Understanding How Credits are Charged</h3>
                    <span>Updated over a week ago</span>
                    <p>
                      Jarvis Reach charges one credit every time it successfully
                      retrieves at least one email address for a LinkedIn
                      profile. It is important to note that only one credit will
                      be deducted per contact, irrespective of the number of
                      email addresses found.
                    </p>
                    <p>
                      Additionally, our paid account holders are entitled to
                      access company details and mobile phone numbers (if
                      available) at no extra cost.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>
                      To recap: One credit equals one contact with one or more
                      emails (phones are not charged)
                    </h4>
                    <p>
                      Furthermore, when contacts are added using LinkedIn URLs,
                      our credit valuation process remains consistent. Credits
                      are only consumed when a valid URL is provided and the
                      associated LinkedIn profile contains at least one email
                      address.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>
                      How Credits and Daily Rate Limits Work with API Calls
                    </h4>
                    <p>
                      <strong>Credit Consumption: </strong> Each API call
                      consumes one credit, but only if it returns results. This
                      means that if you make an API call and there are no
                      results, your credit balance remains unchanged.
                    </p>
                    <p>
                      <strong>Daily Rate Limits:</strong> Regardless of whether
                      the API call returns results, each call contributes to the
                      daily rate limit. It's important to know that the rate
                      limit is separate from credit usage and is based on the
                      number of calls you make within a 24-hour period.
                    </p>
                    <p>
                      <strong>Starter and Advanced Plans:</strong> In both
                      plans, the daily rate limit is set at 600 API calls. This
                      means you can make up to 600 calls per day without
                      exceeding the limit.
                    </p>
                    <p>
                      If you need to exceed the daily API call limits of the
                      Starter or Advanced plans, the only plan that offers a
                      higher limit is the{" "}
                      <strong>
                        Pro 6 Semi-Annual subscription 20k per day.
                      </strong>{" "}
                      This plan is designed for users who require more
                      flexibility with a larger daily call capacity.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>What happens if I add the same person twice?</h4>
                    <p>
                      Our system automatically detects the duplication and you
                      are not charged again. Profiles are not duplicated, and
                      the system will automatically update the profile data if
                      necessary.{" "}
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>Will my unused credits roll over?</h4>
                    <p>
                      We offer a convenient monthly plan whereby new credits are
                      allocated at the start of each billing cycle. However any
                      unused credits will expire at the end of the cycle and
                      will not be carried forward.
                    </p>
                    <p>
                      For clients subscribed to our semi-annual plans, we
                      provide fresh credits at the beginning of every six-month
                      cycle, so you can utilize them according to your
                      requirements without any time constraints. It is important
                      to note, however, that any credits left unutilized at the
                      end of the cycle will expire and cannot be carried forward
                      to the next cycle.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>What happens if I decide to cancel my subscription?</h4>
                    <p>
                      In the event of a subscription termination, all premium
                      features will become restricted, reverting to the
                      limitations of a free account. This means that certain
                      features such as contact exports, integrations, and phone
                      number views will no longer be available.
                    </p>
                    <p>
                      Profiles added to Jarvis Reach are continually updated
                      with the latest information, including experience,
                      industry, emails, and phone numbers. This ensures that all
                      the profiles you add remain 'fresh' and accurate.
                    </p>
                    <p>
                      Please note that phone numbers are not included in the
                      free plan. If you wish to continue accessing this feature,
                      it will be necessary to upgrade to a paid plan, which
                      offers phone number refresh as an additional feature.
                    </p>
                  </div>
                  <div className="common-credit">
                    <h4>
                      Can I delete profiles if I want to free up credits or if
                      the results are not relevant?{" "}
                    </h4>
                    <p>
                      Once credits are consumed for a particular email
                      retrieval, classification, and validation process, they
                      cannot be reclaimed or refunded.
                    </p>
                  </div>

                  <div className="artical-linka">
                    <h3>Related Articles</h3>
                    <ul>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          What are LinkedIn limits?
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          Import Data from a List of URLs using Jarvis Reach
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          Understanding Unverifiable Email Addresses: The
                          Warning Icon Explained
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          Changing my Subscription- Upgrading or Downgrading
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                          How to Get My Monthly Free Credits
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="did-answer">
                    <h5>Did this answer your question?</h5>
                    <ul>
                      <li>
                        <a href="">😞</a>
                      </li>
                      <li>
                        <a href="">😐</a>
                      </li>
                      <li>
                        <a href="">😃</a>
                      </li>
                    </ul>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="col-sm-3">
              <div
                className="nav flex-column nav-pills nav-pills-tab"
                id="credit-changes"
                role="tablist"
                aria-orientation="vertical"
              >
                <a
                  className="nav-link active show mb-1"
                  id="what-happens-tab2"
                  data-bs-toggle="pill"
                  href="#what-happens"
                  role="tab"
                  aria-controls="what-happens"
                  aria-selected="true"
                >
                  What happens if I add the same person twice?
                </a>
                <a
                  className="nav-link mb-1"
                  id="unused-credits-tab2"
                  data-bs-toggle="pill"
                  href="#unused-credits"
                  role="tab"
                  aria-controls="unused-credits"
                  aria-selected="false"
                >
                  Will my unused credits roll over?
                </a>
                <a
                  className="nav-link mb-1"
                  id="my-subscription-tab2"
                  data-bs-toggle="pill"
                  href="#my-subscription"
                  role="tab"
                  aria-controls="my-subscription"
                  aria-selected="false"
                >
                  What happens if I decide to cancel my subscription?
                </a>
                <a
                  className="nav-link mb-1"
                  id="delete-profiles-tab2"
                  data-bs-toggle="pill"
                  href="#delete-profiles"
                  role="tab"
                  aria-controls="delete-profiles"
                  aria-selected="false"
                >
                  Can I delete profiles if I want to free up credits or if the
                  results are not relevant?
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
      </section>
    </div>
  );
};

export default BulOnSaleNavigator;

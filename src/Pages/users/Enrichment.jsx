import React, { useState } from "react";
import { FaCircleCheck, FaCopy, FaFilePen } from "react-icons/fa6";

const Enrichment = ({ collapsed }) => {
  const [active, setActive] = useState("api");
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
                    <li className="breadcrumb-item active">Enrichment</li>
                  </ol>
                </div>
                <h4 className="page-title">Enrichment</h4>
              </div>
            </div>
          </div>
          {/* <!-- end page title -->  */}

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-api">
                  <div className="user-main-sectiom">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="integare-file">
                          <h3>Enrichment</h3>
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
                                  (active === "api" ? " active" : "")
                                }
                                onClick={() => setActive("api")}
                              >
                                API
                              </a>
                            </li>
                            <li className="nav-item">
                              <a
                                data-bs-toggle="tab"
                                aria-expanded="true"
                                className={
                                  "nav-link" +
                                  (active === "csv" ? " active" : "")
                                }
                                onClick={() => setActive("csv")}
                              >
                                CSV
                              </a>
                            </li>
                          </ul>

                          <div className="tab-content">
                            <div
                              className={
                                "tab-pane" +
                                (active === "api" ? " show active" : "")
                              }
                              id="api-info"
                              style={{
                                display: active === "api" ? "block" : "none",
                              }}
                            >
                              <div className="api-keys">
                                <p
                                  style={{
                                    color: "#98a6ad",
                                    padding: "10px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Your API keys are like your passwords: make
                                  sure to always keep them hidden! Share them
                                  only with services you trust.{" "}
                                  <button
                                    type="button"
                                    className="btn btn-dark"
                                  >
                                    New API Key
                                  </button>
                                </p>
                              </div>

                              <div className="api-keys">
                                <h5>
                                  API Documentation{" "}
                                  <a href="">See Full Documentation</a>
                                </h5>
                              </div>

                              <div className="api-keys">
                                <h5>Most used API requests:</h5>
                                <div className="api-key-info">
                                  <h6>
                                    Find profile by full name and organization
                                    domain
                                  </h6>
                                  <div className="api-key-box">
                                    <p>
                                      <strong>GET</strong>{" "}
                                      https://api-public.jarvisreach.com/v1/persons/enrich?full_name=Ariel
                                      Camino&organization_domain=jarvisreach.com&api_key=•••••••••••••••••••...{" "}
                                      <a href="">
                                        <FaCopy style={{ fontSize: "1rem" }} />
                                      </a>{" "}
                                      <a href="">
                                        <FaFilePen
                                          style={{ fontSize: "1rem" }}
                                        />
                                      </a>
                                    </p>
                                  </div>
                                </div>
                                <div className="api-key-info">
                                  <h6>Find profile by linkedin url</h6>
                                  <div className="api-key-box">
                                    <p>
                                      <strong>GET</strong>{" "}
                                      https://api-public.jarvisreach.com/v1/persons/enrich?linkedin_url=https://www.linkedin.com/in/ariel-camino&api_key=•••••••••••••••••••••••••...{" "}
                                      <a href="">
                                        <FaCopy style={{ fontSize: "1rem" }} />
                                      </a>{" "}
                                      <a href="">
                                        <FaFilePen
                                          style={{ fontSize: "1rem" }}
                                        />
                                      </a>
                                    </p>
                                  </div>
                                </div>
                                <div className="api-key-info">
                                  <h6>Find company by name</h6>
                                  <div className="api-key-box">
                                    <p>
                                      <strong>GET</strong>{" "}
                                      https://api-public.jarvisreach.com/v1/organizations/enrich?organization_name=jarvisreach&api_key=•••••••••••••••••••••••••••••••12345...{" "}
                                      <a href="">
                                        <FaCopy style={{ fontSize: "1rem" }} />
                                      </a>{" "}
                                      <a href="">
                                        <FaFilePen
                                          style={{ fontSize: "1rem" }}
                                        />
                                      </a>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="api-keys">
                                <h5>Status</h5>
                                <p
                                  style={{
                                    fontSize: "1rem",
                                    fontWeight: "500",
                                    color: "#98a6ad",
                                  }}
                                >
                                  <FaCircleCheck style={{ color: "green" }} />{" "}
                                  Up & Running: 100%{" "}
                                  <a
                                    href=""
                                    style={{
                                      color: "#ff6471",
                                      fontWeight: "500",
                                    }}
                                  >
                                    Check on site
                                  </a>
                                </p>
                              </div>
                            </div>
                            <div
                              className={
                                "tab-pane" +
                                (active === "csv" ? " show active" : "")
                              }
                              id="csv-info"
                              style={{
                                display: active === "csv" ? "block" : "none",
                              }}
                            >
                              <div className="csv-key">
                                <img src="assets/images/users/enrichment-csv.svg" />
                                <h3>New Feature Coming Soon! </h3>
                              </div>
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

export default Enrichment;

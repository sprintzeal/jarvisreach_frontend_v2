import React from "react";
import { useNavigate } from "react-router";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <>
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
                      target="_blank"
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
                      target="_blank"
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
    </>
  );
};

export default Footer;

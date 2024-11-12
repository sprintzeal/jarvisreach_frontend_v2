import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useGetSubscriptionInfoQuery } from "../../slices/customerSlice";
import { useMediaQuery } from "@mui/system";

const Home = ({ collapsed }) => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("xl"));
  const {
    data: subscriptionInfoData,
    isLoading: subscriptionInfoLoading,
    error: subscriptionInfoError,
  } = useGetSubscriptionInfoQuery();

  return (
    <div
      style={{
        marginTop: "20px",
        marginBottom: "50px",
      }}
    >
      <div className="content-page">
        <div className="content">
          {/* <!-- Start Content--> */}
          <div className="container-fluid">
            {/* <!-- start page title --> */}
            
            <div className="row mt-1 extension_installed">
    	<div className="col-lg-6">
       
        <div className="card">
            <div className="card-body">
                <div className="ticking">
                    01
                </div>
                <div className="card-widgets widgets-post">
                    <a href="#" data-toggle="remove"><i className="mdi mdi-close"></i></a>
                   
                </div>
                 <div data-v-6510c040=""><div data-v-6510c040="" className="action-required"><span data-v-6510c040="">Action required</span></div></div>

                <div id="cardCollpase1" className="collapse show">
                <div className="row">
                    <div className="col-3">
                        <div className="avatar-eg rounded bg-soft-primary">
                            <img src="" width="50" height="50" />
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="">
                            <h3 className="text-dark mt-1 mb-2 font-15">Install Extension</h3>
                            <p className="text-muted mb-1">
                            <a href="">Watch tutorial</a> to learn how to find emails and extract leads directly from <strong>LinkedIn</strong>.
                            </p>
                            <a target="_blank" href="https://jarvisreach.io/install-extension" className="install extension_installed_a">Install <i className="fa-solid fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div> 
    </div>

    <div className="col-lg-6">
       
        <div className="card">
            <div className="card-body">
                <div className="ticking tickingnd">
                    02
                </div>
                <div className="card-widgets widgets-post">
                    <a href="#" data-toggle="remove"><i className="mdi mdi-close"></i></a>
                </div>
                
<div data-v-6510c040=""><div data-v-6510c040="" className="action-required"><span data-v-6510c040="">Action required</span></div></div>
                <div id="cardCollpase1" className="collapse show">
                <div className="row">
                    <div className="col-3">
                        <div className="avatar-eg rounded bg-soft-primary">
                            <img src="" width="50" height="50" />
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="">
                            <h3 className="text-dark mt-1 mb-2 font-15">Let's Get Started with Our Extension!</h3>
                            <p className="text-muted mb-1">
                            Unleash the Power of Our Extension! Let's add contacts on LinkedIn together.
                            </p>
                            <a target="_blank" href="https://jarvisreach.io/install-extension" className="install extension_installed_ab"><i className="fa-solid fa-circle-exclamation"></i> You need to install the extension first</a>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>

</div>

            <div className="row">
              <div className="col-12">
                <div className="page-title-box">
                  <h4 className="page-title">Credit Usage</h4>
                </div>
              </div>
            </div>
            {/* <!-- end page title -->   */}

            <div className="row ">
              <div className="col-md-4">
                <div className="credit-user-box tour-step-12">
                  <p
                    style={{
                      color: "#757575",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Credits used from your {subscriptionInfoData?.plan} plan
                  </p>
                  <h3
                    style={{
                      color: "#000",
                      fontSize: "24px",
                      fontWeight: 600,
                      padding: "10px 0",
                    }}
                  >
                    {subscriptionInfoData?.creditsUsed
                      ? subscriptionInfoData?.creditsUsed
                      : 0}{" "}
                    of{" "}
                    {subscriptionInfoData?.credits
                      ? subscriptionInfoData?.credits
                      : 0}
                  </h3>
                  <p
                    style={{
                      color: "#757575",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {subscriptionInfoData?.credits -
                      subscriptionInfoData?.creditsUsed}{" "}
                    credits remaining until{" "}
                    {new Date(subscriptionInfoData?.renewalDate).toDateString()}{" "}
                    renewal.
                  </p>
                </div>
              </div>
            </div>
            {/* <!-- end row --> */}

            <div className="row">
              <div className="quick-action">
                <h4>Quick Actions</h4>
              </div>
              {/* <div className="col-md-4">
                <div className="quick-main">
                  <div className="quick-main-left">
                    <img
                      src="assets/images/home/teamwork.png"
                      width="64"
                      height="64"
                    />
                  </div>
                  <div className="quick-main-right">
                    <h4>Add teammates</h4>
                    <p>Prospect better together.</p>
                    <a
                      style={{
                        cursor: "pointer",
                        color: "#ff777e",
                        textDecoration: "underline",
                      }}
                      onClick={() => {
                        navigate("/team");
                      }}
                    >
                      Send invite
                    </a>
                  </div>
                </div>
              </div> */}
              <div className="col-md-4 tour-step-13">
                <div
                  className="quick-main "
                  style={{
                    height: "160px",
                  }}
                >
                  <div className="quick-main-left">
                    <img
                      src="assets/images/home/folder.png"
                      width="64"
                      height="64"
                    />
                  </div>
                  <div className="quick-main-right">
                    <h4>Download extension</h4>
                    <p>Get contacts from Linkedin.</p>
                    <a target="_blank" href="https://chromewebstore.google.com/detail/jarvisreachio-free-b2b-ph/iccnendanoohhggjcghonkandiogched?hl=en-US&utm_source=ext_sidebar"
                      style={{
                        cursor: "pointer",
                        color: "#ff777e",
                        textDecoration: "underline",
                      }}
                    >
                      Get it now!
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-4 tour-step-14">
                <div
                  className="quick-main"
                  style={{
                    height: "160px",
                  }}
                >
                  <div className="quick-main-left">
                    <img
                      src="assets/images/home/rating.png"
                      width="64"
                      height="64"
                    />
                  </div>
                  <div className="quick-main-right">
                    <h4>Rate us on Chrome Store!</h4>
                    <p>Share your feedback.</p>
                    <a target="_blank" href="https://chromewebstore.google.com/detail/jarvisreachio-free-b2b-ph/iccnendanoohhggjcghonkandiogched?hl=en-US&utm_source=ext_sidebar"
                      style={{
                        cursor: "pointer",
                        color: "#ff777e",
                        textDecoration: "underline",
                      }}
                    >
                      Leave a Review
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- end row --> */}

            <div className="row">
              <div className="quick-action">
                <h4>Help Articles</h4>
              </div>
              <div className="col tour-step-15">
                <a target="_blank"
                  href="https://jarvisreach.io/getting-started/installing-the-jarvis-reach-browser-extension/66e576f30f6e8c4e5b710ae3"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <div className="help-articles">
                    <img
                      src="assets/images/home/platform.png"
                      width="100"
                      height="100"
                    />
                    <h4
                      style={{
                        fontSize: isSmallScreen && "14px",
                      }}
                    >
                      Extension on Linkedin - Your first contact
                    </h4>
                  </div>
                </a>
              </div>
              <div className="col tour-step-16">
                <a target="_blank"
                  href="https://jarvisreach.io/plan-and-pricing/understanding-how-credits-are-charged/66e57a310f6e8c4e5b710b7c"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <div className="help-articles">
                    <img
                      src="assets/images/home/solution.png"
                      width="100"
                      height="100"
                    />
                    <h4
                      style={{
                        fontSize: isSmallScreen && "14px",
                      }}
                    >
                      Understanding How Credits are Charged
                    </h4>
                  </div>
                </a>
              </div>
              <div className="col tour-step-17">
                <a target="_blank"
                  href="https://jarvisreach.io/bulk-enrichment/bulk-enrichment-on-linkedin/66e589140f6e8c4e5b710ccb"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <div className="help-articles">
                    <img
                      src="assets/images/home/data.png"
                      width="100"
                      height="100"
                    />
                    <h4
                      style={{
                        fontSize: isSmallScreen && "14px",
                      }}
                    >
                      Bulk Enrichment over Linkedin - How to use it
                    </h4>
                  </div>
                </a>
              </div>
              {/* <div className="col tour-step-18">
                <a
                  href={`${
                    import.meta.env.VITE_JARVIS_MARKETING_HELP
                  }/help-center`}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <div className="help-articles">
                    <img
                      src="assets/images/home/email-marketing.png"
                      width="100"
                      height="100"
                    />
                    <h4>Automations - Auto Enrichment on Linkedin</h4>
                  </div>
                </a>
              </div> */}
            </div>
            <div className="row pt-3 ">
              <div className="col-md-4 mb-4">
                <a target="_blank"
                  href="https://jarvisreach.io/contact-management/optimizing-lead-generation-projects:-efficient-strategies-for-organizational-excellence/66e57d440f6e8c4e5b710bed"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <div className="help-articles tour-step-19">
                    <img
                      src="assets/images/home/search-engine.png"
                      width="100"
                      height="100"
                    />
                    <h4
                      style={{
                        fontSize: isSmallScreen && "14px",
                      }}
                    >
                      Optimizing Lead Generation Projects
                    </h4>
                  </div>
                </a>
              </div>
            </div>
            {/* <!-- end row --> */}

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
              : { left: "250px", transition: "all 0.3s ease", zIndex: "999" }
          }
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                2024 © All Rights Reserved By Jarvis Reach
              </div>
              <div className="col-md-6">
                <div className="text-md-end footer-links d-none d-sm-block">
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
          </div>
        </footer>

        {/* <!-- end Footer --> */}
      </div>
    </div>
  );
};

export default Home;

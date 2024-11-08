import React from "react";

const Integration = () => {
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
                    <li className="breadcrumb-item active">Integrations</li>
                  </ol>
                </div>
                <h4 className="page-title">Integrations</h4>
              </div>
            </div>
          </div>
          {/* <!-- end page title -->  */}

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="user-main-sectiom">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="integare-file">
                          <h3>Integrations</h3>
                        </div>
                        <div className="integare-file-main">
                          <div className="integare-file-main-left">
                            <form>
                              <input
                                type="search"
                                className="form-control search-main-bar"
                                placeholder="Search..."
                                id="top-search"
                              />
                            </form>
                          </div>
                          <div className="integare-file-main-right">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexSwitchCheckDefault"
                              >
                                Installed integrations
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row pt-3">
                      <div className="col-lg-3">
                        <a href="">
                          <div className="integaration-brand">
                            <img src="assets/images/users/Zapier.png" />
                            <a href="">Zapier</a>
                          </div>
                        </a>
                      </div>
                      <div className="col-lg-3">
                        <a href="">
                          <div className="integaration-brand">
                            <img src="assets/images/users/HubSpot.png" />
                            <a href="">Hubspot CRM</a>
                          </div>
                        </a>
                      </div>
                      <div className="col-lg-3">
                        <a href="">
                          <div className="integaration-brand">
                            <img src="assets/images/users/mailchimp.png" />
                            <a href="">Mailchimp</a>
                          </div>
                        </a>
                      </div>
                      <div className="col-lg-3">
                        <a href="">
                          <div className="integaration-brand">
                            <img src="assets/images/users/zoho-crm.png" />
                            <a href="">Zoho CRM</a>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="row pt-3">
                      <div className="col-lg-3">
                        <a href="">
                          <div className="integaration-brand">
                            <img src="assets/images/users/gmail.png" />
                            <a href="">Gmail</a>
                          </div>
                        </a>
                      </div>
                      <div className="col-lg-3">
                        <a href="">
                          <div className="integaration-brand">
                            <img src="assets/images/users/salesforce.png" />
                            <a href="">Salesforce</a>
                          </div>
                        </a>
                      </div>
                      <div className="col-lg-3">
                        <a href="">
                          <div className="integaration-brand">
                            <img src="assets/images/users/Pipedrive.png" />
                            <a href="">Pipedrive</a>
                          </div>
                        </a>
                      </div>
                      <div className="col-lg-3">
                        <a href="">
                          <div className="integaration-brand">
                            <img src="assets/images/users/Salesloft.png" />
                            <a href="">Salesloft</a>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- end row --> */}
        </div>
        {/* <!-- container --> */}
      </div>
      {/* /<!-- content --> */}

      {/* <!-- Footer Start --> */}
      <footer className="footer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <script>document.write(new Date().getFullYear())</script> &copy;
              Javirs Reach by <a href="">Jarvis Reach</a>
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

export default Integration;

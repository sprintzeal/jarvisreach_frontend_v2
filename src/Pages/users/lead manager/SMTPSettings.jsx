import React, { useEffect, useState } from "react";
import {
  useDeleteSmtpSettingsMutation,
  useGetSmptSettingsQuery,
  useSmtpSettingsMutation,
} from "../../../slices/customerSlice";
import toast from "react-hot-toast";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const SMTPSettings = ({ collapsed }) => {
  const [postSmtp, { isLoading: postSmtpLoading }] = useSmtpSettingsMutation();
  const [protocol, setProtocol] = useState("");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [smtpUsername, setSmtpUsername] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [fromMail, setFromMail] = useState("");
  const [fromName, setFromName] = useState("");
  const [status, setStatus] = useState("");
  const [deleteSmpt] = useDeleteSmtpSettingsMutation();
  const [isDeactivatedByAdmin, setIsDeactivatedByAdmin] = useState(false);
  const {
    data: smtpData,
    error: smtpError,
    isLoading: smtpIsLoading,
  } = useGetSmptSettingsQuery();

  useEffect(() => {
    if (smtpData) {
      setProtocol(smtpData.protocol);
      setSmtpHost(smtpData.host);
      setSmtpPort(smtpData.port);
      setSmtpUsername(smtpData.smtpUsername);
      setSmtpPassword(smtpData.smtpPassword);
      setFromMail(smtpData.fromMail);
      setFromName(smtpData.fromName);
      setStatus(smtpData.status);
      setIsDeactivatedByAdmin(smtpData.isDeactivatedByAdmin);
    }
  }, [smtpData, smtpIsLoading]);
  const [loading, setLoading] = useState(false);
  const handlePostSmtp = async () => {
    setLoading(true);
    if (
      !protocol ||
      !smtpHost ||
      !smtpPort ||
      !smtpUsername ||
      !smtpPassword ||
      !fromMail ||
      !fromName ||
      !status
    ) {
      // scroll to top error field is empty
      const errorField = document.querySelector(".is-invalid");
      errorField.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });

      return;
    }
    try {
      await postSmtp({
        body: {
          protocol: protocol,
          host: smtpHost,
          port: smtpPort,
          smtpUsername,
          smtpPassword,
          fromMail,
          fromName,
          status,
        },
      }).unwrap();
      toast.success("SMTP settings added successfully");

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error(err.data.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSmpt().unwrap();
      toast.success("SMTP settings Deleted successfully");
      setProtocol("");
      setSmtpHost("");
      setSmtpPort("");
      setSmtpUsername("");
      setSmtpPassword("");
      setFromMail("");
      setFromName("");
      setStatus("");
    } catch (err) {
      console.error(err);
      toast.error(err.data.message);
    }
  };
  return (
    <div>
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
                        <a href="javascript: void(0);">Jarvisreach</a>
                      </li>
                      <li className="breadcrumb-item">
                        <a href="javascript: void(0);">SMTP</a>
                      </li>
                      <li className="breadcrumb-item active">
                        Add / Edit SMTP
                      </li>
                    </ol>
                  </div>
                  <h4 className="page-title">Add / Edit SMTP</h4>
                </div>
              </div>
            </div>
            {/* <!-- end page title -->  */}

            <div className="row">
              <div className="col-lg-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="text-uppercase bg-light p-2 mt-0 mb-3">
                      SMTP Mailer Configuration
                    </h5>

                    <div className="mb-3">
                      <label for="product-name" className="form-label">
                        Protocol <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="product-name"
                        className={`form-control ${
                          loading && !protocol ? "is-invalid" : ""
                        }`}
                        placeholder="e.g : smtp"
                        value={protocol}
                        onChange={(e) => setProtocol(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label for="product-name" className="form-label">
                        SMTP Host <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="product-name"
                        className={`form-control ${
                          loading && !smtpHost ? "is-invalid" : ""
                        }`}
                        placeholder="e.g : smtp.gmail.com"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label for="product-reference" className="form-label">
                        SMTP Port <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="product-reference"
                        className={`form-control ${
                          loading && !smtpPort ? "is-invalid" : ""
                        }`}
                        placeholder="e.g : 587,25,465 etc"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label for="product-price" className="form-label">
                        Smtp username <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          loading && !smtpUsername ? "is-invalid" : ""
                        }`}
                        id="product-price"
                        placeholder="username@gmail.com"
                        value={smtpUsername}
                        onChange={(e) => setSmtpUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label for="product-price" className="form-label">
                        Smtp password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          loading && !smtpPassword ? "is-invalid" : ""
                        }`}
                        id="product-price"
                        placeholder="*******"
                        value={smtpPassword}
                        onChange={(e) => setSmtpPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label for="product-price" className="form-label">
                        From Mail <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          loading && !fromMail ? "is-invalid" : ""
                        }`}
                        id="product-price"
                        placeholder="abc@gmail.com"
                        value={fromMail}
                        onChange={(e) => setFromMail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label for="product-price" className="form-label">
                        From Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          loading && !fromName ? "is-invalid" : ""
                        }`}
                        id="product-price"
                        placeholder="ABC"
                        value={fromName}
                        onChange={(e) => setFromName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label for="product-price" className="form-label">
                        Status <span className="text-danger">*</span>
                      </label>
                      <br />
                      {isDeactivatedByAdmin && (
                        <p style={{ fontSize: "12px", color: "red" }}>
                          This SMTP settings is deactivated by admin. Please
                          contact support to activate.
                        </p>
                      )}
                      <br />
                      <div className="d-flex flex-wrap">
                        <div className="form-check me-2">
                          <input
                            className={`form-check-input ${
                              loading && !status ? "is-invalid" : ""
                            }`}
                            type="radio"
                            name="radioInline"
                            value="Active"
                            id="inlineRadio1"
                            checked={status === "Active"}
                            onChange={(e) => setStatus(e.target.value)}
                            required={true}
                            disabled={isDeactivatedByAdmin}
                          />
                          <label
                            className="form-check-label"
                            for="inlineRadio1"
                          >
                            Active
                          </label>
                        </div>
                        <div className="form-check me-2">
                          <input
                            className={`form-check-input ${
                              loading && !status ? "is-invalid" : ""
                            }`}
                            type="radio"
                            name="radioInline"
                            value="Deactive"
                            id="inlineRadio2"
                            checked={status === "Deactive"}
                            disabled={isDeactivatedByAdmin}
                            onChange={(e) => setStatus(e.target.value)}
                          />
                          <label
                            className="form-check-label"
                            for="inlineRadio2"
                          >
                            Deactive
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <div className="text-center mb-3 d-flex gap-2 justify-content-center">
                          <button
                            type="button"
                            className="btn w-sm btn-light waves-effect"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn w-sm btn-success waves-effect waves-light"
                            onClick={handlePostSmtp}
                            disabled={postSmtpLoading}
                          >
                            {postSmtpLoading ? "Saving" : "Save"}
                          </button>
                          <button
                            type="button"
                            className="btn w-sm btn-danger waves-effect waves-light"
                            onClick={handleDelete}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {/* <!-- end col --> */}
                    </div>
                  </div>
                </div>
                {/* <!-- end card --> */}
              </div>
              {/* <!-- end col --> */}
            </div>
            {/* <!-- end row --> */}

            {/* <!-- file preview template --> */}
            <div className="d-none" id="uploadPreviewTemplate">
              <div className="card mt-1 mb-0 shadow-none border">
                <div className="p-2">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <img
                        data-dz-thumbnail
                        src="#"
                        className="avatar-sm rounded bg-light"
                        alt=""
                      />
                    </div>
                    <div className="col ps-0">
                      <a
                        href="javascript:void(0);"
                        className="text-muted fw-bold"
                        data-dz-name
                      ></a>
                      <p className="mb-0" data-dz-size></p>
                    </div>
                    <div className="col-auto">
                      {/* <!-- Button --> */}
                      <a
                        href=""
                        className="btn btn-link btn-lg text-muted"
                        data-dz-remove
                      >
                        <i className="dripicons-cross"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                <script>document.write(new Date().getFullYear())</script> &copy;
                Javirs Reach by <a href="">Sprint</a>
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
    </div>
  );
};

export default SMTPSettings;

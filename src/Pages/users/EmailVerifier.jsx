import React, { useState } from "react";
import PaymentForm from "../../services/PaymentForm";
import { useEmailVerificationMutation } from "../../slices/customerSlice";
import toast from "react-hot-toast";
import {
  CircularProgress,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";
import { Check, Folder } from "@mui/icons-material";
import { Box } from "@mui/system";
import { FiX } from "react-icons/fi";

const EmailVerifier = ({ collapsed }) => {
  const [verifyEmail, { isLoading: verifyLoading, isSuccess: verifySuccess }] =
    useEmailVerificationMutation();
  const [verifyResponse, setVerifyResponse] = useState();
  const [email, setEmail] = useState("");
  const [displayEmail, setDisplayEmail] = useState([]);
  console.log("displayEmail", displayEmail);
  const handleSubmit = async (e) => {
    setVerifyResponse(null);
    e.preventDefault();
    const email = e.target[0].value;

    try {
      await verifyEmail({
        body: {
          email: email,
        },
      })
        .unwrap()
        .then((res) => {
          console.log("res", res);
          setVerifyResponse(res);
          setDisplayEmail((prev) => [{ email: email, response: res }, ...prev]);

          res?.result?.valid === true
            ? toast.success("Email verified")
            : toast.error("Email not verified");
        });
    } catch (error) {
      toast.error("Email verification failed");
    }
  };

  // console.log("verifyResponse", verifyResponse);

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
                    <li className="breadcrumb-item active">Email-Verifier</li>
                  </ol>
                </div>
                <h4 className="page-title">Email-Verifier</h4>
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
                          <h3>Email-Verifier</h3>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-xl-12">
                        <div className="email-verifier">
                          <p
                            className="text-muted"
                            style={{ fontSize: "14px" }}
                          >
                            Boost conversions by verifying email addresses
                            quickly and efficiently, ensuring your messages
                            reach real customers, not dead ends.
                          </p>
                          <form
                            className="row g-3 pt-3"
                            onSubmit={handleSubmit}
                          >
                            <div className="col-xl-6 col-md-3">
                              <label
                                for="inputPassword2"
                                className="visually-hidden"
                              >
                                Enter email adress
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                id="inputPassword2"
                                placeholder="Enter email adress"
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </div>
                            <div className="col-xl-2 col-md-3">
                              <button
                                type="submit"
                                className="btn btn-dark waves-effect waves-light"
                                disabled={
                                  verifyLoading || email.trim().length === 0
                                }
                              >
                                Verify
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                      {/* <!-- end col --> */}
                    </div>

                    {/* show table upon response of checks in fields table */}
                    <Table
                      className="table table-bordered"
                      style={{ marginTop: "20px" }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <b>Email</b>
                          </TableCell>
                          <TableCell>
                            <b>Valid</b>
                          </TableCell>

                          <TableCell>
                            <b>Comments</b>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      {displayEmail?.length > 0 &&
                        displayEmail.map((email) => (
                          <TableRow>
                            <TableCell>{email?.email}</TableCell>
                            <TableCell>
                              {email?.response?.result?.valid === true ? (
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Check style={{ color: "green" }} />
                                </Box>
                              ) : (
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <FiX size={30} style={{ color: "red" }} />
                                </Box>
                              )}
                            </TableCell>
                            <TableCell>
                              {email?.response?.result?.reason}
                            </TableCell>
                          </TableRow>
                        ))}
                      {!verifyResponse && verifyResponse?.result === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            style={{ textAlign: "center" }}
                          >
                            Verify email to see results
                          </TableCell>
                        </TableRow>
                      )}
                      {verifyLoading && (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            style={{ textAlign: "center" }}
                          >
                            <CircularProgress size={60} />
                          </TableCell>
                        </TableRow>
                      )}
                    </Table>

                    {/* <!-- end row --> */}
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- end row --> */}
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
                >
                  About Us
                </a>
                <a
                  href={`${
                    import.meta.env.VITE_JARVIS_MARKETING_HELP
                  }/help-center`}
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

export default EmailVerifier;

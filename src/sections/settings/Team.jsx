import React, { useState } from "react";
import { FaCaretRight, FaTrash } from "react-icons/fa6";
import {
  useDeleteTeamMemberMutation,
  useGetTeamQuery,
  useTeamInvitationMutation,
} from "../../slices/customerSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Popover,
  PopoverPaper,
  Radio,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

const Team = () => {
  const { auth } = useSelector((state) => state.auth);
  const initialValues = {
    email: "",
  };

  const [openPopover, setOpenPopover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClosePopover = () => {
    setOpenPopover(false);
  };
  const [selectedValue, setSelectedValue] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const { data: team, isLoading: teamLoading } = useGetTeamQuery();
  const [deleteTeamMember] = useDeleteTeamMemberMutation();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const [inviteTeam] = useTeamInvitationMutation();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await inviteTeam({ body: { inviteeEmail: values.email } }).unwrap();
      toast.success("Invitation sent successfully");
      resetForm();
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Error sending invitation");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async () => {
    try {
      await deleteTeamMember({ id: memberId }).unwrap();
      toast.success("Member deleted successfully");
      setOpenDialog(false);
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Error deleting member");
    }
  };
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
                    <li className="breadcrumb-item active">Team</li>
                  </ol>
                </div>
                <h4 className="page-title">Team</h4>
              </div>
            </div>
          </div>
          {/* <!-- end page title -->  */}

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="user-main-sectiom">
                  <div className="row">
                    {auth?.result?.role === "customer" && (
                      <div className="col-lg-5">
                        <div className="build-team">
                          <h3>Build a team on Jarvis Reach!</h3>
                          <p>With a team on Jarvis Reach, you can:</p>
                          <ul>
                            <li
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <FaCaretRight
                                style={{
                                  fontSize: "14px",
                                }}
                              />{" "}
                              Build shared lists of Linkedin contacts
                            </li>
                            <li
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <FaCaretRight
                                style={{
                                  fontSize: "14px",
                                }}
                              />
                              Share the subscription credits with your team
                            </li>
                          </ul>
                          <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                          >
                            {({ isSubmitting }) => (
                              <Form>
                                <div className="mb-3">
                                  <label htmlFor="email" className="form-label">
                                    *Email
                                  </label>
                                  <Field
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    id="email"
                                    aria-describedby="emailHelp"
                                    placeholder="Enter email"
                                  />
                                  <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                                <button
                                  type="submit"
                                  className="btn btn-dark waves-effect waves-light"
                                  disabled={isSubmitting}
                                >
                                  Send an invitation
                                </button>
                                <p>
                                  <span>
                                    The person that invites becomes the admin
                                    and manages the subscription for the team.
                                  </span>
                                </p>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </div>
                    )}
                    <div
                      className="col-lg-7"
                      style={{
                        width: auth?.result?.role === "customer" ? "" : "100%",
                      }}
                    >
                      <div className="team-tabls">
                        <div className="table-responsive" bis_skin_checked="1">
                          <table className="table mb-0">
                            <thead className="table-light">
                              <tr>
                                <th>Account</th>
                                <th>Status</th>
                                <th>This Month Transactions </th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {team &&
                                team?.result?.length > 0 &&
                                team?.result?.map((member) => (
                                  <tr>
                                    <td>
                                      <h5>
                                        {member?.firstName} {member?.lastName}
                                      </h5>
                                      <p>{member?.email}</p>
                                    </td>
                                    <td>
                                      {member?.role === "customer"
                                        ? "Team Admin"
                                        : "Team Member"}
                                    </td>
                                    <td>0</td>
                                    {member?.role === "teammember" ? (
                                      auth?.result?.role === "customer" && (
                                        <td>
                                          {/* <Tooltip
                                            title="Edit account role"
                                            arrow
                                          >
                                            <span
                                              className="badge text-black"
                                              style={{
                                                backgroundColor: "#e3e7fc",
                                                padding: "3px 3px",
                                                marginRight: "5px",
                                              }}
                                              onClick={(e) => {
                                                setOpenPopover(true);
                                                setAnchorEl(e.currentTarget);
                                              }}
                                            >
                                              <FaRegEdit
                                                style={{
                                                  cursor: "pointer",
                                                }}
                                              />
                                            </span>
                                          </Tooltip> */}
                                          <Tooltip
                                            title="Delete from your team"
                                            arrow
                                          >
                                            <span
                                              className="badge text-black"
                                              style={{
                                                backgroundColor: "#fed5df",
                                                padding: "3px 3px",
                                              }}
                                              onClick={() => {
                                                handleClickOpen();
                                                setMemberId(member?._id);
                                              }}
                                            >
                                              <FaTrashAlt
                                                style={{
                                                  cursor: "pointer",
                                                }}
                                              />
                                            </span>
                                          </Tooltip>
                                        </td>
                                      )
                                    ) : (
                                      <td></td>
                                    )}
                                  </tr>
                                ))}
                              {team?.result?.length === 0 && (
                                <tr>
                                  <td
                                    colSpan="4"
                                    style={{ textAlign: "center" }}
                                  >
                                    No team member found
                                  </td>
                                </tr>
                              )}
                              {teamLoading && (
                                <tr>
                                  <td
                                    colSpan="4"
                                    style={{ textAlign: "center" }}
                                  >
                                    <CircularProgress />
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
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
      {/* <!-- content --> */}

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

      {/* dialog of Delete member */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Member?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            sx={{
              color: "#ff0000",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onClick={handleDeleteMember}
            color="primary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        arrow
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{ p: 2, color: "#414c58", fontWeight: 400, fontSize: "16px" }}
          >
            Choose account role
          </Typography>
          <FormControl fullWidth variant="outlined" sx={{ marginInline: 2 }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Radio
                    checked={selectedValue === "a"}
                    onChange={handleChange}
                    value="a"
                    name="radio-button-demo"
                    inputProps={{ "aria-label": "A" }}
                    sx={{
                      color: "#414c58",
                      fontWeight: 400,
                      fontSize: "16px",
                    }}
                  />
                }
                label="Team Admin"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={selectedValue === "b"}
                    onChange={handleChange}
                    value="b"
                    name="radio-button-demo"
                    inputProps={{ "aria-label": "B" }}
                  />
                }
                label="Team Member"
                sx={{
                  color: "#414c58",
                  fontWeight: 400,
                  fontSize: "16px",
                }}
              />
            </FormGroup>
          </FormControl>
          <Box
            sx={{
              display: "flex",
              marginTop: 4,
            }}
          >
            <Button
              variant="text"
              sx={{
                marginInline: 2,
                marginBottom: 2,
                border: "1px solid #c4c4c4",
                fontSize: "12px",
                color: "#414c58",
                fontWeight: 400,
              }}
              onClick={handleClosePopover}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                marginInline: 2,
                marginBottom: 2,
                backgroundColor: "#6a69ff",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 400,
                "&:hover": {
                  backgroundColor: "#6a69ff",
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Popover>
    </div>
  );
};

export default Team;

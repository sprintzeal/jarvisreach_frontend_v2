import React, { useState } from "react";
import {
  useDeleteSequenceListMutation,
  useGetAllSequencesQuery,
  useGetSequenceListQuery,
} from "../../../slices/customerSlice";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Popover,
} from "@mui/material";
import toast from "react-hot-toast";
import { Box } from "@mui/system";

const SequenceList = ({ collapsed }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [optionId, setOptionId] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteSequence, setOpenDeleteSequence] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteSequenceId, setDeleteSequenceId] = useState(null);
  // console.log("deleteSequenceId", deleteSequenceId);
  const [deletedSequences, { isLoading: deleteSequenceLoading }] =
    useDeleteSequenceListMutation();

  const {
    data: getAllSequences,
    isLoading: getAllSequencesLoading,
    isError: getAllSequencesError,
  } = useGetAllSequencesQuery({
    search: search,
  });
  const {
    data: getSequenceList,
    isLoading: getSequenceListLoading,
    isError: getSequenceListError,
  } = useGetSequenceListQuery();
  // console.log(getAllSequences);

  const handleDeleteSequence = async () => {
    try {
      await deletedSequences({
        body: {
          ids: selectedItems?.length > 0 ? selectedItems : [deleteSequenceId],
        },
      }).unwrap();
      toast.success("Sequence Deleted Successfully");
      setOpenDeleteSequence(false);
      setSelectedItems([]);
      setDeleteSequenceId(null);
    } catch (error) {
      toast.error(error.data.message);
    }
  };
  return (
    <div>
      <div className="content-page">
        <div
          className="content"
          style={{
            width: collapsed ? "93vw" : "79vw",
            transition: "0.5s ease",
          }}
        >
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
                        <a href="javascript: void(0);">sequence</a>
                      </li>
                      <li className="breadcrumb-item active">Sequence List</li>
                    </ol>
                  </div>
                  <h4 className="page-title">Sequence List</h4>
                </div>
              </div>
            </div>
            {/* <!-- end page title -->  */}

            {/* <!-- start page title --> */}
            <div className="row">
              {/* <div className="col-12">
                <div className="page-title-box">
                  <div className="page-title-right">
                    <form className="d-flex align-items-center mb-3">
                      <div className="input-group input-group-sm">
                        <input
                          type="text"
                          className="form-control border"
                          id="dash-daterange"
                        />
                        <span className="input-group-text bg-blue border-blue text-white">
                          <i className="mdi mdi-calendar-range"></i>
                        </span>
                      </div>
                      <a
                        href="javascript: void(0);"
                        className="btn btn-blue btn-sm ms-2"
                      >
                        <i className="mdi mdi-autorenew"></i>
                      </a>
                      <a
                        href="javascript: void(0);"
                        className="btn btn-blue btn-sm ms-1"
                      >
                        <i className="mdi mdi-filter-variant"></i>
                      </a>
                    </form>
                  </div>
                </div>
              </div> */}
            </div>
            {/* <!-- end page title -->   */}
            {/* <style>
		.avatar-lg {
    height: 3rem;
    width: 3rem;
}
	</style> */}
            <div className="row">
              <div className="col-md-6 col-xl-3">
                <div className="widget-rounded-circle card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-2">
                        <div
                          className="avatar-md rounded-circle"
                          style={{
                            backgroundColor: "rgb(102 88 221)",
                            color: "white",
                          }}
                        >
                          <i className="fe-tag font-22 avatar-title text-white"></i>
                        </div>
                      </div>
                      <div className="col-10">
                        <div className="text-end">
                          <h3 className="text-dark mt-1">
                            <span data-plugin="counterup">
                              {getSequenceList?.result?.emailsSent
                                ? getSequenceList?.result?.emailsSent
                                : 0}
                            </span>
                          </h3>
                          <p
                            className="text-muted mb-1 text-truncate"
                            style={{
                              fontSize: "16px",
                            }}
                          >
                            Email Sent
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* !-- end row--> */}
                  </div>
                </div>
                {/* <!-- end widget-rounded-circle--> */}
              </div>
              {/* <!-- end col--> */}

              <div className="col-md-6 col-xl-3">
                <div className="widget-rounded-circle card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-2">
                        <div
                          className="avatar-md rounded-circle"
                          style={{
                            backgroundColor: "rgb(26 188 156)",
                            color: "white",
                          }}
                        >
                          <i className="fe-check-circle font-22 avatar-title text-white"></i>
                        </div>
                      </div>
                      <div className="col-10">
                        <div className="text-end">
                          <h3 className="text-dark mt-1">
                            <span data-plugin="counterup">
                              {" "}
                              {getSequenceList?.result?.emailsSentInSequence
                                ? getSequenceList?.result?.emailsSentInSequence
                                : 0}
                            </span>
                          </h3>
                          <p
                            className="text-muted mb-1 text-truncate"
                            style={{
                              fontSize: "16px",
                            }}
                          >
                            Sequence
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* <!-- end row--> */}
                  </div>
                </div>
                {/* <!-- end widget-rounded-circle--> */}
              </div>
              {/* <!-- end col--> */}

              <div className="col-md-6 col-xl-3">
                <div className="widget-rounded-circle card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-2">
                        <div
                          className="avatar-md rounded-circle "
                          style={{
                            backgroundColor: "rgb(247 184 75)",
                            color: "white",
                          }}
                        >
                          <i className="fe-clock font-22 avatar-title text-white"></i>
                        </div>
                      </div>
                      <div className="col-10">
                        <div className="text-end">
                          <h3 className="text-dark mt-1">
                            <span data-plugin="counterup">
                              {getSequenceList?.result?.nextSequenceEmails
                                ? getSequenceList?.result?.nextSequenceEmails
                                : 0}
                            </span>
                          </h3>
                          <p
                            className="text-muted mb-1 text-truncate"
                            style={{
                              fontSize: "16px",
                            }}
                          >
                            Next Sequence
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* <!-- end row--> */}
                  </div>
                </div>
                {/* <!-- end widget-rounded-circle--> */}
              </div>
              {/* <!-- end col--> */}

              <div className="col-md-6 col-xl-3">
                <div className="widget-rounded-circle card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-2">
                        <div
                          className="avatar-md rounded-circle "
                          style={{
                            backgroundColor: "rgb(241 85 108)",
                            color: "white",
                          }}
                        >
                          <i className="fe-trash-2 font-22 avatar-title text-white"></i>
                        </div>
                      </div>
                      <div className="col-10">
                        <div className="text-end">
                          <h3 className="text-dark mt-1">
                            <span data-plugin="counterup">
                              {getSequenceList?.result?.deletedSequences
                                ? getSequenceList?.result?.deletedSequences
                                : 0}
                            </span>
                          </h3>
                          <p
                            className="text-muted mb-1 text-truncate"
                            style={{
                              fontSize: "16px",
                            }}
                          >
                            Deleted Sequence
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* <!-- end row--> */}
                  </div>
                </div>
                {/* <!-- end widget-rounded-circle--> */}
              </div>
              {/* <!-- end col--> */}
            </div>
            {/* <!-- end row --> */}

            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <h4 className="header-title">Manage Sequence</h4>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search Name"
                        style={{
                          width: "20%",
                          marginBottom: "20px",
                        }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </Box>

                    {selectedItems.length > 0 && (
                      <button
                        id="demo-delete-row"
                        className="btn btn-danger btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#warning-delete-modal"
                        onClick={() => {
                          setOpenDeleteSequence(true);
                        }}
                        style={{
                          margin: "10px 0 20px 0",
                        }}
                      >
                        <i className="mdi mdi-close me-1"></i>Delete
                      </button>
                    )}
                    <div className="table-responsive">
                      <table className="table table-centered table-nowrap mb-0">
                        <thead className="table-light">
                          <tr>
                            <th style={{ width: "20px" }}>
                              <div
                                className="form-check"
                                style={{
                                  marginLeft: "8px",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="customCheck1"
                                  value={selectedItems.length}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedItems(
                                        getAllSequences?.result?.map(
                                          (sequence) => sequence._id
                                        )
                                      );
                                    } else {
                                      setSelectedItems([]);
                                    }
                                  }}
                                  checked={
                                    selectedItems.length > 0
                                    // ===
                                    // getAllSequences?.result?.length
                                  }
                                />
                              </div>
                            </th>{" "}
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Template Name</th>
                            <th>Next Mail Date</th>
                            <th>Mail Status</th>
                            <th>Created Date</th>
                            <th className="hidden-sm">Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {getAllSequences?.result?.length > 0 &&
                            getAllSequences?.result?.map((sequence) => (
                              <tr>
                                <td>
                                  <div className="form-check">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="customCheck2"
                                      value={sequence._id}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedItems([
                                            ...selectedItems,
                                            sequence._id,
                                          ]);
                                        } else {
                                          setSelectedItems(
                                            selectedItems.filter(
                                              (item) => item !== sequence._id
                                            )
                                          );
                                        }
                                      }}
                                      checked={selectedItems.includes(
                                        sequence._id
                                      )}
                                    />
                                  </div>
                                </td>
                                <td>{sequence?.leadName}</td>
                                <td>{sequence.email}</td>
                                <td>{sequence.subject}</td>
                                <td>
                                  <span
                                    className="badge"
                                    style={{
                                      backgroundColor: "rgb(102 88 221)",
                                      color: "white",
                                    }}
                                  >
                                    {sequence.sequenceTemplate?.name}
                                  </span>
                                </td>
                                <td>
                                  {new Date(sequence.nextMailDate).toDateString(
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}
                                </td>
                                <td>
                                  <span
                                    className="badge"
                                    style={{
                                      backgroundColor:
                                        sequence.mailStatus === "Pending"
                                          ? "#f7b84b"
                                          : sequence.mailStatus === "Send"
                                          ? "#34c38f"
                                          : "#f1536e",
                                      color:
                                        sequence.mailStatus === "Pending"
                                          ? "white"
                                          : sequence.mailStatus === "Send"
                                          ? "white"
                                          : "black",
                                    }}
                                  >
                                    {sequence.mailStatus}
                                  </span>
                                </td>
                                <td>
                                  {new Date(sequence.CreatedAt).toDateString({
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </td>
                                <td>
                                  <div
                                    className="btn-group dropdown"
                                    style={{
                                      position: "static",
                                    }}
                                  >
                                    <a
                                      className="table-action-btn dropdown-toggle arrow-none btn btn-light btn-sm"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                      onClick={(e) => {
                                        setOptionId(true);
                                        setAnchorEl(e.currentTarget);
                                        setDeleteSequenceId(sequence._id);
                                      }}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                    >
                                      <i className="mdi mdi-dots-horizontal"></i>
                                    </a>
                                    <Popover
                                      id="simple-popover"
                                      anchorOrigin={{
                                        vertical: "right",
                                        horizontal: "left",
                                      }}
                                      transformOrigin={{
                                        vertical: "right",
                                        horizontal: "right",
                                      }}
                                      anchorEl={anchorEl}
                                      open={optionId}
                                      onClose={() => setOptionId(false)}
                                    >
                                      <div
                                        style={{
                                          padding: "10px",
                                          fontSize: "14px",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {/* <a className="dropdown-item" href="#">
                                          <i className="mdi mdi-pencil me-2 text-muted font-18 vertical-middle"></i>
                                          Edit
                                        </a> */}
                                        <a
                                          className="dropdown-item"
                                          onClick={() => {
                                            setOpenDeleteSequence(true);
                                          }}
                                          style={{
                                            cursor: "pointer",
                                          }}
                                        >
                                          <i className="mdi mdi-check-all me-2 text-muted font-18 vertical-middle"></i>
                                          Remove
                                        </a>
                                      </div>
                                    </Popover>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          {getAllSequences?.result?.length === 0 && (
                            <tr>
                              <td colSpan="9" className="text-center">
                                No Data Found
                              </td>
                            </tr>
                          )}
                          {getAllSequencesLoading && (
                            <tr>
                              <td colSpan="9" className="text-center">
                                <CircularProgress />
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* <!-- end card--> */}
              </div>
              {/* <!-- end col--> */}

              {/* Delete Sequence List */}
              <Dialog
                open={openDeleteSequence}
                onClose={() => {
                  setOpenDeleteSequence(false);
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Delete Sequence"}
                </DialogTitle>
                <DialogContent>
                  <div>
                    <p
                      style={{
                        fontSize: "16px",
                        color: "gray",
                        fontWeight: "500",
                      }}
                    >
                      Are you sure you want to delete this Sequence?
                    </p>
                    <div className="text-end pl-4 mt-2">
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => handleDeleteSequence()}
                        disabled={deleteSequenceLoading}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => {
                          setOpenDeleteSequence(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Dialogue */}
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

export default SequenceList;

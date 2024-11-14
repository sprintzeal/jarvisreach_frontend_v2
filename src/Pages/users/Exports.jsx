import React, { useState } from "react";
import { FaRotateRight } from "react-icons/fa6";
import {
  useDownloadExportMutation,
  useGetExportDataQuery,
} from "../../slices/customerSlice";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import { daysAgo } from "../../utils/timeAgo";

const Exports = ({ collapsed }) => {
  const [limit, setLimit] = useState(5);
  const [pages, setPage] = useState(1);
  const {
    data: getExport,
    error: getExportError,
    isLoading: getExportIsLoading,
  } = useGetExportDataQuery({
    page: pages,
    limit: limit,
  });
  const [downloadExport] = useDownloadExportMutation();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const itemsPerPageOptions = [5, 10, 20, 50];
  const totalItems = getExport?.totalItems || 0;
  const [currentPage, setCurrentPage] = useState(getExport?.page || 3);
  const [itemsPerPage, setItemsPerPage] = useState(
    itemsPerPageOptions[
      itemsPerPageOptions.indexOf(getExport?.limit) !== -1
        ? itemsPerPageOptions.indexOf(getExport?.limit)
        : 0
    ]
  );

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    setPage(page);
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setPage(currentPage + 1);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page whenever items per page changes
    setLimit(Number(event.target.value));
  };

  const getVisiblePages = () => {
    const visiblePages = [];
    const pageRange = 5;
    let startPage = Math.max(currentPage - Math.floor(pageRange / 2), 1);
    let endPage = Math.min(startPage + pageRange - 1, totalPages);

    if (endPage - startPage < pageRange - 1) {
      startPage = Math.max(endPage - pageRange + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
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
                    <li className="breadcrumb-item active">Exports</li>
                  </ol>
                </div>
                <h4 className="page-title">Exports</h4>
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
                          <h3>Exports</h3>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-xl-12">
                        <div className="table-responsive">
                          <Table className="table mb-0">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <span className="refrese">
                                    <FaRotateRight
                                      style={{ fontSize: "20px" }}
                                    />
                                  </span>
                                  Started
                                </TableCell>
                                <TableCell>Contacts</TableCell>
                                <TableCell>Folder</TableCell>
                                <TableCell>Tags</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Download</TableCell>
                              </TableRow>
                            </TableHead>
                            {getExport?.result?.length > 0 &&
                              getExport?.result?.map((lead) => (
                                <TableBody>
                                  <TableRow>
                                    <TableCell>
                                      {daysAgo(lead?.createdAt)}
                                    </TableCell>
                                    <TableCell>
                                      {lead.leadsCount ? lead.leadsCount : 0}
                                    </TableCell>
                                    <TableCell>
                                      {lead.folderName
                                        ? lead.folderName
                                        : "N/A"}
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>
                                      {lead?.status ? lead?.status : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                      <button
                                        type="button"
                                        className="btn btn-dark"
                                        onClick={() =>
                                          window.open(lead?.resultFile)
                                        }
                                      >
                                        Download
                                      </button>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              ))}
                            {getExport?.result?.length === 0 && (
                              <TableBody>
                                <TableRow>
                                  <TableCell colSpan={6}>
                                    <div className="row">
									    <div className="col-lg-12">
									       
									        <div className="card">
									            <div className="card-body">
									                <div className="install-extention">
									                    <img src="https://d2ds8yldqp7gxv.cloudfront.net/install-extent.png" width="200" height="190" />
									                    <h4>You haven't exported any contact yet!</h4>
									                    <p>Your exported files will appear here for easy access anytime.</p>
									                </div> 
									            </div>
									        </div>
									    </div>
									
									
									
									</div>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            )}
                            {getExportIsLoading && (
                              <TableBody>
                                <TableRow>
                                  <TableCell
                                    colSpan={6}
                                    style={{ textAlign: "center" }}
                                  >
                                    <CircularProgress />
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            )}
                          </Table>
                        </div>

                        <nav>
                          <div
                            className="pagination-container"
                            style={{
                              maxWidth: "100%",
                              overflowX: "auto",
                              display: "flex",
                              // direction column in small screen
                              flexDirection: isSmallScreen ? "column" : "",
                            }}
                          >
                            <div className="pagination-controls">
                              <label
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "500",
                                }}
                              >
                                Items per page:
                                <select
                                  value={itemsPerPage}
                                  onChange={handleItemsPerPageChange}
                                  style={{
                                    // style for select
                                    padding: "5px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    marginLeft: "10px",
                                  }}
                                >
                                  {itemsPerPageOptions.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>
                            <ul className="pagination pagination-rounded mb-0 pt-4">
                              {/* first page */}
                              {getVisiblePages()?.length > 3 &&
                                currentPage > 3 && (
                                  <li
                                    className="page-item"
                                    onClick={() => handlePageClick(1)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <a className="page-link">1</a>
                                  </li>
                                )}
                              <li
                                className="page-item"
                                onClick={handlePrevClick}
                                style={{ cursor: "pointer" }}
                              >
                                <a className="page-link" aria-label="Previous">
                                  <span aria-hidden="true">«</span>
                                  <span className="visually-hidden">
                                    Previous
                                  </span>
                                </a>
                              </li>
                              {getVisiblePages().map((page) => (
                                <li
                                  key={page}
                                  className={`page-item ${
                                    page === (currentPage || pages)
                                      ? "active"
                                      : ""
                                  }`}
                                  onClick={() => handlePageClick(page)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <a className="page-link">{page}</a>
                                </li>
                              ))}
                              <li
                                className="page-item"
                                onClick={handleNextClick}
                              >
                                <a
                                  className="page-link"
                                  aria-label="Next"
                                  style={{ cursor: "pointer" }}
                                >
                                  <span aria-hidden="true">»</span>
                                  <span className="visually-hidden">Next</span>
                                </a>
                              </li>
                              {totalPages > 5 &&
                                currentPage < totalPages - 2 && (
                                  <li
                                    className="page-item"
                                    onClick={() => handlePageClick(totalPages)}
                                    style={{
                                      cursor: "pointer",
                                    }}
                                  >
                                    <a className="page-link">...{totalPages}</a>
                                  </li>
                                )}
                            </ul>
                          </div>{" "}
                        </nav>
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

export default Exports;

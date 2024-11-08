import React, { useEffect, useState } from "react";
import { FiAperture, FiBarChart2, FiCpu, FiShoppingCart } from "react-icons/fi";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import LineChart from "../../components/LineChart";
import WorldMapMarkers from "../../components/WorldMapMarkers";
import { useGetProductQuery } from "../../slices/customerSlice";
import {
  useGeoLocationQuery,
  useGetAllFreeUsersQuery,
  useGetPayoutsQuery,
  useGetPreferredPalnsQuery,
  useGetTopPlansQuery,
  useGetTotalPaidUsersQuery,
  useGetTotalSalesQuery,
  useGetUnsubsriptionsQuery,
} from "../../slices/adminSlice";
import DateRange from "../../components/DateRange";
import { Scrollbar } from "../../components/Scrollbar";
import { Skeleton } from "@mui/material";
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ collapsed }) => {
  const [dateRange, setDateRange] = useState([
    new Date("2024-09-01"),
    new Date(),
  ]);

  const { data, isLoading: totalSalesLoading } = useGetTotalSalesQuery({
    from: dateRange[0] ? dateRange[0] : null,
    to: dateRange[1] ? dateRange[1] : null,
  });

  const { data: getLocation, isLoading: locationLoading } =
    useGeoLocationQuery();

  const { data: getFreeUsers, isLoading: freeUsersLoading } =
    useGetAllFreeUsersQuery({
      from: dateRange[0] ? dateRange[0] : null,
      to: dateRange[1] ? dateRange[1] : null,
    });

  const { data: paidUsers, isLoading: paidUsersLoading } =
    useGetTotalPaidUsersQuery({
      from: dateRange[0] ? dateRange[0] : null,
      to: dateRange[1] ? dateRange[1] : null,
    });

  const { data: topPlans, isLoading: topPlansLoading } = useGetTopPlansQuery({
    from: dateRange[0],
    to: dateRange[1],
  });

  const { data: preferredPlans, isLoading: preferredPlansLoading } =
    useGetPreferredPalnsQuery({
      from: dateRange[0],
      to: dateRange[1],
    });

  const { data: getPayouts, isLoading: payoutsLoading } = useGetPayoutsQuery({
    from: dateRange[0] ? dateRange[0] : null,
    to: dateRange[1] ? dateRange[1] : null,
  });

  const { data: getUnsubsriptions, isLoading: unsubsriptionsLoading } =
    useGetUnsubsriptionsQuery({
      from: dateRange[0] ? dateRange[0] : null,
      to: dateRange[1] ? dateRange[1] : null,
    });

  const chartData = preferredPlans?.map((plan) => plan.sales) || [];
  const labels = preferredPlans?.map((plan) => plan.planName) || [];

  const dataas = {
    labels: labels || [],
    datasets: [
      {
        data: chartData,
        backgroundColor: ["#00acc1", "#4b88e4", "#e3eaef", "#fd7e14"],
        borderColor: ["#00acc1", "#4b88e4", "#e3eaef", "#fd7e14"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Pie Chart Example",
      },
    },
    maintainAspectRatio: false,
  };

  useEffect(() => {
    document.getElementById("app-style")?.href.includes("rtl.min.css") &&
      (document.getElementsByTagName("html")[0].dir = "rtl");
  }, []);

  return (
    <div>
      <div id="wrapper">
        <div className="content-page">
          <div className="content">
            {/* <!-- Start Content--> */}
            <div className="container-fluid">
              {/* <!-- start page title --> */}
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box">
                    <div className="page-title-right">
                      <form className="d-flex align-items-center mb-3">
                        <div className="input-group input-group-sm">
                          <DateRange
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                          />
                          <span
                            className="input-group-text "
                            style={{
                              backgroundColor: "rgb(62 106 173)",
                              borderColor: "rgb(62 106 173)",
                              color: "white",
                            }}
                          >
                            <i className="mdi mdi-calendar-range"></i>
                          </span>
                        </div>
                        {/* <a
                          href="javascript: void(0);"
                          className="btn  btn-sm ms-2"
                          style={{
                            backgroundColor: "rgb(62 106 173)",
                            borderColor: "rgb(62 106 173)",
                            color: "white",
                          }}
                        >
                          <i className="mdi mdi-autorenew"></i>
                        </a>
                        <a
                          href="javascript: void(0);"
                          className="btn  btn-sm ms-1"
                          style={{
                            backgroundColor: "rgb(62 106 173)",
                            borderColor: "rgb(62 106 173)",
                            color: "white",
                          }}
                        >
                          <i className="mdi mdi-filter-variant"></i>
                        </a> */}
                      </form>
                    </div>
                    <h4 className="page-title">Dashboard</h4>
                  </div>
                </div>
              </div>
              {/* <!-- end page title -->   */}

              <div className="row">
                <div className="col-md-6 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-4">
                          <div className="avatar-sm bg-blue rounded">
                            <FiAperture
                              className="avatar-title font-22 "
                              style={{
                                backgroundColor: "rgb(255 0 13)",
                                padding: "3px",
                                borderRadius: "10%",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-8">
                          <div className="text-end">
                            <h3 className="text-dark my-1">
                              {!freeUsersLoading ? (
                                getFreeUsers?.totalFreePlanUsers ? (
                                  getFreeUsers?.totalFreePlanUsers
                                ) : (
                                  0
                                )
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <Skeleton height={40} width={50} />
                                </div>
                              )}
                            </h3>

                            <p className="text-muted mb-1 text-truncate font-14 font-weight-medium">
                              {!freeUsersLoading ? (
                                "Total Free Users"
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <Skeleton height={20} width={100} />
                                </div>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        {/* <h6 className="text-uppercase">
                          Target <span className="float-end">60%</span>
                        </h6>
                        <div className="progress progress-sm m-0">
                          <div
                            className="progress-bar "
                            role="progressbar"
                            aria-valuenow="60"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{
                              width: "60%",
                              backgroundColor: "rgb(62 106 173)",
                            }}
                          >
                            <span className="visually-hidden">
                              60% Complete
                            </span>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  {/* <!-- end card--> */}
                </div>
                {/* <!-- end col --> */}

                <div className="col-md-6 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-4">
                          <div className="avatar-sm bg-success rounded">
                            <FiShoppingCart
                              className="fe-shopping-cart avatar-title font-22 "
                              style={{
                                backgroundColor: "rgba( 26, 188, 156, 1 )",
                                padding: "5px",
                                borderRadius: "10%",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-8">
                          <div className="text-end">
                            <h3 className="text-dark my-1">
                              <span data-plugin="counterup">
                                {!paidUsersLoading ? (
                                  paidUsers?.totalPaidPlanUsers ? (
                                    paidUsers?.totalPaidPlanUsers
                                  ) : (
                                    0
                                  )
                                ) : (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Skeleton height={40} width={50} />
                                  </div>
                                )}
                              </span>
                            </h3>
                            <p className="text-muted mb-1 text-truncate font-14 font-weight-medium">
                              {!paidUsersLoading ? (
                                "Total Paid Users"
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <Skeleton height={20} width={100} />
                                </div>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        {/* <h6 className="text-uppercase">
                          Target <span className="float-end">49%</span>
                        </h6>
                        <div className="progress progress-sm m-0">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            aria-valuenow="49"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{
                              width: "49%",
                              backgroundColor: "rgba( 26, 188,156,1)",
                            }}
                          >
                            <span className="visually-hidden">
                              49% Complete
                            </span>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  {/* <!-- end card--> */}
                </div>
                {/* <!-- end col --> */}

                <div className="col-md-6 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-4">
                          <div className="avatar-sm bg-warning rounded">
                            <div
                              class="avatar-sm"
                              style={{
                                backgroundColor: "rgba( 247, 184, 75, 1 )",
                                padding: "5px",
                                borderRadius: "10%",
                                color: "white",
                              }}
                            >
                              <i class="fe-bar-chart-2 avatar-title font-22 text-white"></i>
                            </div>
                          </div>
                        </div>
                        <div className="col-8">
                          <div className="text-end">
                            <h3 className="text-dark my-1">
                              <span data-plugin="counterup">
                                {!payoutsLoading ? (
                                  getPayouts?.totalPayouts ? (
                                    "$" + getPayouts?.totalPayouts
                                  ) : (
                                    0
                                  )
                                ) : (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Skeleton height={40} width={50} />
                                  </div>
                                )}
                              </span>
                            </h3>
                            <p
                              className="text-muted mb-1 text-truncate font-14 font-weight-medium
"
                            >
                              {!payoutsLoading ? (
                                "Total Payouts"
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <Skeleton height={20} width={100} />
                                </div>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        {/* <h6 className="text-uppercase">
                          Target <span className="float-end">18%</span>
                        </h6>
                        <div className="progress progress-sm m-0">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            aria-valuenow="18"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{
                              width: "18%",
                              backgroundColor: "rgba( 247, 184, 75, 1 )",
                            }}
                          >
                            <span className="visually-hidden">
                              18% Complete
                            </span>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  {/* <!-- end card--> */}
                </div>
                {/* <!-- end col --> */}

                <div className="col-md-6 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-4">
                          <div className="avatar-sm bg-info rounded">
                            <FiCpu
                              className="avatar-title"
                              style={{
                                backgroundColor: "rgb(67 191 229)",
                                padding: "5px",
                                borderRadius: "10%",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-8">
                          <div className="text-end">
                            <h3 className="text-dark my-1">
                              <span data-plugin="counterup">
                                {!unsubsriptionsLoading ? (
                                  getUnsubsriptions &&
                                  !Object.keys(
                                    getUnsubsriptions?.totalUnsubscriptions
                                  ).length ? (
                                    getUnsubsriptions?.totalUnsubscriptions
                                  ) : (
                                    0
                                  )
                                ) : (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Skeleton height={40} width={50} />
                                  </div>
                                )}
                              </span>
                            </h3>
                            <p
                              className="text-muted mb-1 text-truncate
                                font-14 font-weight-medium
                            "
                            >
                              {!unsubsriptionsLoading ? (
                                "Total Unsubscriptions"
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <Skeleton height={20} width={100} />
                                </div>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        {/* <h6 className="text-uppercase">
                          Target <span className="float-end">74%</span>
                        </h6>
                        <div className="progress progress-sm m-0">
                          <div
                            className="progress-bar "
                            role="progressbar"
                            aria-valuenow="74"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{
                              width: "74%",
                              backgroundColor: "rgb(67 191 229)",
                            }}
                          >
                            <span className="visually-hidden">
                              74% Complete
                            </span>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  {/* <!-- end card--> */}
                </div>
                {/* <!-- end col --> */}
              </div>
              {/* <!-- end row --> */}

              <div className="row">
                <div className="col-xl-6 col-md-12">
                  {/* <!-- Portlet card --> */}
                  <div className="card">
                    <div className="card-body">
                      {/* <div className="card-widgets">
                        <a href="javascript: void(0);" data-toggle="reload">
                          <i className="mdi mdi-refresh"></i>
                        </a>
                        <a
                          data-bs-toggle="collapse"
                          href="#cardCollpase1"
                          role="button"
                          aria-expanded="false"
                          aria-controls="cardCollpase1"
                        >
                          <i className="mdi mdi-minus"></i>
                        </a>
                        <a href="javascript: void(0);" data-toggle="remove">
                          <i className="mdi mdi-close"></i>
                        </a>
                      </div> */}
                      <h4 className="header-title mb-0">Sales Reports</h4>

                      <div id="cardCollpase1" className="collapse show">
                        <div className="text-center pt-3">
                          <div
                            id="lifetime-sales"
                            data-colors="#00acc1,#f1556c"
                            style={{
                              height: "440px",
                              margin: "0 auto",
                              maxHeight: "440px",
                              maxWidth: "100%",
                            }}
                          >
                            {!totalSalesLoading ? (
                              data?.result?.graphData?.length > 0 ? (
                                <LineChart
                                  graphData={data}
                                  totalSalesLoading={totalSalesLoading}
                                />
                              ) : (
                                <h4>No Data Found</h4>
                              )
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: "100%",
                                }}
                              >
                                <div
                                  className="spinner-border text-primary"
                                  role="status"
                                >
                                  <span className="visually-hidden">.</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* <!-- collapsed end --> */}
                    </div>
                    {/* <!-- end card-body --> */}
                  </div>
                  {/* <!-- end card--> */}
                </div>
                {/* <!-- end col--> */}
                {/* <!-- end col--> */}

                <div className="col-xl-6 col-md-12">
                  <div className="card">
                    <div className="card-body">
                      {/* <div className="card-widgets">
                        <a href="javascript: void(0);" data-toggle="reload">
                          <i className="mdi mdi-refresh"></i>
                        </a>
                        <a
                          data-bs-toggle="collapse"
                          href="#cardCollpase3"
                          role="button"
                          aria-expanded="false"
                          aria-controls="cardCollpase3"
                        >
                          <i className="mdi mdi-minus"></i>
                        </a>
                        <a href="javascript: void(0);" data-toggle="remove">
                          <i className="mdi mdi-close"></i>
                        </a>
                      </div> */}
                      <h4 className="header-title mb-0">Most Preffered Plan</h4>

                      <div id="cardCollpase3" className="collapse show">
                        <div
                          className="text-center pt-3"
                          style={{
                            height: "460px",
                            maxHeight: "460px",
                            maxWidth: "100%",
                          }}
                        >
                          {" "}
                          {!preferredPlansLoading ? (
                            preferredPlans?.length > 0 ? (
                              <>
                                <div
                                  id="total-users"
                                  data-colors="#00acc1,#4b88e4,#e3eaef,#fd7e14"
                                >
                                  <Pie
                                    data={dataas}
                                    options={options}
                                    style={{
                                      height: "300px",
                                      width: "100%",
                                    }}
                                  />
                                </div>
                                <Scrollbar
                                  style={{
                                    overflowX: "hidden",
                                    overflowY: "auto",
                                    maxHeight: "150px",
                                  }}
                                >
                                  <div className="row mt-3">
                                    {preferredPlans?.map((plan) => (
                                      <div
                                        className="col-3 mb-2"
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                        }}
                                      >
                                        <div
                                          title={
                                            plan?.planName + " " + plan.interval
                                          }
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <p className="text-muted font-15 mb-1 text-truncate">
                                            {plan?.planName}
                                          </p>
                                          <p className="text-muted font-15 mb-1">
                                            {" "}
                                            &nbsp;{" "}
                                            {plan.interval === "month"
                                              ? " (M)"
                                              : " (Y)"}
                                          </p>
                                        </div>
                                        <h4>
                                          <i
                                            className={`${
                                              plan?.sales > 0
                                                ? "fe-arrow-up"
                                                : "fe-arrow-down"
                                            }  me-1`}
                                            style={{
                                              color:
                                                plan?.sales > 0
                                                  ? "rgba( 26, 188, 156, 1 )"
                                                  : "rgba( 220, 53, 69, 1 )",
                                              fontWeight: 500,
                                            }}
                                          ></i>
                                          {plan?.sales}
                                        </h4>
                                      </div>
                                    ))}
                                  </div>
                                </Scrollbar>
                              </>
                            ) : (
                              <h4>No Data Found</h4>
                            )
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              <div
                                className="spinner-border text-primary"
                                role="status"
                              >
                                <span className="visually-hidden">.</span>
                              </div>
                            </div>
                          )}
                          {/* <!-- end row --> */}
                        </div>
                      </div>
                      {/* <!-- collapsed end --> */}
                    </div>
                    {/* <!-- end card-body --> */}
                  </div>
                  {/* <!-- end card--> */}
                </div>
                {/* <!-- end col--> */}
              </div>
              {/* <!-- end row --> */}

              <div className="row">
                <div className="col-xl-6">
                  <div className="card">
                    <div className="card-body">
                      {/* <div className="card-widgets">
                        <a href="javascript: void(0);" data-toggle="reload">
                          <i className="mdi mdi-refresh"></i>
                        </a>
                        <a
                          data-bs-toggle="collapse"
                          href="#cardCollpase4"
                          role="button"
                          aria-expanded="false"
                          aria-controls="cardCollpase4"
                        >
                          <i className="mdi mdi-minus"></i>
                        </a>
                        <a href="javascript: void(0);" data-toggle="remove">
                          <i className="mdi mdi-close"></i>
                        </a>
                      </div> */}
                      <h4 className="header-title mb-0">Revenue By Location</h4>

                      <div id="cardCollpase4" className="collapse show">
                        <div className="pt-3">
                          <div
                            id="world-map-markers"
                            style={{ height: "433px" }}
                          >
                            <WorldMapMarkers data={getLocation} />
                          </div>
                        </div>
                      </div>
                      {/* <!-- collapsed end --> */}
                    </div>
                    {/* <!-- end card-body --> */}
                  </div>
                  {/* <!-- end card--> */}
                </div>
                {/* <!-- end col --> */}

                <div className="col-xl-6">
                  <div className="card">
                    <div className="card-body">
                      {/* <div className="card-widgets">
                        <a href="javascript: void(0);" data-toggle="reload">
                          <i className="mdi mdi-refresh"></i>
                        </a>
                        <a
                          data-bs-toggle="collapse"
                          href="#cardCollpase5"
                          role="button"
                          aria-expanded="false"
                          aria-controls="cardCollpase5"
                        >
                          <i className="mdi mdi-minus"></i>
                        </a>
                        <a href="javascript: void(0);" data-toggle="remove">
                          <i className="mdi mdi-close"></i>
                        </a>
                      </div> */}
                      <h4 className="header-title mb-0">Top Selling Plans</h4>

                      <div id="cardCollpase5" className="collapse show">
                        <div className="table-responsive pt-3">
                          <Scrollbar
                            style={{
                              maxHeight: "430px",
                            }}
                          >
                            <table className="table table-hover table-centered mb-0">
                              <thead>
                                <tr>
                                  <th>Plan Name</th>
                                  <th>Price</th>
                                  <th>Quantity</th>
                                  <th>Amount</th>
                                </tr>
                              </thead>

                              <tbody>
                                {topPlans?.result?.map((plan) => (
                                  <tr>
                                    <td
                                      style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "flex-start",
                                      }}
                                    >
                                      <div
                                        style={{
                                          backgroundColor: plan?.isDeleted
                                            ? "red"
                                            : "",
                                          width: "5px",
                                          height: "5px",
                                          borderRadius: "50%",
                                          display: "inline-block",
                                          marginRight: "2px",
                                          marginTop: "6px",
                                        }}
                                      />
                                      {plan.name}{" "}
                                      {plan.interval === "month"
                                        ? "(M)"
                                        : "(Y)"}
                                    </td>
                                    <td>${plan.price}</td>
                                    <td>{plan.quantity}</td>
                                    <td>${plan.amount}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </Scrollbar>
                        </div>
                        {/* <!-- end table responsive--> */}
                      </div>
                      {/* <!-- collapsed end --> */}
                    </div>
                    {/* <!-- end card-body --> */}
                  </div>
                  {/* <!-- end card--> */}
                </div>
                {/* <!-- end col --> */}
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

        {/* <!-- ============================================================== -->
<!-- End Page content -->
<!-- ============================================================== --> */}
      </div>
    </div>
  );
};

export default Dashboard;

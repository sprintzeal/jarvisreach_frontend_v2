import { Phone, Verified } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { fromAddress, setDefaults } from "react-geocode";

import { Box, Stack, useMediaQuery } from "@mui/system";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiChevronDown } from "react-icons/bi";
import { FaEnvelope, FaPlusCircle } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { MdChevronRight } from "react-icons/md";
import * as Yup from "yup";
import { Scrollbar } from "../../components/Scrollbar";
import {
  useAddCustomersMutation,
  useDeleteCustomersMutation,
  useEnableSMPTMutation,
  useGetUserCustomersQuery,
  useInviteAndResendCustomerMutation,
  useUpdateCustomerMutation,
  useGetAllPlansQuery,
} from "../../slices/adminSlice";


const Customer = ({ collapsed }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [limit, setLimit] = useState(5);
  const [pages, setPage] = useState(1);
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [openDeleteCustomer, setOpenDeleteCustomer] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [createCustomer, { isLoading: isCreatingCustomer }] =
    useAddCustomersMutation();
  const [updateCustomer, { isLoading: isUpdatingCustomer }] =
    useUpdateCustomerMutation();
  const [postSmtpToogle] = useEnableSMPTMutation();
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const closeEditDrawer = () => {
    setOpenEditDrawer(false);
  };
  const [avatar, setAvatar] = useState("");
  const [phone, setPhone] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [planName, setPlanName] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [credits, setCredits] = useState(0);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [planStartDate, setPlanStartDate] = useState("");
  const [SMTP, setSMTP] = useState("");
  const [showDrawerTab, setShowDrawerTab] = useState("Profile");
  const [accordion, setAccordion] = useState({
    accordion1: true,
    accordion2: false,
    accordion3: false,
    accordion4: false,
    accordion5: false,
  });

  const {
    data: getPackages,
    error: getProfilesError,
    isLoading: getProfilesLoading,
  } = useGetAllPlansQuery({
    page: 1,
    limit: 100,
  });

  const [packagePeriod, setPackagePeriod] = useState('');
  const handlePackagePeriodChange = (e) => {
    setPackagePeriod(e.target.value);
  };
  const [openEditCustomer, setOpenEditCustomer] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCustomerId, setEditCustomerId] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editPlan, setEditPlan] = useState("");
  const [editPackagePeriod, setEditPackagePeriod] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [openInviteCustomer, setOpenInviteCustomer] = useState(false);
  const [openResendCustomer, setOpenResendCustomer] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteCustomerId, setInviteCustomerId] = useState("");
  const [resendCustomerId, setResendCustomerId] = useState("");
  const [inviteAndResend, { isLoading: isInviteAndResendLoading }] =
    useInviteAndResendCustomerMutation();
  const handleCloseEditCustomer = () => {
    setOpenEditCustomer(false);
  };
  const {
    data: customers,
    isLoading: isCustomersLoading,
    isError: isCustomersError,
    refetch,
    isFetching,
  } = useGetUserCustomersQuery({
    page: pages,
    limit: limit,
  });
  const [location, setLocation] = useState({
    country: "",
    latitude: "",
    longitude: "",
  });
  const itemsPerPageOptions = [5, 10, 20, 50];
  const totalItems = customers?.totalItems || 0;
  const [currentPage, setCurrentPage] = useState(customers?.page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    itemsPerPageOptions[
    itemsPerPageOptions.indexOf(customers?.limit) !== -1
      ? itemsPerPageOptions.indexOf(customers?.limit)
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
    setCurrentPage(1);
    setPage(1);
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

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    location: Yup.string().required("Location is required"),
    plan: Yup.string().required("Plan is required"),
    packagePeriod: Yup.string().required("Package Period is required"),
  });

  const countries = [
    "United States",
    "Canada",
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and/or Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands",
    "Colombia",
    "Comoros",
    "Congo",
    "Cook Islands",
    "Costa Rica",
    "Croatia (Hrvatska)",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor",
    "Ecudaor",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands (Malvinas)",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "France, Metropolitan",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard and Mc Donald Islands",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran (Islamic Republic of)",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Ivory Coast",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea, Democratic People's Republic of",
    "Korea, Republic of",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libyan Arab Jamahiriya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macau",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia, Federated States of",
    "Moldova, Republic of",
    "Monaco",
    "Mongolia",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfork Island",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Reunion",
    "Romania",
    "Russian Federation",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia South Sandwich Islands",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "St. Helena",
    "St. Pierre and Miquelon",
    "Sudan",
    "Suriname",
    "Svalbarn and Jan Mayen Islands",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States minor outlying islands",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City State",
    "Venezuela",
    "Vietnam",
    "Virigan Islands (British)",
    "Virgin Islands (U.S.)",
    "Wallis and Futuna Islands",
    "Western Sahara",
    "Yemen",
    "Yugoslavia",
    "Zaire",
    "Zambia",
    "Zimbabwe",
  ];

  // useEffect(() => {
  //   const API_KEY = "7be3252e94b23c";
  //   const apiUrl = `https://ipinfo.io/json?token=${API_KEY}`;

  //   axios
  //     .get(apiUrl)
  //     .then((response) => {
  //       const { org, country, loc } = response.data;
  //       const [latitude, longitude] = loc.split(",");
  //       const regex = new RegExp(`\\b(${countries?.join("|")})\\b`, "i");
  //       if (org.match(regex)) {
  //         console.log("country", country);
  //       }
  //       const match = org.match(regex);
  //       const countryName = match ? match[0] : country;
  //       setLocation({ countryName, latitude, longitude });
  //       console.log("countryName", countryName);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching geolocation data:", error);
  //     });

  // }, []);
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form Values Submitted:", values); // Log all form values

    // Setting default values for some parameters
    setDefaults({
      key: "AIzaSyCXKqio1YfC7ZI8C-vkQdsfiIg4FoNOwMc",
      language: "en",
      region: "es",
    });

    // If location is provided, geocode the location to get lat and lng
    if (values.location) {
      fromAddress(values.location)
        .then(async ({ results }) => {
          const { lat, lng } = results[0].geometry.location;

          try {
            // Prepare the data object with all the necessary fields
            let data = {
              ...values, // Spread the values from the form
              role: "customer", // Role for the customer
              termsConditions: false, // Default termsConditions value
              password: "12345678", // Default password
              location: {
                country: values.location, // Country (location) from the form
                lat: lat, // Latitude from geocoding
                lon: lng, // Longitude from geocoding
              },
              // packagePeriod: values.packagePeriod,
            };

            console.log('Data to send to backend:', data); 
            await createCustomer({ body: data }).unwrap();

            // If the request is successful, show a success toast
            toast.success(
              "Customer added successfully. If you want to send him an email invitation, click on the invite button"
            );

            // Remove authToken from sessionStorage (if needed for session)
            sessionStorage.removeItem("authToken");

            // Set submitting state to false and close the modal
            setSubmitting(false);
            setOpenCustomerModal(false);
          } catch (error) {
            console.error("Error during customer creation:", error);
            toast.error(error.data?.message || "An error occurred.");
          }
        })
        .catch(console.error); // Log any geocoding error
    }
  };

  const handleSubmitEdit = async (values, { setSubmitting }) => {
    if (values.packagePeriod !== "Custom Date") {
      delete values.startDate;
      delete values.endDate;
    }
    
    setDefaults({
      key: "AIzaSyCXKqio1YfC7ZI8C-vkQdsfiIg4FoNOwMc",
      language: "en",
      region: "es",
    });
    if (values.location) {
      fromAddress(values.location)
        .then(async ({ results }) => {
          const { lat, lng } = results[0].geometry.location;
          try {
            let data = {
              ...values,
              location: {
                country: values.location,
                lat: lat,
                lon: lng,
              },
            };
            console.log('Data', data)
            await updateCustomer({
              id: editCustomerId,
              updatedCustomer: data,
            }).unwrap();
            toast.success("Customer updated successfully");
            setSubmitting(false);
            setOpenEditCustomer(false);
          } catch (error) {
            console.log("error", error);
            toast.error(error.data.message);
          }
        })
        .catch(console.error);
    } else {
      try {
        let data = {
          ...values,
        };
        await updateCustomer({
          id: editCustomerId,
          updatedCustomer: data,
        }).unwrap();
        toast.success("Customer updated successfully");
        setSubmitting(false);
        setOpenEditCustomer(false);
      } catch (error) {
        console.log("error", error);
        toast.error(error.data.message);
      }
    }
  };

  const CustomErrorMessage = ({ children }) => (
    <div className="error-message">
      <span className="error-icon">⚠️</span> {children}
    </div>
  );
  const [
    openDeleteCustomers,
    {
      isError: deleteCustomersError,
      isLoading: deletingCustomers,
      isSuccess: customersDeleted,
    },
  ] = useDeleteCustomersMutation();
  const handleSubmitDelete = async () => {
    try {
      await openDeleteCustomers({ ids: selectedProfiles }).unwrap();
      toast.success("Customer deleted successfully");
      setOpenDeleteCustomer(false);
      setSelectedProfiles([]);
    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message);
    }
  };
  const handleSubmitInvite = async () => {
    try {
      await inviteAndResend({ id: inviteCustomerId }).unwrap();
      toast.success("Invite sent successfully");
      setOpenInviteCustomer(false);
      setInviteCustomerId();
    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message);
    }
  };
  const handleSubmitResend = async () => {
    try {
      await inviteAndResend({ id: resendCustomerId }).unwrap();
      toast.success("Resend successfully");
      setOpenResendCustomer(false);
      setInviteCustomerId();
    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message);
    }
  };

  console.log("location", location);

  useEffect(() => {
    if (customersDeleted) {
      refetch();
    }
  }, [customersDeleted]);

  const handleView = (row) => {
    setOpenEditDrawer(true);
    setAvatar(row?.avatar ? row.avatar : "");
    setPhone(row?.phone ? row.phone : "");
    setCustomerId(row?._id ? row._id : "");
    setEmail(row?.email ? row.email : "");
    setFirstName(row?.firstName ? row.firstName : "");
    setLastName(row?.lastName ? row.lastName : "");
    setCountry(row?.location?.country ? row.location.country : "");
    setPaymentStatus(row?.paymentStatus ? row.paymentStatus : "");
    setExpirationDate(
      row?.expirationDate ? row.expirationDate : new Date().toISOString()
    );
    setPlanName(row?.plan?.planName ? row.plan?.planName : "");
    setUpdateDate(row?.plan?.planUpdateDate ? row.plan.planUpdateDate : "");
    setCredits(row?.plan?.credits ? row.plan.credits : 0);
    setCreditsUsed(row?.plan?.creditsUsed ? row.plan.creditsUsed : 0);
    setPlanStartDate(row?.purchaseDate ? row.purchaseDate : "");
    setSMTP(row?.smtp ? row.smtp : "");
  };

  const handleInvite = (row) => {
    setOpenInviteCustomer(true);
    setInviteEmail(row?.email ? row.email : "");
    setInviteCustomerId(row?._id ? row._id : "");
  };

  const handleResend = (row) => {
    setOpenResendCustomer(true);
    setInviteEmail(row?.email ? row.email : "");
    setResendCustomerId(row?._id ? row._id : "");
  };

  const handleEdit = (row) => {
    setOpenEditCustomer(true);
    setEditFirstName(row?.firstName ? row.firstName : "");
    setEditLastName(row?.lastName ? row.lastName : "");
    setEditEmail(row?.email ? row.email : "");
    setEditPhone(row?.phone ? row.phone : "");
    setEditCustomerId(row?._id ? row._id : "");
    setEditCountry(row?.location?.country ? row.location.country : "");
    setEditPlan(row?.plan?.planName ? row.plan?.planName : "");
    setEditPackagePeriod(row?.plan?.packagePeriod ? row.plan?.packagePeriod : "");
    const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : "";

    setEditStartDate(formatDate(row?.plan?.startDate));
    setEditEndDate(formatDate(row?.plan?.endDate));
  };

  console.log('customers', customers)

  return (
    <Stack
      sx={{
        padding: "20px",
        backgroundColor: "#f3f7f9",
        width: collapsed ? "calc(100%)" : "calc(100% - 10px)",
        transition: "all 0.3s ease",
        marginBottom: "50px",
      }}
    >
      <Box style={{ marginTop: isSmallScreen ? "40px" : "20px" }}>
        <Typography
          variant="h6"
          sx={{
            color: "#323a46",
            fontWeight: 500,
          }}
        >
          Customers
        </Typography>
        <Card
          sx={{
            marginTop: "20px",
            padding: "20px",
            maxWidth: "2000px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: isSmallScreen ? "flex-start" : "center",
              flexDirection: isSmallScreen ? "column" : "row",
            }}
          >
            {" "}
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={
                <FaPlusCircle
                  style={{
                    color: "#fff",
                    fontSize: "14px",
                  }}
                />
              }
              sx={{
                padding: "10px 10px",
                backgroundColor: "#f1556c",
                "&:hover": {
                  backgroundColor: "#f1556c",
                },
                whiteSpace: "nowrap",
              }}
              onClick={() => {
                setOpenCustomerModal(true);
              }}
            >
              Add Customers
            </Button>
            {selectedProfiles?.length > 0 && (
              <CardHeader
                sx={{
                  color: "#323a46",
                  fontWeight: 700,
                }}
                action={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Button
                      size="small"
                      sx={{
                        padding: "10px 10px",
                        backgroundColor: "#1abc9c",
                        boxShadow: "none",
                        color: "#fff",
                        backgroundColor: "#f1556c", //"#f1556c",
                        "&:hover": {
                          backgroundColor: "#f1556c",
                        },
                      }}
                      onClick={() => setOpenDeleteCustomer(true)}
                    >
                      Delete Customer
                    </Button>
                  </Box>
                }
              />
            )}
          </Box>
          <TableContainer
            sx={{
              marginTop: "20px",
              backgroundColor: "#fff",
              minWidth: 200,
            }}
          >
            <Scrollbar>
              <Table sx={{ minWidth: 200 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#f3f7f9",
                    }}
                  >
                    <TableCell>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customCheck2"
                          checked={
                            selectedProfiles.length !== 0 &&
                            selectedProfiles.length ===
                            customers?.result?.length
                          }
                          onChange={(e) => {
                            setSelectedProfiles((prev) => {
                              if (
                                prev.length !== 0 &&
                                prev.length === customers?.result?.length
                              ) {
                                return [];
                              } else {
                                return customers?.result?.map((row) => row._id);
                              }
                            });
                          }}
                        />
                        <label className="form-check-label" for="customCheck2">
                          &nbsp;
                        </label>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#6c757d",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#6c757d",
                      }}
                    >
                      Phone
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#6c757d",
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#6c757d",
                      }}
                    >
                      Country/City
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#6c757d",
                      }}
                    >
                      Plan
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#6c757d",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Credit
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#6c757d",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Payment Status
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#6c757d",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Customer Status
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#6c757d",
                      }}
                    >
                      SMTP
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#6c757d",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Date of Join
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#6c757d",
                        whiteSpace: "nowrap",
                      }}
                    >
                      plan/Update Date
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#6c757d",
                        whiteSpace: "nowrap",
                      }}
                    >
                      plan/End Date
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#6c757d",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers?.result?.length > 0 &&
                    customers?.result?.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="customCheck2"
                              checked={selectedProfiles.includes(row._id)}
                              onChange={(e) => {
                                setSelectedProfiles((prev) => {
                                  const isSelected = prev.includes(row._id);
                                  if (isSelected) {
                                    // Remove ID from selected rows
                                    return prev.filter(
                                      (item) => item !== row._id
                                    );
                                  } else {
                                    // Add ID to selected rows
                                    return [...prev, row._id];
                                  }
                                });
                              }}
                            />
                            <label
                              className="form-check-label"
                              for="customCheck2"
                            >
                              &nbsp;
                            </label>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Avatar
                              sx={{
                                width: "30px",
                                height: "30px",
                              }}
                              src={
                                row?.avatar ? (
                                  row?.avatar
                                ) : (
                                  <FaCircleUser
                                    style={{
                                      fontSize: "30px",
                                      color: "#f1556c",
                                    }}
                                  />
                                )
                              }
                            />
                            {row.firstName} {row.lastName}
                          </div>
                        </TableCell>
                        <TableCell>{row.phone ? row.phone : "N/A"}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell
                          style={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.location?.country || "N/A"}
                        </TableCell>

                        {/* <TableCell>
                          <div
                            className="badge"
                            style={{
                              backgroundColor:
                                row.planName !== null &&
                                (row.planName === "Advance"
                                  ? "rgb(67 191 229)"
                                  : row.planName === "Pro plan"
                                    ? "rgb(247 184 75)"
                                    : "rgb(67 191 229 / 25%)"),
                              color:
                                row.planName !== null &&
                                (row.planName !== "Free"
                                  ? "#fff"
                                  : "rgb(67 191 229)"),
                              padding: "5px 5px",
                              borderRadius: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {row.planName !== null ? row.planName : "N/A"}
                          </div>
                        </TableCell> */}

                        <TableCell>
                          <div
                            className="badge"
                            style={{
                              backgroundColor:
                                row.plan && row.plan.planName !== null &&
                                (row.plan.planName === "Advance"
                                  ? "rgb(67 191 229)" // Blue for "Advance"
                                  : row.plan.planName === "Enterprise"
                                    ? "rgb(34, 193, 195)" // Aqua for "Enterprise"
                                    : row.plan.planName === "Basic"
                                      ? "rgb(247 184 75)" // Yellow for "Basic"
                                      : "rgb(67 191 229 / 25%)"), // Light blue for "Free"
                              color:
                                row.plan && row.plan.planName !== null &&
                                (row.plan.planName === "Free" // For "Free", text color is blue
                                  ? "rgb(67 191 229)"
                                  : "#fff"), // For others, text color is white
                              padding: "5px 5px",
                              borderRadius: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {row.plan && row.plan.planName !== null ? row.plan.planName : "N/A"}
                          </div>
                        </TableCell>



                        <TableCell>
                          <div
                            className="progress my-2 progress-sm"
                            style={{
                              height: "5px",
                            }}
                          >
                            <div
                              className="progress-bar progress-lg"
                              role="progressbar"
                              style={{
                                width:
                                  (row?.plan?.creditsUsed /
                                    row?.plan?.credits) *
                                  100 +
                                  "%",
                                backgroundColor: "#1abc9c",
                                height: "5px",
                              }}
                              aria-valuenow="46"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <p
                            className="text-muted font-12 mb-0"
                            style={{
                              whiteSpace: "nowrap",
                            }}
                          >
                            Used Credit {row?.plan?.creditsUsed}
                            {"/"}
                            {row?.plan?.credits}
                          </p>
                        </TableCell>
                        <TableCell>
                          {" "}
                          <h5>
                            <span
                              className="badge "
                              style={{
                                backgroundColor:
                                  row.paymentStatus === "active"
                                    ? "rgb(67 191 229)"
                                    : row.paymentStatus === null
                                      ? "rgb(247 184 75)"
                                      : "rgb(247 184 75)",
                                color:
                                  row.paymentStatus === "active"
                                    ? "#fff"
                                    : "black",
                                padding: "5px 5px",
                                borderRadius: "5px",
                                fontSize: "12px",
                              }}
                            >
                              <i className="mdi mdi-bitcoin"></i>
                              {row.paymentStatus !== null
                                ? row.paymentStatus
                                : "Unpaid"}
                            </span>
                          </h5>
                        </TableCell>
                        <TableCell>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: row.status ? "rgb(26 188 156)" : "#6c757d",
                              backgroundColor: row.status
                                ? "#e7f7f2"
                                : "#f3f7f9",
                              padding: "1px 5px",
                              borderRadius: "5px",
                              gap: "10px",
                              justifyContent: "center",
                              width: "fit-content",
                              fontWeight: 500,
                            }}
                          >
                            {row.status ? "Active" : "Inactive"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {" "}
                          <div className="form-check form-switch">
                            <input
                              style={{
                                cursor: "pointer",
                              }}
                              type="checkbox"
                              className="form-check-input"
                              id="customSwitch1"
                              checked={row.smtp === "Active" ? true : false}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                if (checked === true || checked === false) {
                                  postSmtpToogle({
                                    body: {
                                      customerId: row._id,
                                      smtp:
                                        checked === true
                                          ? "Active"
                                          : "Deactive",
                                    },
                                  })
                                    .unwrap()
                                    .then((res) => {
                                      toast.success(
                                        `SMTP for ${row.firstName} ${row.lastName
                                        } ${checked ? "enabled" : "disabled"
                                        } successfully`
                                      );
                                    })
                                    .catch((error) => {
                                      toast.error(error.data.message);
                                    });
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              for="customSwitch1"
                            >
                              Disable/Enable
                            </label>
                          </div>
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.created_at !== null &&
                            (row.created_at
                              ? new Date(row.created_at).toDateString({
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                              : "N/A")}{" "}
                          <small className="text-muted">
                            {row.created_at !== null &&
                              (row.created_at
                                ? new Date(row.created_at).toLocaleTimeString()
                                : "N/A")}
                          </small>
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.purchaseDate !== null &&
                            (row.purchaseDate
                              ? new Date(row.purchaseDate).toDateString()
                              : "N/A")}{" "}
                          <small className="text-muted">
                            {row.purchaseDate !== null &&
                              (row.purchaseDate
                                ? new Date(
                                  row.purchaseDate
                                ).toLocaleTimeString()
                                : "N/A")}
                          </small>
                        </TableCell>
                        {/* <TableCell
                          style={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.expirationDate !== null &&
                            (row.expirationDate
                              ? new Date(row.expirationDate).toDateString()
                              : "N/A")}{" "}
                          <small className="text-muted">
                            {row.expirationDate !== null &&
                              (row.expirationDate
                                ? new Date(
                                  row.expirationDate
                                ).toLocaleTimeString()
                                : "N/A")}
                          </small>
                        </TableCell>{" "} */}

                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          {row.expiredAt !== null &&
                            (row.expiredAt
                              ? new Date(row.expiredAt).toDateString()
                              : "N/A")}{" "}
                          <small className="text-muted">
                            {row.expiredAt !== null &&
                              (row.expiredAt
                                ? new Date(row.expiredAt).toLocaleTimeString()
                                : "N/A")}
                          </small>
                        </TableCell>




                        <TableCell
                          style={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          <div className="text-center button-list">
                            <a
                              style={{
                                cursor: "pointer",
                              }}
                              className="btn btn-xs btn-primary waves-effect waves-light"
                              onClick={() => handleView(row)}
                            >
                              View
                            </a>
                            <a
                              className="btn btn-xs btn-primary waves-effect waves-light"
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={() => handleEdit(row)}
                            >
                              Edit
                            </a>
                            <a
                              style={{
                                cursor: "pointer",
                              }}
                              className="btn btn-xs btn-primary waves-effect waves-light"
                              onClick={() => handleInvite(row)}
                            >
                              Invite
                            </a>
                            <a
                              style={{
                                cursor: "pointer",
                              }}
                              className="btn btn-xs btn-primary waves-effect waves-light"
                              onClick={() => handleResend(row)}
                            >
                              Resend
                            </a>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {customers?.result?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={14}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#323a46",
                              fontWeight: 500,
                              fontSize: "14px",
                            }}
                          >
                            No Customers Found
                          </Typography>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {(isFetching || isCustomersLoading) && (
                    <TableRow>
                      <TableCell colSpan={14}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#323a46",
                              fontWeight: 500,
                            }}
                          >
                            <CircularProgress />
                          </Typography>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
            <div
              className=""
              style={{
                maxWidth: "100%",
                overflowX: "auto",
                display: "flex",
                // direction column in small screen
                flexDirection: isSmallScreen ? "column" : "",
                justifyContent: "flex-end",
              }}
            >
              <div className="pagination-controls">
                <label
                  style={{
                    fontSize: "16px",
                    fontWeight: "400",
                  }}
                >
                  Items per page
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    style={{
                      // style for select
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      marginLeft: "10px",
                      cursor: "pointer",
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
                {getVisiblePages()?.length > 3 && currentPage > 3 && (
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
                    <span className="visually-hidden">Previous</span>
                  </a>
                </li>
                {getVisiblePages().map((page) => (
                  <li
                    key={page}
                    className={`page-item ${page === (currentPage || pages) ? "active" : ""
                      }`}
                    onClick={() => handlePageClick(page)}
                    style={{ cursor: "pointer" }}
                  >
                    <a className="page-link">{page}</a>
                  </li>
                ))}
                <li className="page-item" onClick={handleNextClick}>
                  <a
                    className="page-link"
                    aria-label="Next"
                    style={{ cursor: "pointer" }}
                  >
                    <span aria-hidden="true">»</span>
                    <span className="visually-hidden">Next</span>
                  </a>
                </li>
                {totalPages > 5 && currentPage < totalPages - 2 && (
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
          </TableContainer>{" "}
          <Dialog
            open={openCustomerModal}
            onClose={() => {
              setOpenCustomerModal(false);
            }}
            fullWidth
            maxWidth="sm"
          >
            <div
              className="modal-dialog modal-dialog-centered"
              style={{
                width: "100%",
                maxWidth: "100%",
                padding: "10px",
              }}
            >
              <div className="modal-content">
                <div className="modal-header bg-light">
                  <h4
                    className="modal-title"
                    style={{
                      color: "#323a46",
                      fontWeight: 600,
                    }}
                  >
                    Add New Customers
                  </h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-hidden="true"
                    onClick={() => {
                      setOpenCustomerModal(false);
                    }}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <Formik
                    initialValues={{
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      location: location.countryName,
                      plan: "",
                      packagePeriod: "",
                      startDate: "",
                      endDate: ""
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                  >
                    {({ isSubmitting, values }) => (
                      <Form>
                        <div className="mb-2">
                          <label htmlFor="firstName" className="form-label">
                            First name
                          </label>
                          <Field
                            type="text"
                            name="firstName"
                            className="form-control"
                            placeholder="Enter first name"
                          />
                          <ErrorMessage
                            name="firstName"
                            component={CustomErrorMessage}
                          />
                        </div>
                        <div className="mb-2">
                          <label htmlFor="lastName" className="form-label">
                            Last name
                          </label>
                          <Field
                            type="text"
                            name="lastName"
                            className="form-control"
                            placeholder="Enter last name"
                          />
                          <ErrorMessage
                            name="lastName"
                            component={CustomErrorMessage}
                          />
                        </div>
                        <div className="mb-2">
                          <label htmlFor="email" className="form-label">
                            Email address
                          </label>
                          <Field
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                          />
                          <ErrorMessage
                            name="email"
                            component={CustomErrorMessage}
                          />
                        </div>
                        <div className="mb-2">
                          <label htmlFor="phone" className="form-label">
                            Phone
                          </label>
                          <Field
                            type="text"
                            name="phone"
                            className="form-control"
                            placeholder="Enter phone number"
                          />
                          <ErrorMessage
                            name="phone"
                            component={CustomErrorMessage}
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="location" className="form-label">
                            Location
                          </label>
                          <Field
                            type="text"
                            name="location"
                            className="form-control"
                            placeholder="Enter location"
                          />
                          <ErrorMessage
                            name="location"
                            component={CustomErrorMessage}
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="plan" className="form-label">
                            Package Plan
                          </label>
                          <Field as="select" name="plan" className="form-control">
                            {/* Dynamically populate the options based on backend data */}
                            <option value="">Select Plan</option>
                            {getPackages?.result?.map((plan) => (
                              <option key={plan._id} value={plan.name}>
                                {plan.name}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="plan"
                            component={CustomErrorMessage}
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="packagePeriod" className="form-label">
                            Package Period
                          </label>
                          <Field
                            as="select"
                            name="packagePeriod"
                            className="form-control"
                          >
                            <option value="">Select Period</option>
                            <option value="Month">Month</option>
                            <option value="Year">Year</option>
                            <option value="Custom Date">Custom Date</option>
                          </Field>
                          <ErrorMessage
                            name="packagePeriod"
                            component={CustomErrorMessage}
                          />
                        </div>

                        {values.packagePeriod === "Custom Date" && (
                          <>
                            <div className="mb-3">
                              <label htmlFor="startDate" className="form-label">
                                Start Date
                              </label>
                              <Field
                                type="date"
                                name="startDate"
                                className="form-control"
                              />
                              <ErrorMessage
                                name="startDate"
                                component={CustomErrorMessage}
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="endDate" className="form-label">
                                End Date
                              </label>
                              <Field
                                type="date"
                                name="endDate"
                                className="form-control"
                              />
                              <ErrorMessage
                                name="endDate"
                                component={CustomErrorMessage}
                              />
                            </div>
                          </>
                        )}

                             


                        <div
                          className="text-end"
                          style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            type="submit"
                            className="btn btn-success waves-effect waves-light"
                            disabled={isCreatingCustomer}
                          >
                            {isCreatingCustomer ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                                style={{
                                  display: isCreatingCustomer ? "inline-block" : "none",
                                }}
                              ></span>
                            ) : (
                              "Save"
                            )}
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger waves-effect waves-light"
                            data-bs-dismiss="modal"
                            onClick={() => {
                              setOpenCustomerModal(false);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </Form>

                    )}
                  </Formik>{" "}
                </div>
              </div>
              {/* <!-- /.modal-content --> */}
            </div>
            {/* <!-- /.modal-dialog --> */}
          </Dialog>
        </Card>
        {/* <!-- Footer Start --> */}
        <Dialog
          open={openDeleteCustomer}
          onClose={() => {
            setOpenDeleteCustomer(false);
          }}
          fullWidth
          maxWidth="sm"
        >
          {/* Delete Customer */}
          <DialogTitle id="alert-dialog-title">{"Delete Customer"}</DialogTitle>
          <DialogContent>
            Are you sure you want to delete{" "}
            {selectedProfiles.length > 1 ? "these customers" : "this customer"}{" "}
            ?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDeleteCustomer(false);
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSubmitDelete();
              }}
              color="warning"
              autoFocus
              disabled={deletingCustomers}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openInviteCustomer}
          onClose={() => {
            setOpenInviteCustomer(false);
          }}
          fullWidth
          maxWidth="sm"
        >
          {/* Delete Customer */}
          <DialogTitle id="alert-dialog-title">{"Invite Customer"}</DialogTitle>
          <DialogContent>
            Are you sure you want to invite this customer having this{" "}
            <em
              style={{
                color: "#f1556c",
                fontWeight: 600,
              }}
            >
              {inviteEmail}
            </em>{" "}
            email address?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenInviteCustomer(false);
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSubmitInvite();
              }}
              color="warning"
              autoFocus
              disabled={isInviteAndResendLoading}
            >
              {isInviteAndResendLoading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Invite"
              )}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openResendCustomer}
          onClose={() => {
            setOpenResendCustomer(false);
          }}
          fullWidth
          maxWidth="sm"
        >
          {/* Delete Customer */}
          <DialogTitle fontSize="20px" fontWeight={500} id="alert-dialog-title">
            {"Resend Invitation"}
          </DialogTitle>
          <DialogContent>
            Are you sure you want to Resent invitation to this customer having
            this{" "}
            <em
              style={{
                color: "#f1556c",
                fontWeight: 600,
              }}
            >
              {inviteEmail}
            </em>{" "}
            email address?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenResendCustomer(false);
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSubmitResend();
              }}
              color="warning"
              autoFocus
              disabled={isInviteAndResendLoading}
            >
              {isInviteAndResendLoading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Resend"
              )}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openEditCustomer}
          onClose={handleCloseEditCustomer}
          fullWidth
          maxWidth="sm"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{
              width: "100%",
              maxWidth: "100%",
              padding: "10px",
            }}
          >
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h4
                  className="modal-title"
                  style={{
                    color: "#323a46",
                    fontWeight: 600,
                  }}
                >
                  Edit Customers
                </h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-hidden="true"
                  onClick={handleCloseEditCustomer}
                ></button>
              </div>
              <div className="modal-body p-4">
              <Formik
                  initialValues={{
                    firstName: editFirstName,
                    lastName: editLastName,
                    email: editEmail,
                    phone: editPhone,
                    location: editCountry,
                    plan: editPlan,
                    packagePeriod: editPackagePeriod,
                    startDate: editStartDate || "", // Default empty string if not set
                    endDate: editEndDate || "", // Default empty string if not set
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmitEdit}
                  enableReinitialize={true}
                >
                  {({ isSubmitting, values }) => (
                    <Form>
                      {/* First Name */}
                      <div className="mb-2">
                        <label htmlFor="firstName" className="form-label">
                          First Name
                        </label>
                        <Field
                          type="text"
                          name="firstName"
                          className="form-control"
                          placeholder="Enter first name"
                        />
                        <ErrorMessage
                          name="firstName"
                          component={CustomErrorMessage}
                        />
                      </div>

                      {/* Last Name */}
                      <div className="mb-2">
                        <label htmlFor="lastName" className="form-label">
                          Last Name
                        </label>
                        <Field
                          type="text"
                          name="lastName"
                          className="form-control"
                          placeholder="Enter last name"
                        />
                        <ErrorMessage
                          name="lastName"
                          component={CustomErrorMessage}
                        />
                      </div>

                      {/* Email */}
                      <div className="mb-2">
                        <label htmlFor="email" className="form-label">
                          Email address
                        </label>
                        <Field
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                        />
                        <ErrorMessage
                          name="email"
                          component={CustomErrorMessage}
                        />
                      </div>

                      {/* Phone */}
                      <div className="mb-2">
                        <label htmlFor="phone" className="form-label">
                          Phone
                        </label>
                        <Field
                          type="text"
                          name="phone"
                          className="form-control"
                          placeholder="Enter phone number"
                        />
                        <ErrorMessage
                          name="phone"
                          component={CustomErrorMessage}
                        />
                      </div>

                      {/* Location */}
                      <div className="mb-3">
                        <label htmlFor="location" className="form-label">
                          Location
                        </label>
                        <Field
                          type="text"
                          name="location"
                          className="form-control"
                          placeholder="Enter location"
                        />
                        <ErrorMessage
                          name="location"
                          component={CustomErrorMessage}
                        />
                      </div>

                      {/* Package Plan */}
                      <div className="mb-3">
                        <label htmlFor="plan" className="form-label">
                          Package Plan
                        </label>
                        <Field as="select" name="plan" className="form-control">
                          <option value="">Select Plan</option>
                          {getPackages?.result?.map((plan) => (
                            <option key={plan._id} value={plan.name}>
                              {plan.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="plan" component={CustomErrorMessage} />
                      </div>

                      {/* Package Period */}
                      <div className="mb-3">
                        <label htmlFor="packagePeriod" className="form-label">
                          Package Period
                        </label>
                        <Field as="select" name="packagePeriod" className="form-control">
                          <option value="">Select Period</option>
                          <option value="Month">Month</option>
                          <option value="Year">Year</option>
                          <option value="Custom Date">Custom Date</option>
                        </Field>
                        <ErrorMessage name="packagePeriod" component={CustomErrorMessage} />
                      </div>

                      {/* Conditional Fields for Custom Date */}
                      {values.packagePeriod === "Custom Date" && (
                        <>
                          <div className="mb-3">
                            <label htmlFor="startDate" className="form-label">
                              Start Date
                            </label>
                            <Field
                              type="date"
                              name="startDate"
                              className="form-control"
                            />
                            <ErrorMessage name="startDate" component={CustomErrorMessage} />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="endDate" className="form-label">
                              End Date
                            </label>
                            <Field
                              type="date"
                              name="endDate"
                              className="form-control"
                            />
                            <ErrorMessage name="endDate" component={CustomErrorMessage} />
                          </div>
                        </>
                      )}

                      {/* Submit and Cancel Buttons */}
                      <div
                        className="text-end"
                        style={{
                          display: "flex",
                          gap: "10px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          type="submit"
                          className="btn btn-success waves-effect waves-light"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            "Save"
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger waves-effect waves-light"
                          data-bs-dismiss="modal"
                          onClick={handleCloseEditCustomer}
                        >
                          Cancel
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>

              </div>
            </div>
            {/* <!-- /.modal-content --> */}
          </div>
          {/* <!-- /.modal-dialog --> */}
        </Dialog>

        <Drawer
          anchor="right"
          open={openEditDrawer}
          onClose={closeEditDrawer}
          outSideClickClose={true}
          closeIcon={true}
          style={{
            width: "500px",
          }}
        >
          <ClickAwayListener onClickAway={closeEditDrawer}>
            <div
              className={` ${activeDropdown === "modelProfile" ? "show" : ""}`}
              tabindex="-1"
              id="offcanvasRight"
              aria-labelledby="offcanvasRightLabel"
              style={{
                maxWidth: isSmallScreen ? "100%" : "400px",
                minWidth: isSmallScreen ? "100%" : "400px",
                width: "100%",
              }}
            >
              <div
                className="offcanvas-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                }}
              >
                <h5 id="offcanvasRightLabel">{`${firstName} ${lastName}`}</h5>
                {/* <div className="dropdown">
                    <button
                      className="btn btn-light dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded={
                        activeDropdown === "modelProfileSetting"
                          ? "true"
                          : "false"
                      }
                      onClick={closeEditDrawer}
                    >
                      Settings
                      <i className="mdi mdi-chevron-down"></i>
                    </button>
                    <div
                      className={
                        "dropdown-menu" + (openEditDrawer ? " show" : "")
                      }
                      aria-labelledby="dropdownMenuButton"
                      style={{
                        marginLeft: "-100px",
                      }}
                    >
                      <a
                        className="dropdown-item"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setAccordion({
                            accordion1: true,
                            accordion2: true,
                            accordion3: true,
                            accordion4: true,
                            accordion5: true,
                            accordion6: true,
                            accordion7: true,
                            accordion8: true,
                          });
                          setSettingsActiveDrawer(false);
                        }}
                      >
                        Expand all tabs
                      </a>
                      <a
                        className="dropdown-item"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setAccordion({
                            accordion1: false,
                            accordion2: false,
                            accordion3: false,
                            accordion4: false,
                            accordion5: false,
                            accordion6: false,
                            accordion7: false,
                            accordion8: false,
                          });
                          setSettingsActiveDrawer(false);
                        }}
                      >
                        Compress Collapse all tabs
                      </a>
                    </div>
                  </div> */}
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={closeEditDrawer}
                ></button>
              </div>
              {/* <!-- end offcanvas-header--> */}

              <div
                className="offcanvas-body"
                style={{
                  overflowX: "hidden",
                }}
              >
                <div
                  className="user-profile"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "1rem",
                  }}
                >
                  <div className="user-picture">
                    <img
                      src={
                        avatar &&
                          avatar !== "" &&
                          avatar !== "undefined" &&
                          !avatar.includes("data:image")
                          ? avatar
                          : "/assets/images/users/userPlaceholder.png"
                      }
                      width="80"
                      height="80"
                    />
                  </div>
                  <div className="user-details">
                    <h4> {`${firstName} ${lastName}`}</h4>
                    {/* <span
                        onClick={() => {
                          window.open(
                            `https://www.linkedin.com/in/${linkedInId}`
                          );
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <FaLinkedin
                          className="fa-brands"
                          style={{
                            color: "#0077B5",
                            fontSize: "14px",
                          }}
                        />
                      </span> */}
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-body">
                        <ul
                          className="nav nav-tabs"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <li className="nav-item">
                            <a
                              data-bs-toggle="tab"
                              aria-expanded="false"
                              className={
                                "nav-link" +
                                (showDrawerTab === "Profile" ? " active" : "")
                              }
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                display: "flex",
                                gap: "5px",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                              onClick={() => setShowDrawerTab("Profile")}
                            >
                              <FaCircleUser />
                              Profile
                            </a>
                          </li>
                          {/* <li className="nav-item">
                              <a
                                data-bs-toggle="tab"
                                aria-expanded="true"
                                className={
                                  "nav-link" +
                                  (showDrawerTab === "Activity"
                                    ? " active"
                                    : "")
                                }
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                                onClick={() => setShowDrawerTab("Activity")}
                              >
                                <FaClockRotateLeft />
                                Activity
                              </a>
                            </li> */}
                        </ul>
                        <div className="tab-content">
                          {showDrawerTab === "Profile" && (
                            <div
                              className={
                                "tab-pane" +
                                (showDrawerTab === "Profile"
                                  ? "show active"
                                  : "")
                              }
                              id="Profile"
                            >
                              <div className="col-xl-12">
                                <div
                                  className="accordion custom-accordion"
                                  id="custom-accordion-one"
                                >
                                  <div
                                    className="card mb-0"
                                    style={{
                                      borderBottom: "1px solid #D3D3D3",
                                    }}
                                  >
                                    <div
                                      style={{
                                        padding: "20px 10px",
                                        cursor: "pointer",
                                      }}
                                      id="headingSix"
                                    >
                                      <h5 className="m-0 position-relative">
                                        <a
                                          className=" text-reset d-block"
                                          data-bs-toggle="collapse"
                                          aria-expanded={
                                            accordion.accordion1
                                              ? "true"
                                              : "false"
                                          }
                                          aria-controls="Emails"
                                          onClick={() =>
                                            setAccordion({
                                              accordion1: !accordion.accordion1,
                                            })
                                          }
                                          style={{
                                            fontSize: "14px",
                                          }}
                                        >
                                          <FaEnvelope
                                            style={{
                                              marginRight: "5px",
                                              marginTop: "-3px",
                                            }}
                                          />
                                          Emails{" "}
                                          {accordion.accordion1 ? (
                                            <BiChevronDown className="accordion-arrow" />
                                          ) : (
                                            <MdChevronRight className="accordion-arrow" />
                                          )}
                                        </a>
                                      </h5>
                                    </div>

                                    <div
                                      id=""
                                      className={
                                        "collapse" +
                                        (accordion.accordion1 ? "show" : "")
                                      }
                                      aria-labelledby="headingFour"
                                      data-bs-parent="#custom-accordion-one"
                                      style={{
                                        padding: "10px",
                                        marginTop: "-10px",
                                      }}
                                    >
                                      <div className="">
                                        {/* <div className="edit-email">
                                          <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#standard-modal"
                                            style={{
                                              fontSize: "14px",
                                              color: "rgb(0, 119, 181)",
                                              cursor: "pointer",
                                              fontWeight: 600,
                                            }}
                                            id={popOverEl}
                                            onClick={(e) => {
                                              setPopOverEl(e.currentTarget);
                                              setOpenEditPopOverDrawer(true);
                                            }}
                                          >
                                            Edit emails
                                          </a>
                                        </div>{" "} */}

                                        {(!email === "" || !email !== null) && (
                                          <div
                                            className=""
                                            style={{
                                              backgroundColor: "#fffff",
                                              display: "flex",
                                              justifyContent: "space-between",
                                              borderRadius: "30px",
                                              alignItems: "center",
                                            }}
                                          >
                                            <div className="direct-mail-left">
                                              <p
                                                style={{
                                                  display: "flex",
                                                  gap: "5px",
                                                  alignItems: "center",
                                                  fontSize: "14px",
                                                  fontWeight: 600,
                                                }}
                                              >
                                                <Verified
                                                  style={{
                                                    color: "orange",
                                                    fontSize: "18px",
                                                  }}
                                                />
                                                {email}
                                              </p>
                                            </div>
                                            {/* <div className="direct-mail-right">
                                                    <h6
                                                      style={{
                                                        display: "flex",
                                                        gap: "5px",
                                                        alignItems: "center",
                                                        cursor: "pointer",
                                                      }}
                                                    >
                                                     
                                                      {copied &&
                                                      copiedEmail ===
                                                        email.email ? (
                                                        <FaCheckCircle
                                                          style={{
                                                            color: "green",
                                                            width: "15px",
                                                            height: "15px",
                                                            cursor: "pointer",
                                                          }}
                                                        />
                                                      ) : (
                                                        <FaCopy
                                                          style={{
                                                            color: "gray",
                                                            width: "15px",
                                                            height: "15px",
                                                            cursor: "pointer",
                                                          }}
                                                          onClick={(e) => {
                                                            handleCopy(
                                                              e,
                                                              email
                                                            );
                                                          }}
                                                        />
                                                      )}
                                                    </h6>
                                                  </div> */}
                                          </div>
                                        )}
                                        {(email === "" || email === null) && (
                                          <div
                                            className=""
                                            style={{
                                              backgroundColor: "#fffff",
                                              display: "flex",
                                              justifyContent: "space-between",
                                              borderRadius: "30px",
                                              alignItems: "center",
                                            }}
                                          >
                                            <div className="direct-mail-left">
                                              <p
                                                style={{
                                                  display: "flex",
                                                  gap: "5px",
                                                  alignItems: "center",
                                                  fontSize: "14px",
                                                  fontWeight: 700,
                                                }}
                                              >
                                                <FaEnvelope
                                                  style={{
                                                    width: "16px",
                                                    height: "16px",
                                                  }}
                                                />
                                                No Email
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className="card mb-0"
                                    style={{
                                      borderBottom: "1px solid #D3D3D3",
                                    }}
                                  >
                                    <div
                                      style={{
                                        padding: "20px 10px",
                                        cursor: "pointer",
                                      }}
                                      id="headingSix"
                                    >
                                      <h5 className="m-0 position-relative">
                                        <a
                                          className="custom-accordion-title text-reset d-block"
                                          data-bs-toggle="collapse"
                                          aria-expanded={
                                            accordion.accordion2
                                              ? "true"
                                              : "false"
                                          }
                                          aria-controls="Phones"
                                          onClick={() =>
                                            setAccordion({
                                              accordion2: !accordion.accordion2,
                                            })
                                          }
                                          style={{
                                            fontSize: "14px",
                                          }}
                                        >
                                          <Phone
                                            style={{
                                              marginRight: "5px",
                                              width: "20px",
                                              height: "20px",
                                            }}
                                          />
                                          Phones{" "}
                                          {accordion.accordion2 ? (
                                            <BiChevronDown className="accordion-arrow" />
                                          ) : (
                                            <MdChevronRight className="accordion-arrow" />
                                          )}
                                        </a>
                                      </h5>
                                    </div>

                                    <div
                                      id="Phones"
                                      className={
                                        "collapse" +
                                        (accordion.accordion2 ? "show" : "")
                                      }
                                      aria-labelledby="headingFour"
                                      data-bs-parent="#custom-accordion-one"
                                      style={{
                                        padding: "10px",
                                        marginTop: "-10px",
                                      }}
                                    >
                                      {(!phone === "" || !phone !== null) &&
                                        phone && (
                                          <div
                                            className=""
                                            style={{
                                              backgroundColor: "#fffff",
                                              display: "flex",
                                              justifyContent: "space-between",
                                              borderRadius: "30px",
                                              alignItems: "center",
                                            }}
                                          >
                                            <div
                                              className="direct-mail-left"
                                              style={{
                                                display: "flex",
                                                gap: "5px",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Verified
                                                sx={{
                                                  fontSize: "18px",
                                                  color: "#69B3FF",
                                                }}
                                              />{" "}
                                              <p
                                                style={{
                                                  display: "flex",
                                                  gap: "5px",
                                                  alignItems: "center",
                                                  fontSize: "14px",
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                {phone ? phone : "N/A"}
                                              </p>
                                            </div>
                                            <div className="direct-mail-right">
                                              <h6
                                                className="badge"
                                                style={{
                                                  marginTop: "10px",
                                                  whiteSpace: "nowrap",
                                                }}
                                              >
                                                <p
                                                  style={{
                                                    display: "flex",
                                                    gap: "5px",
                                                    alignItems: "center",
                                                    whiteSpace: "nowrap",
                                                    marginTop: "-10px",
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      gap: "2px",
                                                    }}
                                                  >
                                                    {country && (
                                                      <span
                                                        style={{
                                                          backgroundColor:
                                                            "#69B3FF",
                                                          padding: "5px 5px",
                                                          fontSize: "10px",
                                                          borderRadius: "10px",
                                                        }}
                                                      >
                                                        {country}
                                                      </span>
                                                    )}{" "}
                                                    {/* <span
                                                                style={{
                                                                  backgroundColor:
                                                                    phone?.type ===
                                                                    "Direct"
                                                                      ? "#38414a"
                                                                      : "#6a69ff",
                                                                  padding:
                                                                    phone?.type ===
                                                                    "Direct"
                                                                      ? "4px 5px"
                                                                      : "5px 5px",
                                                                  fontSize:
                                                                    "10px",
                                                                  borderRadius:
                                                                    phone?.type ===
                                                                    "Direct"
                                                                      ? "5px"
                                                                      : "10px",
                                                                }}
                                                              >
                                                                {phone?.type ===
                                                                "Work" ? (
                                                                  profile
                                                                    ?.company
                                                                    ?.company
                                                                ) : (
                                                                  <span
                                                                    className="badge"
                                                                    style={{
                                                                      fontSize:
                                                                        "11px",
                                                                    }}
                                                                  >
                                                                    {
                                                                      phone?.type
                                                                    }
                                                                  </span>
                                                                )}
                                                              </span> */}
                                                  </div>
                                                  {/* <span
                                                              style={{
                                                                color:
                                                                  "#343a40",
                                                                fontSize:
                                                                  "10px",
                                                                padding:
                                                                  "5px 5px",
                                                              }}
                                                            >
                                                              {copied &&
                                                              copiedEmail ===
                                                                phone.phone ? (
                                                                <FaCheckCircle
                                                                  style={{
                                                                    color:
                                                                      "green",
                                                                    width:
                                                                      "15px",
                                                                    height:
                                                                      "15px",
                                                                    cursor:
                                                                      "pointer",
                                                                  }}
                                                                />
                                                              ) : (
                                                                <FaCopy
                                                                  style={{
                                                                    color:
                                                                      "gray",
                                                                    width:
                                                                      "15px",
                                                                    height:
                                                                      "15px",
                                                                    cursor:
                                                                      "pointer",
                                                                  }}
                                                                  onClick={(
                                                                    e
                                                                  ) => {
                                                                    handleCopy(
                                                                      e,
                                                                      phone
                                                                    );
                                                                  }}
                                                                />
                                                              )}
                                                            </span> */}
                                                </p>
                                              </h6>
                                            </div>
                                          </div>
                                        )}

                                      {(phone === null || phone === "") && (
                                        <div
                                          className=""
                                          style={{
                                            backgroundColor: "#fffff",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            borderRadius: "30px",
                                            alignItems: "center",
                                          }}
                                        >
                                          <div className="direct-mail-left">
                                            <p
                                              style={{
                                                display: "flex",
                                                gap: "5px",
                                                alignItems: "center",
                                                fontSize: "14px",
                                                fontWeight: 700,
                                              }}
                                            >
                                              No Phone Number
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="lead-status">
                                <div className="lead-status-left">
                                  <h5
                                    style={{
                                      fontSize: "14px",
                                    }}
                                  >
                                    Country
                                  </h5>
                                </div>

                                <a
                                  data-bs-toggle="modal"
                                  data-bs-target="#lead-modal"
                                >
                                  <div
                                    className="added-by "
                                    style={{
                                      backgroundColor: "#fffff",
                                      padding: "0px 10px",
                                      borderRadius: "30px",
                                    }}
                                  >
                                    <h6
                                      style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                        fontSize: "14px",
                                        padding: "10px 10px",
                                      }}
                                    >
                                      {country ? country : "N/A"}
                                    </h6>
                                  </div>
                                </a>
                              </div>
                              <div className="lead-status">
                                <div className="lead-status-left">
                                  <h5
                                    style={{
                                      fontSize: "14px",
                                    }}
                                  >
                                    Plan
                                  </h5>
                                </div>
                                <a
                                  data-bs-toggle="modal"
                                  data-bs-target="#lead-modal"
                                >
                                  <div
                                    className="added-by "
                                    style={{
                                      backgroundColor: "#fffff",
                                      padding: "0px 10px",
                                      borderRadius: "30px",
                                    }}
                                  >
                                    <h6
                                      style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                        fontSize: "14px",
                                        padding: "10px 10px",
                                      }}
                                    >
                                      {planName ? planName : "N/A"}
                                    </h6>
                                  </div>
                                </a>
                              </div>
                              {/* <div
                                  className="lead-status"
                                  style={{
                                    padding: "15px 10px",
                                  }}
                                >
                                  <div className="lead-status-left">
                                    <h5
                                      style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                        fontSize: "14px",
                                      }}
                                    >
                                      <FaUserGroup />
                                      Assigned to
                                    </h5>
                                  </div>
                                  <Tooltip
                                    title={
                                      <div className="popover__content">
                                        <div className="popover-zindex">
                                          <div className="assign-tittles">
                                            <h4
                                              style={{
                                                display: "flex",
                                                gap: "10px",
                                                alignItems: "center",
                                                fontSize: "14px",
                                              }}
                                            >
                                              <FaUserGroup
                                                style={{
                                                  color: "#000",
                                                  width: "20px",
                                                  height: "20px",
                                                }}
                                              />
                                              Assigned To
                                            </h4>
                                          </div>
                                          <div className="search-name">
                                            <form className="search-bar">
                                              <div className="position-relative">
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Enter teammate name"
                                                />
                                                <span className="mdi mdi-magnify"></span>
                                              </div>
                                            </form>
                                          </div>
                                          <div className="lead-teama">
                                            <div className="form-check form-check-success lead-sucy">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value=""
                                                id="customckeck2"
                                              />
                                              <label
                                                className="form-check-label user-imf"
                                                for="customckeck2"
                                              >
                                                <img
                                                  src="assets/images/users/user-3.jpg"
                                                  width="30"
                                                  height="30"
                                                />
                                              </label>
                                              <label
                                                className="form-check-label"
                                                for="customckeck2"
                                              >
                                                Hamid Ali
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    }
                                    disableFocusListener
                                    disableTouchListener
                                    placement="bottom-start"
                                    arrow
                                    PopperProps={{
                                      modifiers: [
                                        {
                                          name: "offset",
                                          options: {
                                            offset: [-150, -14],
                                          },
                                        },
                                      ],
                                      sx: {
                                        "& .MuiTooltip-tooltip": {
                                          backgroundColor: "#fff",
                                          color: "white",
                                          boxShadow:
                                            "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                        },
                                        "& .MuiTooltip-arrow": {
                                          color: "#f4f4f4",
                                        },
                                      },
                                    }}
                                  >
                                    <a>
                                      <div className="popover__title">
                                        <p
                                          style={{
                                            display: "flex",
                                            gap: "10px",
                                            alignItems: "center",
                                            fontSize: "14px",
                                            padding: "0px 10px",
                                          }}
                                        >
                                          <FaUser
                                            style={{
                                              color: "#000",
                                              width: "15px",
                                              height: "15px",
                                            }}
                                          />
                                          Assign to teammate
                                        </p>
                                      </div>
                                    </a>{" "}
                                  </Tooltip>
                                </div> */}
                              <div className="lead-status">
                                <div className="lead-status-left">
                                  <h5
                                    style={{
                                      fontSize: "14px",
                                    }}
                                  >
                                    Credits
                                  </h5>
                                </div>

                                <a
                                  data-bs-toggle="modal"
                                  data-bs-target="#lead-modal"
                                >
                                  <div
                                    className="added-by "
                                    style={{
                                      backgroundColor: "#fffff",
                                      padding: "0px 10px",
                                      borderRadius: "30px",
                                    }}
                                  >
                                    <h6
                                      style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                        fontSize: "14px",
                                        padding: "10px 10px",
                                      }}
                                    >
                                      {credits ? credits : "N/A"}
                                    </h6>
                                  </div>
                                </a>
                              </div>
                              <div className="lead-status">
                                <div className="lead-status-left">
                                  <h5
                                    style={{
                                      fontSize: "14px",
                                    }}
                                  >
                                    Credits Used
                                  </h5>
                                </div>

                                <a
                                  data-bs-toggle="modal"
                                  data-bs-target="#lead-modal"
                                >
                                  <div
                                    className="added-by "
                                    style={{
                                      backgroundColor: "#fffff",
                                      padding: "0px 10px",
                                      borderRadius: "30px",
                                    }}
                                  >
                                    <h6
                                      style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                        fontSize: "14px",
                                        padding: "10px 10px",
                                      }}
                                    >
                                      {creditsUsed ? creditsUsed : "N/A"}
                                    </h6>
                                  </div>
                                </a>
                              </div>
                              <div className="lead-status">
                                <div className="lead-status-left">
                                  <h5
                                    style={{
                                      fontSize: "14px",
                                    }}
                                  >
                                    SMTP
                                  </h5>
                                </div>

                                <div className="form-check form-switch">
                                  <input
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    type="checkbox"
                                    className="form-check-input"
                                    id="customSwitch1"
                                    checked={SMTP === "Active" ? true : false}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      if (
                                        checked === true ||
                                        checked === false
                                      ) {
                                        postSmtpToogle({
                                          body: {
                                            customerId: customerId,
                                            smtp:
                                              checked === true
                                                ? "Active"
                                                : "Deactive",
                                          },
                                        })
                                          .unwrap()
                                          .then((res) => {
                                            toast.success(
                                              `SMTP for ${firstName} ${lastName} ${checked ? "enabled" : "disabled"
                                              } successfully`
                                            );
                                          })
                                          .catch((error) => {
                                            toast.error(error.data.message);
                                          });
                                      }
                                    }}
                                  />
                                  <label
                                    className="form-check-label"
                                    for="customSwitch1"
                                  >
                                    Disable/Enable
                                  </label>
                                </div>
                              </div>
                              <div className="lead-status">
                                <div className="lead-status-left">
                                  <h5
                                    style={{
                                      fontSize: "14px",
                                    }}
                                  >
                                    Date of Join
                                  </h5>
                                </div>

                                <a
                                  data-bs-toggle="modal"
                                  data-bs-target="#lead-modal"
                                >
                                  <div
                                    className="added-by "
                                    style={{
                                      backgroundColor: "#fffff",
                                      padding: "0px 10px",
                                      borderRadius: "30px",
                                    }}
                                  >
                                    <h6
                                      style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                        fontSize: "14px",
                                        padding: "10px 10px",
                                      }}
                                    >
                                      {planStartDate
                                        ? new Date(
                                          planStartDate
                                        ).toLocaleDateString()
                                        : "N/A"}
                                    </h6>
                                  </div>
                                </a>
                              </div>
                              <div className="lead-status">
                                <div className="lead-status-left">
                                  <h5
                                    style={{
                                      fontSize: "14px",
                                    }}
                                  >
                                    Plan End Date
                                  </h5>
                                </div>

                                <a
                                  data-bs-toggle="modal"
                                  data-bs-target="#lead-modal"
                                >
                                  <div
                                    className="added-by "
                                    style={{
                                      backgroundColor: "#fffff",
                                      padding: "0px 10px",
                                      borderRadius: "30px",
                                    }}
                                  >
                                    <h6
                                      style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                        fontSize: "14px",
                                        padding: "10px 10px",
                                      }}
                                    >
                                      {expirationDate
                                        ? new Date(
                                          expirationDate
                                        ).toLocaleDateString()
                                        : "N/A"}
                                    </h6>
                                  </div>
                                </a>
                              </div>{" "}
                              <div className="lead-status">
                                <div className="lead-status-left">
                                  <h5
                                    style={{
                                      fontSize: "14px",
                                    }}
                                  >
                                    Plan update Date
                                  </h5>
                                </div>

                                <a
                                  data-bs-toggle="modal"
                                  data-bs-target="#lead-modal"
                                >
                                  <div
                                    className="added-by "
                                    style={{
                                      backgroundColor: "#fffff",
                                      padding: "0px 10px",
                                      borderRadius: "30px",
                                    }}
                                  >
                                    <h6
                                      style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                        fontSize: "14px",
                                        padding: "10px 10px",
                                      }}
                                    >
                                      {updateDate
                                        ? new Date(
                                          updateDate
                                        ).toLocaleDateString()
                                        : "N/A"}
                                    </h6>
                                  </div>
                                </a>
                              </div>
                            </div>
                          )}
                          {/* {showDrawerTab === "Activity" && (
                              <div
                                className={
                                  "tab-pane" +
                                  (showDrawerTab === "Activity"
                                    ? "show active"
                                    : "")
                                }
                                id="Activity"
                              >
                                <p>
                                  Donec pede justo, fringilla vel, aliquet nec,
                                  vulputate eget, arcu. In enim justo, rhoncus
                                  ut, imperdiet a, venenatis vitae, justo.
                                  Nullam dictum felis eu pede mollis pretium.
                                  Integer tincidunt.Cras dapibus. Vivamus
                                  elementum semper nisi. Aenean vulputate
                                  eleifend tellus. Aenean leo ligula, porttitor
                                  eu, consequat vitae, eleifend ac, enim.
                                </p>
                                <p className="mb-0">
                                  Vakal text here dolor sit amet, consectetuer
                                  adipiscing elit. Aenean commodo ligula eget
                                  dolor. Aenean massa. Cum sociis natoque
                                  penatibus et magnis dis parturient montes,
                                  nascetur ridiculus mus. Donec quam felis,
                                  ultricies nec, pellentesque eu, pretium quis,
                                  sem. Nulla consequat massa quis enim.
                                </p>
                              </div>
                            )} */}
                        </div>
                      </div>
                    </div>
                    {/* <!-- end card--> */}
                  </div>
                  {/* <!-- end col --> */}
                </div>
              </div>
              {/* <!-- end offcanvas-body--> */}
            </div>
          </ClickAwayListener>
        </Drawer>

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
                    href={`${import.meta.env.VITE_JARVIS_MARKETING_HELP
                      }/about-us`}
                    target="_blank"
                  >
                    About Us
                  </a>
                  <a
                    href={`${import.meta.env.VITE_JARVIS_MARKETING_HELP
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
      </Box>
    </Stack>
  );
};

export default Customer;

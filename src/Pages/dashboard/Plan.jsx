import { People, PeopleAltOutlined } from "@mui/icons-material";
import { Button, Card, Typography } from "@mui/material";
import { Box, Container, Stack, useMediaQuery } from "@mui/system";
import React from "react";
import { FiAward, FiHome, FiUsers, FiLayers, FiAperture } from "react-icons/fi"; // Correct Feather icons import path

const Plan = ({ collapsed }) => {
  const items = [
    {
      id: 1,
      title: "PROFESSIONAL PACK",
      price: "$19",
      features: [
        "10 GB Storage",
        "500 GB Bandwidth",
        "no Domain",
        "1 User",
        "Email Support",
        "24x7 Support",
      ],
      buttonColor: true,
      backgroundColor: false,
    },
    {
      id: 2,
      title: "BUSINESS PACK",
      price: "$29",
      features: [
        "50 GB Storage",
        "900 GB Bandwidth",
        "2 Domain",
        "10 User",
        "Email Support",
        "24x7 Support",
      ],
      buttonColor: false,
      backgroundColor: true,
    },
    {
      id: 3,
      title: "ENTERPRISE PACK",
      price: "$39",
      features: [
        "100 GB Storage",
        "Unlimited Bandwidth",
        "10 Domain",
        "Unlimited User",
        "Email Support",
        "24x7 Support",
      ],
      buttonColor: true,
      backgroundColor: false,
    },
  ];

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <Box sx={{ marginTop: isSmallScreen ? 4 : 2 }}>
      <Typography variant="h6" sx={{ color: "#323a46", fontWeight: 500 }}>
        Pricing
      </Typography>

      <Stack
        spacing={2}
        sx={{
          marginTop: 2,
          alignItems: "center",
          justifyContent: "center",
          mb: 10,
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            maxWidth: 500,
            margin: "auto",
          }}
        >
          <Typography variant="h5">
            Our <span style={{ fontWeight: 500 }}>Plans</span>
          </Typography>
          <Typography variant="body1" sx={{ color: "#98a6ad", mt: 1 }}>
            We have plans and prices that fit your business perfectly. Make your
            client site a success with our products.
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {items.map((item) => (
            <Grid item xs={12} sm={6} lg={4} key={item.id}>
              <Card
                sx={{
                  padding: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: item.backgroundColor ? "#6658dd" : "#fff",
                  width: { xs: 300, sm: 320 },
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    color: item.backgroundColor ? "white" : "#323a46",
                    fontSize: 16,
                    fontWeight: 700,
                    mt: 1,
                    mb: 4,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: item.backgroundColor ? "white" : "#6658dd",
                    mb: 3,
                    px: 2,
                    py: 1,
                    borderRadius: 50,
                    backgroundColor: item.backgroundColor
                      ? "rgba(255,255,255,.1)"
                      : "rgba(102,88,221,.1)",
                  }}
                >
                  {item.title === "PROFESSIONAL PACK" ? (
                    <PeopleAltOutlined />
                  ) : item.title === "BUSINESS PACK" ? (
                    <FiAward />
                  ) : (
                    <FiAperture />
                  )}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: item.backgroundColor ? "white" : "#323a46",
                    mb: 3,
                  }}
                >
                  {item.price}
                  <span style={{ color: "#98a6ad", fontSize: 20 }}>
                    / month
                  </span>
                </Typography>
                <Stack spacing={2} sx={{ mb: 6, alignItems: "center" }}>
                  {item.features.map((feature) => (
                    <Typography
                      key={feature}
                      variant="body1"
                      sx={{
                        color: item.backgroundColor
                          ? "rgba(255,255,255,.7)"
                          : "#98a6ad",
                      }}
                    >
                      {feature}
                    </Typography>
                  ))}
                </Stack>
                <Button
                  sx={{
                    padding: "8px 30px",
                    borderRadius: "5px",
                    backgroundColor: item.buttonColor ? "#6658dd" : "#f4f7f9",
                    color: item.buttonColor ? "white" : "#323a46",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: item.buttonColor ? "#5548c1" : "#e1e7ed",
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>

      {/* Footer */}
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
    </Box>
  );
};

export default Plan;

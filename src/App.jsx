import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/Toaster";
import EmailVerifiyer from "./EmailVerifiyer";
import ForgetPassword from "./Pages/auth/ForgetPasswor";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import VerifyEmail from "./Pages/auth/verifyEmail";
import Layout from "./sections/Layout";
import store from "./store";
import PageTour from "./components/PageTour";
import AccountSetupForm from "./Pages/auth/AccountSetupForm";

function App() {
  const navigate = useNavigate();
  const [activeLead, setActiveLead] = useState(false);
  const theme = createTheme({
    palette: {
      primary: { main: "#3f51b5" },
      secondary: { main: "#f50057" },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });

  const stripePromise = loadStripe(`${import.meta.env.VITE_LIVE_STRIPE_ID}`);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("auth"));

    if (window.location.pathname === "/") {
      if (user?.result?.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/folder");
      }
    }
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <Routes>
            {/* <Route path="/" element={<SplashScreen />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
              <Route path="/accountsetupform" element={<AccountSetupForm />} />
            <Route path="/*" element={<Layout />} />
            {/* <Route path="/help" element={<Help />} />
            <Route path="/getting-start/:id" element={<GettingStarted />} /> */}
            {/* <Route
              path="/first-contact-linkedin/:id"
              element={<FirstContactLinkedin />}
            /> */}
            {/* <Route path="/bulk-enrichment" element={<BulkEnrichment />} /> */}
            {/* <Route
              path="/bulk-on-sale-navigator"
              element={<BulOnSaleNavigator />}
            /> */}
            {/* <Route path="/blog-user" element={<Blog />} />
            <Route path="/blog-details/:id" element={<BlogDetails />} /> */}
            <Route
              path="/users/:id/verification/:id"
              element={<EmailVerifiyer />}
            />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/confirm-password" element={<VerifyEmail />} />
          </Routes>
          <Toaster />
          <PageTour setActiveLead={setActiveLead} />
        </ThemeProvider>
      </ReduxProvider>
    </Elements>
  );
}

export default App;

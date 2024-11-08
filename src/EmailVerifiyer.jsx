import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useLazyVerifyEmailQuery } from "./slices/adminSlice";
import { CircularProgress } from "@mui/material";

const EmailVerifier = () => {
  const navigate = useNavigate();
  const [verifiedId, setVerifiedId] = useState(null);
  const [verifiedToken, setVerifiedToken] = useState(null);
  const [verificationCount, setVerificationCount] = useState(0);
  const [
    verifyEmail,
    { data: verifiedEmail, isSuccess, isLoading, error: verifyError, isFetching }
  ] = useLazyVerifyEmailQuery();

  useEffect(() => {
    const url = window.location.pathname;
    const urlArray = url.split("/");
    const id = urlArray[2];
    const token = urlArray[4];
    if (id && token) {
      setVerifiedId(id);
      setVerifiedToken(token);
      verifyEmail({ id, token });
      setVerificationCount(verificationCount + 1);
    }
  }, []);

  const handleVerifyTokenTryAgain = () => {
    if (verifiedId && verifiedToken) {
      verifyEmail({ id: verifiedId, token: verifiedToken });
      setVerificationCount(verificationCount + 1);
    }
  };

  // Loading state
  if (isLoading || isFetching) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  // Error state
  if (verifyError) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Email verification error occurred</p>
        <button
          style={{
            padding: "10px",
            fontSize: "20px",
            marginTop: "20px",
            backgroundColor: verificationCount >= 3 ? "#d3d3d3" : "#f2020f",
            borderRadius: "5px",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
          onClick={handleVerifyTokenTryAgain}
          disabled={verificationCount >= 3}
        >
          Try Verify again
        </button>
      </div>
    );
  }

  // Success state
  if (isSuccess && verifiedEmail) {
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px",
            alignItems: "center",
            height: "90vh",
          }}
        >
          <FaCheck style={{ fontSize: "100px", color: "green" }} />
          <h1
            style={{
              color: "green",
              fontSize: "50px",
              marginLeft: "10px",
              marginTop: "10px",
            }}
          >
            {verifiedEmail.message || "Email Verified"}
          </h1>
          <button
            style={{
              padding: "10px",
              fontSize: "20px",
              marginTop: "20px",
              backgroundColor: "#f2020f",
              borderRadius: "5px",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => navigate("/login")}
          >
            Continue to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default EmailVerifier;

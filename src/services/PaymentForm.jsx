import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  // CardPostalCodeElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Input,
} from "@mui/material";
import {
  useGetPlansMutation,
  usePostPaymentMethodMutation,
} from "../slices/customerSlice";
import toast from "react-hot-toast";

const PaymentForm = ({
  setPaymentMethod,
  openDialog,
  paymentPrice,
  showMessage,
  setShowMessage,
  planName,
  planPrice,
  planMonthlyPrice,
  planInterval,
  addingNewPaymentMethod,
  setAddingNewPaymentMethod
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [postPlan, { isLoading: postPlanLoading }] =
    usePostPaymentMethodMutation();
  const [postChooseSubscription] = useGetPlansMutation();
  const annuallyCharge = planPrice * 12;
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
    });

    if (error) {
      setError(error.message);
      return;
    } else {
      await postPlan({
        body: {
          paymentMethodId: paymentMethod.id,
          billingAddress: {
            address: event.target.address.value,
            city: event.target.city.value,
            state: event.target.state.value,
            postalCode: event.target["Postal Code"].value,
            country: event.target.country.value,
          },
        },
      })
        .unwrap()
        .then(() => {
          toast.success("Payment Method Updated Successfully");
          if (openDialog && !addingNewPaymentMethod) {
            postChooseSubscription({
              body: {
                priceId: paymentPrice,
              },
            })
              .unwrap()
              .then(() => {
                toast.success("Subscription Created Successfully");
              })
              .catch((error) => {
                toast.error("Error Creating Subscription");
              });
          }
          if (!addingNewPaymentMethod) {
            setPaymentMethod(false);
            setShowMessage(false);
          }
          setAddingNewPaymentMethod(false)
        })
        .catch((error) => {
          toast.error("Error Updating Payment Method");
        });
    }
  };

  useEffect(() => {
    if (error) {
      setInterval(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  return (
    <Card
      sx={{
        maxWidth: 500,
        mx: "auto",
        // mt: 4,
        // p: 2,
        boxShadow: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: { xs: "100%", sm: "500px" },
          maxWidth: "100%",
          // "@media (max-width: 600px)": {
          //   width: "200px",
          // },
        }}
      // show card form
      >
        <Typography
          variant="overline"
          component="ellipse"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: 600,
            color: "#424770",
            fontSize: "14px",
          }}
        >
          Add Payment Method
        </Typography>

        {showMessage && (
          <Box>
            <Typography
              variant="body1"
              gutterBottom
              sx={{
                textAlign: "center",
                color: "#424770",
                fontSize: "16px",
                fontWeight: 400,
                backgroundColor: "#f5f5f5",
                padding: 2,
                borderRadius: 1,
              }}
            >
              {planInterval === "year" ? (
                <span>
                  {`You have chosen ${planName} Annual Plan to save 20%. Instead of $${planMonthlyPrice}/Month, you agree to pay $${planPrice}/Month (Billed Annually)  which is $${planPrice}X12 = $${annuallyCharge} Up Front it will be charged 	instantly, and it will be renewed every year until cancelled.`}
                </span>
              ) : (
                <span>
                  {`You have chosen ${planName} Monthly Plan For $${planPrice} it will be charged instantly, and will be renewed every month until cancelled`}
                </span>
              )}
            </Typography>
          </Box>
        )}

        <form
          id="payment-form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Box
            id="card-element"
            sx={{
              mt: 2,
              mb: 5,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Box id="card-number-element" sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ fontSize: "16px", color: "#424770", fontWeight: 400 }}
              >
                Card Number*
              </Typography>
              <Box
                sx={{
                  border: "1px solid #cfd8dc",
                  borderRadius: 1,
                  padding: 1,
                  "&:focus-within": {
                    borderColor: "#3f51b5",
                  },
                }}
              >
                <CardNumberElement
                  options={{
                    showIcon: true,
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box
                id="card-number-element"
                sx={{
                  mb: 2,
                  flex: 1,
                }}
              >
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontSize: "16px", color: "#424770", fontWeight: 400 }}
                >
                  MM / YY*
                </Typography>
                <Box
                  sx={{
                    border: "1px solid #cfd8dc",
                    borderRadius: 1,
                    padding: 1,
                    "&:focus-within": {
                      borderColor: "#3f51b5",
                    },
                  }}
                >
                  <CardExpiryElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          padding: "20px",
                          color: "#424770",
                          "::placeholder": { color: "#aab7c4" },
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
              <Box id="cvc-element" sx={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontSize: "16px", color: "#424770", fontWeight: 400 }}
                >
                  CVC*
                </Typography>
                <Box
                  sx={{
                    border: "1px solid #cfd8dc",
                    borderRadius: 1,
                    padding: 1,
                    "&:focus-within": {
                      borderColor: "#3f51b5",
                    },
                  }}
                >
                  <CardCvcElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          padding: "20px",
                          color: "#424770",
                          "::placeholder": { color: "#aab7c4" },
                        },
                      },
                    }}
                  />
                </Box>
                {/* Address */}
              </Box>
            </Box>
            <Box id="postal-code-element" sx={{ mt: 1 }}>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ fontSize: "16px", color: "#424770", fontWeight: 400 }}
              >
                Address*
              </Typography>
              <Box
                sx={{
                  border: "1px solid #cfd8dc",
                  borderRadius: 1,
                }}
              >
                <Input
                  type="text"
                  placeholder="Enter Address"
                  sx={{
                    width: "100%",
                    padding: 1,
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                  name="address"
                  required
                />
              </Box>
            </Box>
            <Box
              display={{ xs: "block", sm: "flex" }}
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
              sx={{ width: "100%" }}
              alignItems="center"
            >
              <Box id="postal-code-element" sx={{ mt: 1, width: "100%" }}>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontSize: "16px", color: "#424770", fontWeight: 400 }}
                >
                  City*
                </Typography>
                <Box
                  sx={{
                    border: "1px solid #cfd8dc",
                    borderRadius: 1,
                    "&:focus-within": {
                      borderColor: "#3f51b5",
                    },
                  }}
                >
                  <Input
                    type="text"
                    placeholder="Enter Address"
                    sx={{
                      border: "none",
                      width: "100%",
                      padding: 1,
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                    name="city"
                    required
                  />
                </Box>
              </Box>
              <Box id="postal-code-element" sx={{ mt: 1, width: "100%" }}>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontSize: "16px", color: "#424770", fontWeight: 400 }}
                >
                  State*
                </Typography>
                <Box
                  sx={{
                    border: "1px solid #cfd8dc",
                    borderRadius: 1,
                    "&:focus-within": {
                      borderColor: "#3f51b5",
                    },
                  }}
                >
                  <Input
                    type="text"
                    placeholder="Enter Address"
                    sx={{
                      border: "none",
                      width: "100%",
                      padding: 1,
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                    name="state"
                    required
                  />
                </Box>
              </Box>
            </Box>
            <Box
              display={{ xs: "block", sm: "flex" }}
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
              sx={{ width: "100%" }}
              alignItems="center"
            >
              <Box id="postal-code-element" sx={{ mt: 2, width: "100%" }}>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontSize: "16px", color: "#424770", fontWeight: 400 }}
                >
                  Country*
                </Typography>
                <Box
                  sx={{
                    border: "1px solid #cfd8dc",
                    borderRadius: 1,
                    "&:focus-within": {
                      borderColor: "#3f51b5",
                    },
                  }}
                >
                  <Input
                    type="text"
                    placeholder="Enter Address"
                    sx={{
                      border: "none",
                      width: "100%",
                      padding: 1,
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                    name="country"
                    required
                  />
                </Box>
              </Box>
              <Box id="postal-code-element" sx={{ mt: 2, width: "100%" }}>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontSize: "16px", color: "#424770", fontWeight: 400 }}
                >
                  Postal Code
                </Typography>
                <Box
                  sx={{
                    border: "1px solid #cfd8dc",
                    borderRadius: 1,
                    "&:focus-within": {
                      borderColor: "#3f51b5",
                    },
                  }}
                >
                  <Input
                    type="text"
                    placeholder="Enter Address"
                    sx={{
                      border: "none",
                      width: "100%",
                      padding: 1,
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                    name="Postal Code"
                    required
                  />
                </Box>
              </Box>
            </Box>
            {/* <Box id="postal-code-element" sx={{ mt: 2 }}>
              <CardPostalCodeElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      padding: "20px",
                      color: "#424770",
                      "::placeholder": { color: "#aab7c4" },
                    },
                  },
                }}
              />
            </Box> */}
          </Box>
          <Button
            id="submit"
            type="submit"
            variant="contained"
            color="secondary"
            disabled={!stripe || !elements || postPlanLoading}
            fullWidth
            sx={{
              backgroundColor: "#323a46",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#323a46",
              },
            }}
          >
            ADD
          </Button>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;

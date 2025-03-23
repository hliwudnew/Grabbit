// src/Pages/CheckoutPage.js
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TextField, Button, Alert } from "@mui/material";
import "../Styles/CheckoutPage.css";
import CheckoutTile from "../Components/CheckoutTile";
// Import Stripe Elements
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function CheckoutPage() {
  const { state } = useLocation();
  const cart = state.data;
  const total = state.total; // Total in dollars

  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");

  // Example billing state; you can extend it as needed
  const [billingInfo, setBillingInfo] = useState({
    fullName: "",
    email: "",
    streetAddress: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setPaymentError("");

    try {
      // Call your payment service endpoint to create a Stripe Checkout session
      const response = await fetch("http://localhost:5004/api/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwtToken"),
        },
        body: JSON.stringify({
          title: "Order Total",
          price: total, // Backend should convert dollars to cents
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect the browser to the Stripe Checkout page
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Payment session creation failed");
      }
    } catch (error) {
      setPaymentError(error.message);
    }
    setProcessing(false);
  };

  return (
    <div className="CheckoutPage-content">
      <form className="CheckoutPage-holder" onSubmit={handleSubmit}>
        <div className="CheckoutPage-Billing">
          <h1>Billing Information</h1>
          <TextField
            style={{ marginBottom: "5%" }}
            label="Full Name"
            variant="outlined"
            sx={{ input: { color: "#685BE0" } }}
            className="account-input"
            onChange={(e) =>
              setBillingInfo({ ...billingInfo, fullName: e.target.value })
            }
          />
          <TextField
            style={{ marginBottom: "5%" }}
            label="Street Address"
            variant="outlined"
            sx={{ input: { color: "#685BE0" } }}
            className="account-input"
          />
          <TextField
            style={{ marginBottom: "5%" }}
            label="Apartment#"
            variant="outlined"
            sx={{ input: { color: "#685BE0" } }}
            className="account-input"
          />
          <TextField
            style={{ marginBottom: "5%" }}
            label="City/Town"
            variant="outlined"
            sx={{ input: { color: "#685BE0" } }}
            className="account-input"
          />
          <TextField
            style={{ marginBottom: "5%" }}
            label="Zip Code"
            variant="outlined"
            sx={{ input: { color: "#685BE0" } }}
            className="account-input"
          />
          <TextField
            style={{ marginBottom: "5%" }}
            label="Phone Number"
            variant="outlined"
            sx={{ input: { color: "#685BE0" } }}
            className="account-input"
          />
          <TextField
            style={{ marginBottom: "5%" }}
            label="Email"
            variant="outlined"
            sx={{ input: { color: "#685BE0" } }}
            className="account-input"
            onChange={(e) =>
              setBillingInfo({ ...billingInfo, email: e.target.value })
            }
          />
        </div>
        <div className="CheckoutPage-Confirm">
          <div className="CheckoutPage-items">
            {cart.map((item) => (
              <CheckoutTile key={item._id} data={item} />
            ))}
          </div>
          <div>
            <h1>Credit Card Information</h1>
          </div>
          <div className="CheckoutPage-payment">
            <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
          </div>
          <div style={{ textAlign: "left" }}>
            <hr />
            <h1>Total: ${total}</h1>
            <div style={{ textAlign: "center" }}>
              <Button
                type="submit"
                style={{ backgroundColor: "#685BE0" }}
                variant="contained"
                disabled={processing || !stripe}
              >
                {processing ? "Processing..." : "Process Order"}
              </Button>
            </div>
            {paymentError && (
              <Alert severity="error" style={{ marginTop: "10px" }}>
                {paymentError}
              </Alert>
            )}
            {paymentSuccess && (
              <Alert severity="success" style={{ marginTop: "10px" }}>
                {paymentSuccess}
              </Alert>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPage;
// src/Pages/CreateAccountPage.js
import "../Styles/CreateAccountPage.css";
import { Button, TextField, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function CreateAccountPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function requestCreate() {
    try {
      const response = await fetch("http://localhost:5002/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        setErrorMsg(json.message || "Error creating account");
        console.error("Error creating account:", json);
        return;
      }
      console.log("Response:", json);
      // After successful registration, redirect to the onboarding page.
      // Pass the user object (which includes stripeAccountId) via state or store it globally.
      navigate("/onboarding", { state: { user: json } });
    } catch (error) {
      console.error("Request failed:", error);
      setErrorMsg("Request failed. Please try again.");
    }
  }

  return (
    <div className="CreateAccountPage-content">
      <div className="CreateAccountPage-holder">
        <div style={{ textAlign: "left" }}>
          <h1>Create Account</h1>
        </div>
        <div className="CreateAccountPage-inputs">
          <TextField
            label="Email"
            variant="outlined"
            sx={{ input: { color: "#685BE0" } }}
            className="account-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Username"
            variant="outlined"
            sx={{ input: { color: "#685BE0" } }}
            className="account-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            sx={{ input: { color: "#685BE0" } }}
            className="account-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={requestCreate}
            style={{ backgroundColor: "#685BE0", width: "50%" }}
            variant="contained"
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountPage;
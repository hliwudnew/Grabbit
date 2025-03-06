import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import "../Styles/LoginPage.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const requestLogin = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // You can also add an Accept header if needed:
          // "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", errorData.message);
        return;
      }

      const json = await response.json();
      console.log("Response:", json);
      
      // Save the token to localStorage so you can use it for authenticated requests
      localStorage.setItem("jwtToken", json.token);

      // Navigate to the account page upon successful login
      navigate("/account");
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  return ( 
    <div className="LoginPage-content">
      <div className="LoginPage-holder">
        <div style={{ textAlign: "left" }}>
          <h1>Login</h1>
        </div>
        <div className="LoginPage-inputs">
          <TextField 
            label="Email" 
            variant="outlined" 
            sx={{ input: { color: "#685BE0" } }} 
            className="account-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div>
          <Button 
            onClick={requestLogin}
            style={{ backgroundColor: "#685BE0", width: "50%" }} 
            variant="contained"
          >
            Login
          </Button>
        </div>
        <div>
          <p>Don't have an account? <a href="/create-account">Create one here!</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
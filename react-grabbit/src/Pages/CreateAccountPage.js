// src/Pages/CreateAccountPage.js
import React, { useState } from 'react';
import { Button, TextField, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../Styles/CreateAccountPage.css";

function CreateAccountPage({callBack,setWatch,setWatchIcon}){
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  /* 
  #######################
  Creating Account
  #######################
  */
  async function requestCreate() {
    try {
      const response = await fetch("http://localhost:5002/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
  
      const json = await response.json();
      if (!response.ok) {
        setErrorMsg(json.message || "Error creating account");
        console.error("Error creating account:", json);
        return;
      }
      // Save the token and user data
      localStorage.setItem("jwtToken", json.token);
      localStorage.setItem("user", JSON.stringify(json));
      
      // Redirect to Stripe onboarding if stripeAccountId is present
      if (json.stripeAccountId) {
        // Assuming you have a route for '/onboarding' in your React Router
        navigate(`/onboarding?accountId=${json.stripeAccountId}`);
      } else {
        navigate("/account");
      }

      requestCreateWatchlist(json.token);
    } catch (error) {
      console.error("Request failed:", error);
      setErrorMsg("Request failed. Please try again.");
    }
  };

  async function requestCreateWatchlist(token){
    try{
      const response = await fetch("http://localhost:5002/api/watchlists/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Watchlist Fetch failed:", errorData.message);
        return;
      }

      const json = await response.json();
      requestLogin(token)
    }
    catch(error){
      console.error("Request failed:", error);
    }
  }
  
  /* 
  #######################
  Logging IN 
  #######################
  */

  const requestLogin = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", errorData.message);
        return;
      }

      const json = await response.json();
      //console.log("Response:", json);
      
      // Save the token to localStorage
      localStorage.setItem("jwtToken", json.token);

      // Fetch the profile to get full user info and then store it
      requestWatchlist(json.token)
      requestProfile(json.token);
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  async function requestProfile(token) {
    try {
      const response = await fetch("http://localhost:5002/api/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Profile Fetch failed:", errorData.message);
        return;
      }

      const json = await response.json();
      //console.log("Profile response:", json);

      // Save user data in localStorage as well as update parent state
      localStorage.setItem("user", JSON.stringify(json));
      //navigate("/account");
      callBack(json);
    } catch (error) {
      console.error("Request failed:", error);
    }
  }

  async function requestWatchlist(token){
    try{
      const response = await fetch("http://localhost:5002/api/watchlists/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Watchlist Fetch failed:", errorData.message);
        return;
      }

      const json = await response.json();
      requestWatchlistItems(json.items)
    }
    catch(error){
      console.error("Request failed:", error);
    }
  }

  async function requestWatchlistItems(items){
    try{
      const response = await fetch("http://localhost:5003/api/items/many", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
          itemIDs:items
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Watchlist Fetch failed:", errorData.message);
        return;
      }

      const json = await response.json();
      //console.log("WatchList:", json);
      setWatch(json);
      setWatchIcon(json.length);
    }
    catch(error){
      console.error("Request failed:", error);
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="account-input"
          />
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="account-input"
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="account-input"
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
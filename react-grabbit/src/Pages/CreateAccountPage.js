import "../Styles/CreateAccountPage.css";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function CreateAccountPage({callBack,setWatch,setWatchIcon}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  /* 
  #######################
  Creating Account
  #######################
  */
  const requestCreate = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Accept": "application/json"
        },
        body: JSON.stringify({
          username: user,
          email: email,
          password: password,
        }),
      });

      const json = await response.json();
      console.log("Response:", json);

      if (response.ok) {
        // Registration was successful
        // Optionally store the token from json.token, e.g.:
        // localStorage.setItem("jwtToken", json.token);
        requestCreateWatchlist(json.token)
      } else {
        // Handle errors from the server (e.g., validation errors)
        console.error("Error creating account:", json);
      }
    } catch (error) {
      console.error("Request failed:", error);
      // Optionally display an error message on the UI
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
      navigate("/account");
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
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            sx={{ input: { color: "#685BE0" } }}
            className="account-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
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
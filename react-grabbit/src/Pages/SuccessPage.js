// src/Pages/SuccessPage.js
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "../Styles/SuccessPage.css";
function SuccessPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Processing your purchase...");

  useEffect(() => {
    // Parse query parameters
    const query = new URLSearchParams(search);
    const sessionId = query.get("session_id");
    const itemId = query.get("itemId");

    if (!sessionId || !itemId) {
      setMessage("Missing session or item information.");
      return;
    }

    // Optionally, you can verify the session with your payment service here.
    // For now, we assume that reaching the success page means payment succeeded.

    // Mark the item as purchased by calling your item service endpoint
    fetch(`http://localhost:5003/api/items/${itemId}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Failed to mark item as purchased.");
          });
        }
        return response.json();
      })
      .then((data) => {
        setMessage("Purchase successful! Your item has been marked as purchased.");
      })
      .catch((error) => {
        console.error("Error marking purchase:", error);
        setMessage("Error marking purchase: " + error.message);
      });
  }, [search]);

  var imageUrl = "https://images.unsplash.com/photo-1587491273677-be8b7c944cd2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="SuccessPage-container">
      <img style={{width:"50%",height:"50%"}} src={imageUrl}></img>
      <h1>{message}</h1>
      <Button style={{ backgroundColor: "#685BE0"}} variant="contained" onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </div>
  );
}

export default SuccessPage;
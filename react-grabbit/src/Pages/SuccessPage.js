// src/Pages/SuccessPage.js
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

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

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{message}</h1>
      <Button variant="contained" onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </div>
  );
}

export default SuccessPage;
// src/Components/StripeOnboarding.js
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import "../Styles/StripeOnboarding.css";
import CircularProgress from '@mui/material/CircularProgress';

function StripeOnboarding() {
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get("accountId");

  useEffect(() => {
    async function onboard() {
      if (!accountId) {
        console.error("No account ID provided for onboarding");
        return;
      }
      try {
        const response = await fetch("http://localhost:5004/api/account-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ account: accountId })
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("No onboarding URL received", data);
        }
      } catch (error) {
        console.error("Error during Stripe onboarding:", error);
      }
    }
    onboard();
  }, [accountId]);

  var imageUrl ="https://images.unsplash.com/photo-1589933767411-38a58367efd7?q=80&w=2058&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  return (
    <div className='StripeOnboarding-container'>
      <img style={{width:"25%",height:"10%"}} src={imageUrl}></img>
      <p>Redirecting to Stripe onboarding...</p>
      <CircularProgress sx={{color:"#685BE0"}}/>  
    </div>
  );
}

export default StripeOnboarding;
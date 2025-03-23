// src/Pages/SuccessPage.js
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert } from '@mui/material';

function SuccessPage() {
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("itemId");

  useEffect(() => {
    if (itemId) {
      // Call the item service endpoint to mark the item as purchased
      fetch(`http://localhost:5003/api/items/${itemId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
        },
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(json => Promise.reject(json));
          }
          return res.json();
        })
        .then(data => {
          console.log('Item marked as purchased:', data);
        })
        .catch(error => {
          console.error('Error marking item as purchased:', error);
        });
    }
  }, [itemId]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Payment Successful!</h1>
      <Alert severity="success">
        Your payment was processed successfully. Your item has been marked as purchased.
      </Alert>
    </div>
  );
}

export default SuccessPage;
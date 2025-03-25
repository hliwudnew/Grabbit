// src/Pages/SuccessPage.js
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function SuccessPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Processing your purchase...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(search);
    const sessionId = query.get('session_id');
    const itemId = query.get('itemId');

    if (!itemId) {
      setMessage('No item specified.');
      setLoading(false);
      return;
    }

    // Call the purchase endpoint on your item service
    // This endpoint should mark the item as purchased using the buyer's token.
    fetch(`http://localhost:5003/api/items/${itemId}/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Make sure the user is logged in so that jwtToken is in localStorage.
        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to mark item as purchased.');
        }
        return res.json();
      })
      .then((data) => {
        setMessage('Purchase successful! Your item has been marked as purchased.');
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error marking purchase:", error);
        setMessage('Error marking purchase: ' + error.message);
        setLoading(false);
      });
  }, [search]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>{message}</h1>
      {!loading && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
          style={{ marginTop: '1rem' }}
        >
          Back to Home
        </Button>
      )}
    </div>
  );
}

export default SuccessPage;
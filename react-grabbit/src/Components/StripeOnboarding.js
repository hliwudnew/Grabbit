// src/Components/StripeOnboarding.js
import React, { useEffect, useState } from 'react';
import { Alert, Button } from '@mui/material';

function StripeOnboarding({ stripeAccountId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleOnboard = async () => {
    try {
      const response = await fetch('http://localhost:5004/api/account-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: stripeAccountId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account link');
      }
      // Redirect to Stripe-hosted onboarding page
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stripeAccountId) {
      handleOnboard();
    } else {
      setError('No Stripe account ID provided.');
      setLoading(false);
    }
  }, [stripeAccountId]);

  return (
    <div>
      {loading && <p>Redirecting to Stripe onboarding...</p>}
      {error && (
        <>
          <Alert severity="error">{error}</Alert>
          <Button variant="contained" onClick={handleOnboard}>
            Try Again
          </Button>
        </>
      )}
    </div>
  );
}

export default StripeOnboarding;
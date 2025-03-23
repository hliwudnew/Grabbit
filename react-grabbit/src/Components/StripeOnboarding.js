// src/Components/StripeOnboarding.js
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

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

  return (
    <div>
      <p>Redirecting to Stripe onboarding...</p>
    </div>
  );
}

export default StripeOnboarding;
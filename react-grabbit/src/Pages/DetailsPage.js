// DetailsPage.js
import { Button } from "@mui/material";
import "../Styles/DetailsPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { useState, useContext } from "react";
import Avatar from '@mui/material/Avatar';
import { EditWatchlist, Watchlist, EditWatchBadge } from "../App.js";
import ContactSeller from "../Modals/ContactSeller.js";

function DetailsPage({ user }) {
  const navigate = useNavigate();
  const watch = useContext(Watchlist);
  const setWatch = useContext(EditWatchlist);
  const editBadge = useContext(EditWatchBadge);
  const [open, setOpen] = useState(false);
  const { state } = useLocation();
  const item = state.data;
  const [added, setAdded] = useState(false);

  const imageUrl = item.imageUrl 
    ? `http://localhost:5003${item.imageUrl}` 
    : "https://via.placeholder.com/150";

  function handleAdded() {
    // Call any API to add to watchlist if needed
    setAdded(true);
    setWatch([...watch, item]);
    editBadge(watch.length + 1);
  }

  function handlePurchase() {
    console.log("Send to stripe API");
    console.log("Item name:", item.title);
    console.log("Item cost:", item.price);
    console.log("Seller object:", item.seller);

    // Make sure the seller object includes stripeAccountId
    if (!item.seller.stripeAccountId) {
      console.error("Seller stripe account not set on this item.");
      return;
    }

    try {
      fetch("http://localhost:5004/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          price: item.price,
          itemId: item._id,
          sellerAccount: item.seller.stripeAccountId  // Pass seller's stripe account ID
        }),
      })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(json => Promise.reject(json));
        }
        return res.json();
      })
      .then(({ url }) => {
        window.location.href = url;
      })
      .catch((e) => {
        console.error(e.error);
      });
    } catch (error) {
      console.error("Payment request failed:", error);
    }
  }

  function stringToHslColor(string, saturation, lightness) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = hash % 360;
    return `hsl(${hash}, ${saturation}%, ${lightness}%)`;
  }

  return (
    <div className="DetailsPage-container">
      <div className="DetailsPage-holder">
        <div className="DetailsPage-Img-holder">
          <img className="DetailsPage-Img" src={imageUrl} alt="item" />
        </div>
        <div className="DetailsPage-description">
          <h1>{item.title}</h1>
          <hr />
          <h4>Key Details</h4>
          <ul>
            <li>Condition: {item.condition}</li>
            <li>Delivery: {item.delivery}</li>
          </ul>
          <h2>Description</h2>
          <p>{item.description}</p>
        </div>
        <div className="DetailsPage-order">
          <Avatar style={{ backgroundColor: stringToHslColor(item.seller ? item.seller.username : "Default", 40, 60) }}>
            {item.seller ? item.seller.username.substring(0, 1) : "A"}
          </Avatar>
          <p>Sold by {item.seller ? item.seller.username : "Unknown"}</p>
          <h2>${item.price}</h2>
          <p>Shipping: $5 international or Free local</p>
          {user ? (
            user._id !== item.seller._id ? (
              <>
                {item.delivery !== "in-person" ? (
                  <Button onClick={handlePurchase} style={{ backgroundColor: "#685BE0", margin: "5%" }} variant="contained">
                    Purchase
                  </Button>
                ) : (
                  <>
                    <ContactSeller 
                      receiverID={item.seller._id} 
                      senderName={user.username} 
                      receiverName={item.seller.username}  
                      open={open} 
                      close={() => setOpen(false)} 
                    />
                    <Button onClick={() => setOpen(true)} style={{ backgroundColor: "#685BE0", margin: "5%" }} variant="contained">
                      Contact Seller
                    </Button>
                  </>
                )}
                {added ? (
                  <Alert style={{ marginBottom: "5%" }} icon={<CheckIcon fontSize="inherit" />} severity="success">
                    Added to Your Watchlist
                  </Alert>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Button onClick={handleAdded} style={{ backgroundColor: "#685BE0", margin: "5%" }} variant="contained">
                      Add to Watchlist
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>This is your own listing! Hope someone buys it!</p>
            )
          ) : (
            <Button onClick={() => navigate("/login")} style={{ backgroundColor: "#685BE0", color: "white" }}>
              Login to Purchase
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;
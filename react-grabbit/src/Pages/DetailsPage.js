// DetailsPage.js
import { Button } from "@mui/material";
import "../Styles/DetailsPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { useState, useContext, useEffect } from "react";
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
    requestAddToWatchlist();
    setAdded(true);
    setWatch([...watch, item]);
    editBadge(watch.length + 1);
  }

  //Runs each page refresh on the page
  //Makes sure no dupe of wishlists
  useEffect(() =>{
      checkInWatch()    
  })


  function checkInWatch(){
      //Implment to check if the vehicle is already in cart, if so dont let them put it in cart
      for(let i =0; i< watch.length; i++){
          if(watch[i]._id === item._id){
              setAdded(true)
          }
      }
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

  async function handleRemoveLisiting() {
    console.log("Remove from database");
  }

  async function requestAddToWatchlist() {
    try{
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("http://localhost:5002/api/watchlists/add",{
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body:JSON.stringify({
              itemID:item._id
          }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error("Add Vehicle Fetch failed:", errorData.message);
          return;
      }
  
      const json = await response.json();
    }
    catch(error){
      console.error("Request failed:", error);
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
                //Add the remove your own listing here
                <Button onClick={handleRemoveLisiting} style={{backgroundColor:"#685BE0", margin:"5%"}} variant="contained">
                  Remove Listing
                </Button>
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
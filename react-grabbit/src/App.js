// src/App.js
import './Styles/App.css';
import { Routes, Route } from 'react-router-dom';
import React, { useEffect, useState, createContext } from 'react';
import HomePage from './Pages/HomePage.js';
import ErrorPage from './Pages/ErrorPage.js';
import CartPage from './Pages/CartPage.js';
import AccountPage from './Pages/AccountPage.js';
import ListingsPage from './Pages/ListingsPage.js';
import CheckoutPage from './Pages/CheckoutPage.js';
import MyListingsPage from './Pages/MyListingsPage.js';
import TaskBar from './Components/TaskBar.js';
import Footer from './Components/Footer.js';
import LoginPage from './Pages/LoginPage.js';
import CreateAccountPage from './Pages/CreateAccountPage.js';
import NotificationsPage from './Pages/NotificationsPage.js';
import MessagesPage from './Pages/MessagesPage.js';
import DetailsPage from './Pages/DetailsPage.js';
import PostPage from './Pages/PostPage.js';
import StripeOnboarding from "./Components/StripeOnboarding";
import SuccessPage from './Pages/SuccessPage';


export const Watchlist = createContext();
export const EditWatchlist = createContext();
export const EditWatchBadge = createContext();

function App() {
  const [watch, setWatch] = useState([]);
  const [watchIcon, setWatchIcon] = useState(0);
  const [user, setUser] = useState(null);

  // Check for stored JWT token and load user profile if available
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      requestProfile(token);
      requestWatchlist(token);
    }
  }, []);

  async function requestProfile(token) {
    try {
      const response = await fetch("http://localhost:5002/api/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Profile fetch failed:", errorData.message);
        return;
      }
      const json = await response.json();
      console.log("Profile response:", json);
      setUser(json);
      // Also store the full user info for later use
      localStorage.setItem("user", JSON.stringify(json));
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
      //console.log(json);
      requestWatchlistItems(json.items)
    }
    catch(error){
      console.error("Request failed:", error);
    }
  }

  async function requestWatchlistItems(items){
    try{
      //console.log("Watch List Item IDs",items)
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
    <div className="main-container">
      <TaskBar user={user} cartIcon={watchIcon} />
      <Watchlist.Provider value={watch}>
        <EditWatchlist.Provider value={setWatch}>
          <EditWatchBadge.Provider value={setWatchIcon}>
            <Routes>
              <Route path="/" element={<HomePage/>} />
              <Route path="/cart" element={<CartPage user={user}/>}/>
              <Route path="/checkout" element={<CheckoutPage/>}/>
              <Route path="/account" element={<AccountPage user={user} callBack={setUser}/>}/>
              <Route path ="/listings" element={<ListingsPage userCheck={user}/>}/>
              <Route path ="/login" element={<LoginPage callBack={setUser} setWatch={setWatch} setWatchIcon={setWatchIcon}/>}/>
              <Route path="/my-listings" element={<MyListingsPage userCheck={user}/>}/>
              <Route path ="/create-account" element={<CreateAccountPage callBack={setUser} setWatch={setWatch} setWatchIcon={setWatchIcon}/>}/>
              <Route path ="/notifications" element={<NotificationsPage/>}/>
              <Route path ="/messages" element={<MessagesPage user={user}/>}/>
              <Route path = "/details" element={<DetailsPage user={user}/>}/>
              <Route path ="/create" element={<PostPage/>}/>
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/onboarding" element={<StripeOnboarding />} />
              <Route path="/*" element={<ErrorPage/>}/>
            </Routes>
          </EditWatchBadge.Provider>
        </EditWatchlist.Provider>
      </Watchlist.Provider>
      <Footer />
    </div>
  );
}

export default App;
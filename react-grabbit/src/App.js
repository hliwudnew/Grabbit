import './Styles/App.css';
import {Routes, Route} from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import HomePage from './Pages/HomePage.js';
import ErrorPage from './Pages/ErrorPage.js';
import CartPage from './Pages/CartPage.js';
import AccountPage from './Pages/AccountPage.js';
import ListingsPage from './Pages/ListingsPage.js';
import CheckoutPage from './Pages/CheckoutPage.js';
import TaskBar from './Components/TaskBar.js';
import Footer from './Components/Footer.js';
import LoginPage from './Pages/LoginPage.js';
import CreateAccountPage from './Pages/CreateAccountPage.js';
import NotificationsPage from './Pages/NotificationsPage.js';
import MessagesPage from './Pages/MessagesPage.js';
import DetailsPage from './Pages/DetailsPage.js';
import PostPage from './Pages/PostPage.js';
import { createContext } from 'react';

export const Watchlist = createContext();
export const EditWatchlist = createContext();
export const EditWatchBadge = createContext();

function App() {

  const [watch,setWatch] = useState([]);
  const [watchIcon,setWatchIcon] = useState(0);

  return (
    <div className="main-container">
      <TaskBar cartIcon={watchIcon}/>
      <Watchlist.Provider value={watch}>
      <EditWatchlist.Provider value={setWatch}>
      <EditWatchBadge.Provider value={setWatchIcon}>
      <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/cart" element={<CartPage/>}/>
          <Route path="/checkout" element={<CheckoutPage/>}/>
          <Route path="/account" element={<AccountPage/>}/>
          <Route path ="/listings" element={<ListingsPage/>}/>
          <Route path ="/login" element={<LoginPage/>}/>
          <Route path ="/create-account" element={<CreateAccountPage/>}/>
          <Route path ="/notifications" element={<NotificationsPage/>}/>
          <Route path ="/messages" element={<MessagesPage/>}/>
          <Route path = "/details" element={<DetailsPage/>}/>
          <Route path ="/create" element={<PostPage/>}/>
          <Route path="/*" element={<ErrorPage/>}/>
      </Routes>
      </EditWatchBadge.Provider>
      </EditWatchlist.Provider>
      </Watchlist.Provider>
      <Footer/>
    </div>
  );
}

export default App;

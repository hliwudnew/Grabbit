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

var cart = [];

function App() {

  //Item to add to cart
  const [item,setItem] = useState();
  const [cartIcon,setCartIcon] = useState(0);

  //Used to prevent running on render
  const isMounted = useRef(false);

  //Updates the cart + icon
  useEffect(() => {
    if(!isMounted.current){
      isMounted.current = true;
      return;
    }
    setCartIcon(cartIcon + 1);
    cart.push(item);
  },[item]);

  return (
    <div className="main-container">
      <TaskBar cartIcon={cartIcon}/>
      <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/cart" element={<CartPage cart={cart}/>}/>
          <Route path="/checkout" element={<CheckoutPage/>}/>
          <Route path="/account" element={<AccountPage/>}/>
          <Route path ="/listings" element={<ListingsPage/>}/>
          <Route path ="/login" element={<LoginPage/>}/>
          <Route path ="/create-account" element={<CreateAccountPage/>}/>
          <Route path ="/notifications" element={<NotificationsPage/>}/>
          <Route path ="/messages" element={<MessagesPage/>}/>
          <Route path = "/details" element={<DetailsPage cartCall={setItem}/>}/>
          <Route path="/*" element={<ErrorPage/>} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;

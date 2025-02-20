import './Styles/App.css';
import {Routes, Route} from 'react-router-dom';
import React from 'react';
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

function App() {
  return (
    <div className="main-container">
      <TaskBar/>
      <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/cart" element={<CartPage/>}/>
          <Route path="/checkout" element={<CheckoutPage/>}/>
          <Route path="/account" element={<AccountPage/>}/>
          <Route path ="/listings" element={<ListingsPage/>}/>
          <Route path ="/login" element={<LoginPage/>}/>
          <Route path ="/create-account" element={<CreateAccountPage/>}/>
          <Route path ="/notifications" element={<NotificationsPage/>}/>
          <Route path="/*" element={<ErrorPage/>} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;

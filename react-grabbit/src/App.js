import './Styles/App.css';
import {Routes, Route} from 'react-router-dom';
import React from 'react';
import HomePage from './Pages/HomePage';
import ErrorPage from './Pages/ErrorPage';

function App() {
  return (
    <div className="main-container">
      <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/*" element={<ErrorPage/>} />
      </Routes>
    </div>
  );
}

export default App;

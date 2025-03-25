import * as React from 'react';
import PropTypes, { func } from 'prop-types';
import { Tabs,Tab, Button, TextField } from "@mui/material";
import Box from '@mui/material/Box';
import { useEffect, useState, useRef } from 'react';
import "../Styles/AccountTabs.css";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({user}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function handlePasswordChanges(){
    if(newPassword === newPassword2){
      const token = localStorage.getItem("jwtToken");
      requestPasswordChange(token)
      setCurPassword("");
      setNewPassword("");
      setNewPassword2("");
    }
    else{
      console.log("New Passwords do not match!");
    }
  }

  async function requestPasswordChange(token){
    try{
      const response = await fetch("http://localhost:5002/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body:JSON.stringify({
          oldPassword: curPassword,
          newPassword: newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("New Password Fetch failed:", errorData.message);
        return;
      }

      const json = await response.json();
      console.log("Password Changed:", json);
    }
    catch(error){
      console.error("Request failed:", error);
    }
  }

  const [curPassword,setCurPassword] = useState();
  const [newPassword,setNewPassword] = useState();
  const [newPassword2,setNewPassword2] = useState();

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' ,justifyContent:"center",display:"flex"}}>
        <Tabs TabIndicatorProps={{sx:{backgroundColor:"#685BE0",height:2}}} value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab  style={{color:"#685BE0"}} label="Account Info" {...a11yProps(0)} />
          <Tab style={{color:"#685BE0"}} label="Shipping Info" {...a11yProps(1)} />
          {/* <Tab style={{color:"#685BE0"}} label="Payment Info" {...a11yProps(2)} /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div className='AccountInfo-container'>
            <div className='AccountInfo-inputs'>
              <div>
                <h3>Username</h3>
                <TextField value={user? user.username :""} disabled={true} sx={{ input: { color: '#685BE0' } }} className='account-input' style={{width:"100%"}}/>
              </div>
              <div>
                <h3>Email Address</h3>
                <TextField value={user? user.email :""} disabled={true} sx={{ input: { color: '#685BE0' } }} className='account-input' style={{width:"100%"}}/>
              </div>
            </div>
            <div className='AccountInfo-password'>
                <h3>Password Changes</h3>
                <TextField type="password" value={curPassword} onChange={(e) => (setCurPassword(e.target.value))} sx={{ input: { color: '#685BE0' } }} className='account-input' label="Current Password"/>
                <TextField type="password" value={newPassword} onChange={(e) => (setNewPassword(e.target.value))} sx={{ input: { color: '#685BE0' } }} className='account-input' label ="New Password"/>
                <TextField type="password" value={newPassword2} onChange={(e) => (setNewPassword2(e.target.value))} sx={{ input: { color: '#685BE0' } }} className='account-input' label ="Confirm New Password"/>
            </div>
        </div>
        <Button onClick={handlePasswordChanges} style={{backgroundColor:"#685BE0",marginTop:"1%"}} variant='contained'>Save Changes</Button>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div className='ShippingInfo-container'>
            <div className='ShippingInfo-inputs'> 
              <div>
                <h3>Street Address</h3>
                <TextField sx={{ input: { color: '#685BE0' } }} className='account-input' style={{width:"100%"}}/>
              </div>
              <div>
                <h3>Apartment# (Optional)</h3>
                <TextField sx={{ input: { color: '#685BE0' } }} className='account-input' style={{width:"100%"}}/>
              </div>
              <div>
                <h3>City/Town</h3>
                <TextField sx={{ input: { color: '#685BE0' } }} className='account-input' style={{width:"100%"}}/>
              </div>
              <div>
                <h3>Zip</h3>
                <TextField sx={{ input: { color: '#685BE0' } }} className='account-input' style={{width:"100%"}}/>
              </div>
              <div>
                <h3>Phone Number</h3>
                <TextField sx={{ input: { color: '#685BE0' } }} className='account-input' style={{width:"100%"}}/>
              </div>
            </div>
            <Button style={{backgroundColor:"#685BE0",marginTop:"1%"}} variant='contained'>Save Changes</Button>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <div className='PaymentInfo-container'>
            <div className='PaymentInfo-inputs'> 
                <h3>DebitCard</h3>
                <TextField sx={{ input: { color: '#685BE0' } }} className='account-input' defaultValue="1234 **** **** ****"/>
                <h3>Creditcard</h3>
                <TextField sx={{ input: { color: '#685BE0' } }} className='account-input' defaultValue="1234 **** **** ****"/>
            </div>
            <Button style={{backgroundColor:"#685BE0",marginTop:"1%"}} variant='contained'>Save Changes</Button>
        </div>
      </CustomTabPanel>
    </Box>
  );
}
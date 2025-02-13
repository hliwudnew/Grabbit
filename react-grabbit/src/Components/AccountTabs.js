import * as React from 'react';
import PropTypes from 'prop-types';
import { Tabs,Tab, Button, TextField } from "@mui/material";
import Box from '@mui/material/Box';
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

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' ,justifyContent:"center",display:"flex"}}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Account Info" {...a11yProps(0)} />
          <Tab label="Shipping Info" {...a11yProps(1)} />
          <Tab label="Payment Info" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div className='AccountInfo-container'>
            <div className='AccountInfo-inputs'>
              <div>
                <h3>First Name</h3>
                <TextField style={{width:"100%"}}/>
              </div>
              <div>
                <h3>Last Name</h3>
                <TextField style={{width:"100%"}}/>
              </div>
              <div>
                <h3>Email Address</h3>
                <TextField style={{width:"100%"}}/>
              </div>
            </div>
            <div className='AccountInfo-password'>
                <h3>Password Changes</h3>
                <TextField label="Current Password"/>
                <TextField label ="New Password"/>
                <TextField label ="Confirm New Password"/>
            </div>
        </div>
        <Button>Save Changes</Button>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div className='ShippingInfo-container'>
            <div className='ShippingInfo-inputs'> 
              <div>
                <h3>Street Address</h3>
                <TextField style={{width:"100%"}}/>
              </div>
              <div>
                <h3>Apartment# (Optional)</h3>
                <TextField style={{width:"100%"}}/>
              </div>
              <div>
                <h3>City/Town</h3>
                <TextField style={{width:"100%"}}/>
              </div>
              <div>
                <h3>Zip</h3>
                <TextField style={{width:"100%"}}/>
              </div>
              <div>
                <h3>Phone Number</h3>
                <TextField style={{width:"100%"}}/>
              </div>
            </div>
            <Button>Save Changes</Button>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <div className='PaymentInfo-container'>
            <div className='PaymentInfo-inputs'> 
                <h3>DebitCard</h3>
                <TextField defaultValue="1234 **** **** ****"/>
                <h3>Creditcard</h3>
                <TextField defaultValue="1234 **** **** ****"/>
            </div>
            <Button>Save Changes</Button>
        </div>
      </CustomTabPanel>
    </Box>
  );
}
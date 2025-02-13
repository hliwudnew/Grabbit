import "../Styles/AccountPage.css"
import { Tabs,Tab, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import * as React from 'react';
import AccountTabs from "../Components/AccountTabs.js";
function AccountPage(){

    return(
        <div className="AccountPage-content">
            <div className="AccountPage-holder">
                <AccountTabs/>
            </div>
            <p>Account Page</p>
        </div>
    );
}

export default AccountPage;
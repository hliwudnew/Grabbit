import "../Styles/AccountPage.css"
import { Tabs,Tab, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import * as React from 'react';
import AccountTabs from "../Components/AccountTabs.js";
import {useNavigate} from "react-router-dom";
function AccountPage({callBack}){
    const navigate = useNavigate();


    function handleLogout(){
        localStorage.removeItem("jwtToken");
        callBack(null)
        navigate("/login")
    }

    return(
        <div className="AccountPage-content">
            <div className="AccountPage-holder">
                <div style={{display:"flex", justifyContent:"end", paddingRight:"5%", paddingTop:"1%"}}>
                    <Button onClick={handleLogout} style={{backgroundColor:"#685BE0"}} variant="contained">Sign Out</Button>
                </div>
                <AccountTabs/>
            </div>
        </div>
    );
}

export default AccountPage;
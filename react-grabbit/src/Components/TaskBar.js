import "../Styles/TaskBar.css";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useNavigate } from "react-router-dom";

function TaskBar(){
//Hook state, for naviation
const navigate = useNavigate();

    return(
        <div className="TaskBar">
            <div className="TaskBar-content">
                <div className="TaskBar-logo">
                    <img style={{width:"5.5rem", height: "5rem", cursor:"pointer"}} onClick={() => navigate("/")} src ="./grabbit-cut.png" alt = "logo"></img>
                </div>
                <div className="TaskBar-pages">
                    <button>DropDown</button>
                    <TextField style={{width:"100%"}} variant="outlined"></TextField>
                    <Button style={{color:"black",borderColor:"black"}} variant="outlined" onClick={() => navigate("/listings")} className = "page">{<SearchIcon/>}</Button>
                </div>
                <div className="TaskBar-profile">
                    <IconButton onClick={() => navigate("/notifications")}>
                        <NotificationsIcon/>
                    </IconButton>
                    <IconButton onClick={() => navigate("/cart")}>
                        <ShoppingCartIcon/>
                    </IconButton>
                    <IconButton onClick={() => navigate("/account")}>
                        <PersonIcon/>
                    </IconButton>
                </div>
            </div>
        </div>
    );

}

export default TaskBar;
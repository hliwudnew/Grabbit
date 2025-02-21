import "../Styles/CheckoutTile.css"
import { Button } from "@mui/material";
import {useNavigate } from "react-router-dom";
import bike from "../Images/bike.jpg";
function CheckoutTile(){
//Hook state, for naviation
const navigate = useNavigate();

    return(
        <div className="CheckoutTile-content">
            <div className="CheckoutTile-holder">
                <img style={{width:"5rem", height:"5rem"}} src={bike}></img>
                <p>Cool Item Name</p>
                <p>$ 10</p>
            </div>
            <hr/>
        </div>
    );
}

export default CheckoutTile;
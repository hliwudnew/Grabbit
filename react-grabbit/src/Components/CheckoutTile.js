import "../Styles/CheckoutTile.css"
import { Button } from "@mui/material";
import {useNavigate } from "react-router-dom";
import bike from "../Images/bike.jpg";
function CheckoutTile({data: item}){
//Hook state, for naviation
const navigate = useNavigate();

    return(
        <div className="CheckoutTile-content">
            <div className="CheckoutTile-holder">
                <img style={{width:"5rem", height:"5rem"}} src={item.img}></img>
                <p>{item.name}</p>
                <p>$ {item.price}</p>
            </div>
            <hr/>
        </div>
    );
}

export default CheckoutTile;
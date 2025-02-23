import { Button } from "@mui/material";
import "../Styles/DetailsPage.css"
import {useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
function DetailsPage({cartCall}){
    //Hook state, for naviation
    const navigate = useNavigate();


    //Used to grab the data sent from the listings page, to its specific details
    const { state } = useLocation();
    const item = state.data;

    const [added,setAdded] = useState(false);
    function handleAdded(){
        setAdded(true);
        cartCall(item);
    }

    return(
        <div className="DetailsPage-container">
            <div className="DetailsPage-holder">
                <div className="DetailsPage-Img-holder">
                    <img className="DetailsPage-Img" src={item.img} alt="item"></img>
                </div>
                <div className="DetailsPage-description">
                    <h1>{item.name}</h1>
                    <hr/>
                    <h4>Key Details</h4>
                    <ul>
                        <li>Condition: {item.condition}</li>
                        <li>Delivery: {item.delivery}</li>
                    </ul>
                    <h2>Description</h2>
                    <p>{item.description}</p>
                </div>
                <div className="DetailsPage-order">
                    <Avatar sx={{ bgcolor: "red" }}>M</Avatar>
                    <p>Sold by Michael</p>
                    <h2>${item.price}</h2>
                    <p>Shipping: $5 international or Free local</p>
                    {
                        added ? 
                        <Alert style={{marginBottom:"5%"}} icon={<CheckIcon fontSize="inherit" />} severity="success">Added to Your Cart</Alert> 
                        : <Button onClick={handleAdded} style={{backgroundColor:"#685BE0"}} variant="contained">Add to Cart</Button>
                    }
                </div>
            </div>
        </div>
    );
}

export default DetailsPage;
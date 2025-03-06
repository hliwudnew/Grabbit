import { Button } from "@mui/material";
import "../Styles/DetailsPage.css"
import {useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { useContext } from "react";
import { EditWatchlist, Watchlist, EditWatchBadge } from "../App.js";
function DetailsPage(){
    //Hook state, for naviation
    const navigate = useNavigate();
    const watch = useContext(Watchlist);
    const set = useContext(EditWatchlist);
    const editBadge = useContext(EditWatchBadge);

    //Used to grab the data sent from the listings page, to its specific details
    const { state } = useLocation();
    const item = state.data;
    //Changes UI to show purchased
    const [added,setAdded] = useState(false);


    const imageUrl = item.imageUrl 
    ? `http://localhost:5003${item.imageUrl}` 
    : "https://via.placeholder.com/150";


    function handleAdded(){
        setAdded(true);
        set([...watch,item]);
        editBadge(watch.length + 1);
    }

    function handlePurchase(){
        console.log("Send to stipe API");
    }

    function stringToHslColor(string, saturation, boldness) {
        var hash = 0;
        for (var i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
    
        hash = hash % 360;
        return 'hsl('+hash+', '+saturation+'%, '+boldness+'%)';
    }

    return(
        <div className="DetailsPage-container">
            <div className="DetailsPage-holder">
                <div className="DetailsPage-Img-holder">
                    <img className="DetailsPage-Img" src={imageUrl} alt="item"></img>
                </div>
                <div className="DetailsPage-description">
                    <h1>{item.title}</h1>
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
                    <Avatar style={{backgroundColor: stringToHslColor(item.seller ? item.seller.username :"Adam Sandler" ,40,60)}}>{item.seller ? item.seller.username.substring(0,1) : "A"}</Avatar>
                    <p>Sold by {item.seller ? item.seller.username : "Adam Sandler" }</p>
                    <h2>${item.price}</h2>
                    <p>Shipping: $5 international or Free local</p>
                    <Button onClick={handlePurchase} style={{backgroundColor:"#685BE0", margin:"5%"}} variant="contained">Purchase</Button>
                    {
                        added ? 
                        <Alert style={{marginBottom:"5%"}} icon={<CheckIcon fontSize="inherit" />} severity="success">Added to Your Watchlist</Alert> 
                        : 
                        <div style={{display:"flex", flexDirection:"column"}}>
                            <Button onClick={handleAdded} style={{backgroundColor:"#685BE0", margin:"5%"}} variant="contained">Add to Watchlist</Button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default DetailsPage;
import { Button } from "@mui/material";
import "../Styles/DetailsPage.css"
import {useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from "react";

function DetailsPage({data: Item}){
    //Hook state, for naviation
    const navigate = useNavigate();

    const [added,setAdded] = useState(false);

    function handleAdded(){
        setAdded(true);
    }

    return(
        <div className="DetailsPage-container">
            <div className="DetailsPage-holder">
                <div className="DetailsPage-Img-holder">
                    <img className="DetailsPage-Img" src={"https://images.unsplash.com/photo-1631965004544-1762fc696476?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="item"></img>
                </div>
                <div className="DetailsPage-description">
                    <h1>Name</h1>
                    <hr/>
                    <h2>Description</h2>
                    <p> Blaw  Blaw  Blaw  Blaw  Blaw  Blaw  Blaw  Blaw  Blaw  Blaw  Blaw  Blaw  Blaw  Blaw  Blaw  Blaw  Blaw  Blaw  Blaw  Blaw </p>
                    <h4>Key Features</h4>
                    <ul>
                        <li>100% Water Proof</li>
                        <li>100% Water Proof</li>
                        <li>100% Water Proof</li>
                        <li>100% Water Proof</li>
                    </ul>
                </div>
                <div className="DetailsPage-order">
                    <h2>$10</h2>
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
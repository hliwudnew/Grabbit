import { Button } from "@mui/material";
import "../Styles/ErrorPage.css"
import {useNavigate } from "react-router-dom";
function ErrorPage(){
    const navigate = useNavigate();
    return(
        <div className="ErrorPage-content">
            <img style={{width:"50%", height:"50%"}} src="https://images.unsplash.com/photo-1655270740410-f91096fc6e08?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
            <h1 style={{color:"#685BE0"}}>Looks like you fell to deep into a rabbit hole!</h1>
            <Button style={{backgroundColor:"#685BE0", width:"20%"}} variant="contained" onClick={() => navigate("/")}>Back to Home</Button>
        </div>
    );
}

export default ErrorPage;
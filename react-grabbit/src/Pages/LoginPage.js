import { Button, TextField } from "@mui/material";
import "../Styles/LoginPage.css"
import { useNavigate } from "react-router-dom";
function LoginPage(){
//Hook state, for naviation
const navigate = useNavigate();

    return( 
        <div className="LoginPage-content">
            <div className="LoginPage-holder">
                <div style={{textAlign:"left"}}>
                    <h1>Login</h1>
                </div>
                <div className="LoginPage-inputs">
                    <TextField label="Email" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField label="Password" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                </div>
                <div>
                    <Button onClick={() => navigate("/account")} style={{backgroundColor:"#685BE0", width:"50%"}} variant="contained">Login</Button>
                </div>
                <div>
                    <p>Don't have an account? <a href="/create-account">Create one here!</a></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
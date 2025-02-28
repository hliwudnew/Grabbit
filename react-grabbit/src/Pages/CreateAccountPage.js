import "../Styles/CreateAccountPage.css"
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
function CreateAccountPage(){
    const navigate = useNavigate();
    return(
        <div className="CreateAccountPage-content">
            <div className="CreateAccountPage-holder">
                <div style={{textAlign:"left"}}>
                    <h1>Create Account</h1>
                </div>
                <div className="CreateAccountPage-inputs">
                    <TextField label="Email" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField label="Password" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                </div>
                <div style={{textAlign:"center"}}>
                    <Button onClick={() => navigate("/account")} style={{backgroundColor:"#685BE0", width:"50%"}} variant="contained">Create Account</Button>
                </div>
            </div>
        </div>
    );
}

export default CreateAccountPage;
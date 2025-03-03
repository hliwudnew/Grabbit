import "../Styles/CreateAccountPage.css"
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
function CreateAccountPage(){
    const navigate = useNavigate();

    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [user,setUser] = useState();

    function requestCreate(){
        try{
            fetch("http://localhost:5002/api/users/register",{
                method:"POST",
                body: JSON.stringify({
                    username:user,
                    email:email,
                    password:password,
                })}).then((response) => response.json).then((json) => {
                    console.log(json)
                }).catch((error) => {
                console.log(error)
            });
        }
        catch{

        }
        navigate("/account")
    }

    return(
        <div className="CreateAccountPage-content">
            <div className="CreateAccountPage-holder">
                <div style={{textAlign:"left"}}>
                    <h1>Create Account</h1>
                </div>
                <div className="CreateAccountPage-inputs">
                    <TextField onChange={(event, newValue) => {setEmail(event.target.value);}} label="Email" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField onChange={(event, newValue) => {setUser(event.target.value);}} label="Username" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField onChange={(event, newValue) => {setPassword(event.target.value);}} label="Password" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                </div>
                <div style={{textAlign:"center"}}>
                    <Button onClick={requestCreate} style={{backgroundColor:"#685BE0", width:"50%"}} variant="contained">Create Account</Button>
                </div>
            </div>
        </div>
    );
}

export default CreateAccountPage;
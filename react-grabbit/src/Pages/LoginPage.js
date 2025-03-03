import { Button, TextField } from "@mui/material";
import "../Styles/LoginPage.css"
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
function LoginPage({callBack}){
    //Hook state, for naviation
    const navigate = useNavigate();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();

    function requestLogin(){

        try{
            fetch("http://localhost:5002/api/users/login",{
                method:"POST",
                body: JSON.stringify({
                    email:email,
                    password:password
                })
            }).then((response) => response.json()).then((json) => {
                console.log(json)
            }).catch((error) => {
                console.log(error)
            });

            //Will need to be halted by the request when requets work
            console.log("Successful login")
            navigate("/account");
        }
        catch{

        }
    }

    return( 
        <div className="LoginPage-content">
            <div className="LoginPage-holder">
                <div style={{textAlign:"left"}}>
                    <h1>Login</h1>
                </div>
                <div className="LoginPage-inputs">
                    <TextField onChange={(event, newValue) => {setEmail(event.target.value);}}  label="Email" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField onChange={(event, newValue) => {setPassword(event.target.value);}} label="Password" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                </div>
                <div>
                    <Button onClick={requestLogin} style={{backgroundColor:"#685BE0", width:"50%"}} variant="contained">Login</Button>
                </div>
                <div>
                    <p>Don't have an account? <a href="/create-account">Create one here!</a></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
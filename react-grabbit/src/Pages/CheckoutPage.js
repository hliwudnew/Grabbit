import { TextField, Button } from "@mui/material";
import "../Styles/CheckoutPage.css"
import CheckoutTile from "../Components/CheckoutTile";
import { useLocation } from "react-router-dom";
function CheckoutPage(){

    const { state } = useLocation();
    const cart = state.data;
    const total = state.total;

    return(
        <div className="CheckoutPage-content">
            <div className="CheckoutPage-holder">
                <div className="CheckoutPage-Billing">
                    <h1>Billing Information</h1>
                    <TextField style={{marginBottom:"5%"}} label="Full Name" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField style={{marginBottom:"5%"}} label="Street Address" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField style={{marginBottom:"5%"}} label="Apartment#" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField style={{marginBottom:"5%"}} label="City/Town" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField style={{marginBottom:"5%"}} label="Zip Code" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField style={{marginBottom:"5%"}} label="Phone Number" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField style={{marginBottom:"5%"}} label="Email" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                </div>
                <div className="CheckoutPage-Confirm">
                    <div className="CheckoutPage-items">
                        {
                            cart.map((item)=>{
                                return(
                                    <CheckoutTile data={item}/>
                                )
                            })
                        }
                    </div>
                    <div>
                        <h1>Credit Card Information</h1>
                    </div>
                    <div className="CheckoutPage-payment">
                        <TextField label="Cardholder Name" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                        <TextField label="Digits" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                        <TextField label="Expiration" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                        <TextField label="CVC" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    </div>
                    <div style={{textAlign:"left"}}>
                        <hr/>
                        <h1>Total: ${total}</h1>
                        <div style={{textAlign:"center"}}>
                            <Button style={{backgroundColor:"#685BE0"}} variant="contained">Proccess Order</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
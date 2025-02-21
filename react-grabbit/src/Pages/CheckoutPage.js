import { TextField } from "@mui/material";
import "../Styles/CheckoutPage.css"
function CheckoutPage(){

    return(
        <div className="CheckoutPage-content">
            <div className="CheckoutPage-holder">
                <div className="CheckoutPage-Billing">
                    <h1>Billing Info</h1>
                    <TextField style={{marginBottom:"5%"}} label="Full Name" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField style={{marginBottom:"5%"}} label="Street Address" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField style={{marginBottom:"5%"}} label="Apartment#" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField style={{marginBottom:"5%"}} label="City/Town" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField style={{marginBottom:"5%"}} label="Zip Code" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField style={{marginBottom:"5%"}} label="Phone Number" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    <TextField style={{marginBottom:"5%"}} label="Email" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                </div>
                <div className="CheckoutPage-Confirm">
                    <p>Item</p>
                    <p>Item</p>
                    <p>Item</p>
                    <p>Item</p>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
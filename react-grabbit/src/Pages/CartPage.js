import "../Styles/CartPage.css"
import CartTile from "../Components/CartTile";
import { Button } from "@mui/material";
import {useNavigate } from "react-router-dom";

function CartPage(){
//Hook state, for naviation
const navigate = useNavigate();

    return(
        <div className="CartPage-content">
            <div className="CartPage-holder">
                <div className="CartPage-Cart">
                    <div className="CartPage-header">
                        <h1>Your Cart</h1>
                        <hr style={{display:"block",margin:"0%",backgroundColor:"#685BE0", width:"70%",borderTop:"5px solid #685BE0"}}/>
                    </div>
                    <div className="CartPage-Items">
                        <CartTile/>
                        <CartTile/>
                        <CartTile/>
                        <CartTile/>
                    </div>
                </div>
                <div className="CartPage-Summary">
                    <div style={{paddingLeft:"5%"}}>
                        <h1>Summary</h1>
                        <p>Subtotal: $10.00</p>
                        <p>Shipping & Handling: $5.00</p>
                        <p>Tax: $2.75</p>
                        <hr style={{display:"block",margin:"0%",marginTop:"5%",marginBottom:"5%",backgroundColor:"#685BE0", width:"90%",borderTop:"2px solid black"}}/>
                        <h1>Total: $17.75</h1>
                    </div>
                    <div style={{display:"flex",textAlign:"center", alignItems:"center", justifyContent:"center"}}>
                        <Button onClick={() => navigate("/checkout")} style={{backgroundColor:"#685BE0"}} variant="contained">Secure Checkout</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
import "../Styles/CartPage.css"
import CartTile from "../Components/CartTile";
import { Button } from "@mui/material";
import {useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Watchlist } from "../App.js";
function CartPage({user}){
    //Hook state, for naviation
    const navigate = useNavigate();
    const watchlist = useContext(Watchlist);

    return(
        <div className="CartPage-content">
            <div className="CartPage-holder">
                <div className="CartPage-Cart">
                    <div className="CartPage-header">
                        <h1>Your Watchlist</h1>
                        <hr style={{display:"block",margin:"0%",backgroundColor:"#685BE0", width:"70%",borderTop:"5px solid #685BE0"}}/>
                    </div>
                    <div className="CartPage-Items">
                        {
                            watchlist ?
                            watchlist.map((item)=>{
                                return(
                                    <CartTile user={user} data={item}/>
                                )
                            })
                            :
                            console.log("Nothing inside the cart")
                        }
                    </div>
                </div>
                {/* <div className="CartPage-Summary">
                    <div style={{paddingLeft:"5%"}}>
                        {
                            calculate()
                        }
                        <h1>Summary</h1>
                        <p>Subtotal: ${Math.round(subtotal*100)/100}</p>
                        <p>Shipping & Handling: ${Math.round(shipping*100)/100}</p>
                        <p>Tax: ${Math.round(tax*100)/100}</p>
                        <hr style={{display:"block",margin:"0%",marginTop:"5%",marginBottom:"5%",backgroundColor:"#685BE0", width:"90%",borderTop:"2px solid black"}}/>
                        <h1>Total: ${total}</h1>
                    </div>
                    <div style={{display:"flex",textAlign:"center", alignItems:"center", justifyContent:"center"}}>
                        <Button onClick={() => navigate("/checkout",{state: {data: cart, total: total}})} style={{backgroundColor:"#685BE0", marginBottom:"5%"}} variant="contained">Secure Checkout</Button>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default CartPage;
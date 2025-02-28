import "../Styles/CartPage.css"
import CartTile from "../Components/CartTile";
import { Button } from "@mui/material";
import {useNavigate } from "react-router-dom";

function CartPage({cart}){
    //Hook state, for naviation
    const navigate = useNavigate();

    var subtotal = 0;
    var total = 0;
    var shipping = 0;
    var tax = 0;

    function calculate(){
        for(let i = 0; i <cart.length; i++){
            console.log(cart[i].price);
            subtotal = subtotal + parseFloat(cart[i].price);
            //Not a real value currently, this is just one I made up
            shipping = shipping + 5;// $5 per item
        }
        tax = subtotal*1.13;
        total = tax + shipping;
        total = Math.round(total*100)/100;
    }

    return(
        <div className="CartPage-content">
            <div className="CartPage-holder">
                <div className="CartPage-Cart">
                    <div className="CartPage-header">
                        <h1>Your Cart</h1>
                        <hr style={{display:"block",margin:"0%",backgroundColor:"#685BE0", width:"70%",borderTop:"5px solid #685BE0"}}/>
                    </div>
                    <div className="CartPage-Items">
                        {
                            cart[0] !== undefined ?
                            cart.map((item)=>{
                                return(
                                    <CartTile data={item}/>
                                )
                            })
                            :
                            console.log("Nothing inside the cart")
                        }
                    </div>
                </div>
                <div className="CartPage-Summary">
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
                </div>
            </div>
        </div>
    );
}

export default CartPage;
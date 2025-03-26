import "../Styles/CartTile.css"
import bike from "../Images/bike.jpg";
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import { EditWatchlist, EditWatchBadge, Watchlist } from "../App";
import { useContext, useState } from "react";
import { Button } from "@mui/material";
import {useNavigate } from "react-router-dom";
import ContactSeller from "../Modals/ContactSeller";
function CartTile({user,data: item}){
    const navigate = useNavigate();
    const set = useContext(EditWatchlist)
    const badge = useContext(EditWatchBadge);
    const watch = useContext(Watchlist);

    const [open,setOpen] = useState(false)

    const imageUrl = item.imageUrl 
    ? `http://localhost:5003${item.imageUrl}` 
    : "https://via.placeholder.com/150";

    function handleRemove(){
        for(let i =0; i < watch.length; i++){
            if(item._id === watch[i]._id){
              watch.splice(i,1);
              break;
            }
        }
        requestRemoveItemWatchlist(item)
        set(watch);
        badge(watch.length);

        //This fixes an issue with the page not updating specifically for a single item when pulling from the DB
        //DO NOT CHANGE
        if(watch.length <1){
            navigate("/cart")
        }
    }

    function handleDetails(){
        navigate("/details",{state: {data:item}})
    }

    function handlePurchase(){
        console.log("Send to Stripe API");
        console.log("Item name:", item.title);
        console.log("Item cost:", item.price);

        
    }

    async function requestRemoveItemWatchlist(item){
        try{
            //console.log(item._id)
            const token = localStorage.getItem("jwtToken");
            const response = await fetch("http://localhost:5002/api/watchlists/remove",{
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${token}`
                },
                body:JSON.stringify({
                    itemID:item._id
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Remove from Watchlist Fetch failed:", errorData.message);
                return;
            }
        
            const json = await response.json();
            console.log(json.message)
        }
        catch(error){
            console.error("Request failed:", error);
        }
    }


    return(
        <div className="CartTile-content">
            <div className="CartTile-data">
                <img onClick={handleDetails} style={{width:"5rem",height:"5rem",cursor:"pointer"}} src={imageUrl}></img>
                <p>{item.title}</p>
                <p>${item.price}</p>
            </div>
            <div>
                {
                    user?
                    <>
                    {
                        !(item.delivery === "in-person")?
                        <Button onClick={handlePurchase} variant="contianed" style={{backgroundColor:"#685BE0", color:"white"}}>Purchase</Button>
                        :
                        <>
                        <ContactSeller receiverID={item.seller._id} senderName={user.username} receiverName={item.seller.username}  open={open} close={() => setOpen(false)}/>
                        <Button onClick={() => setOpen(true)} style={{backgroundColor:"#685BE0", margin:"5%"}} variant="contained">Contact Seller</Button>
                        </>
                    }
                    </>
                    :
                    <p>Re-login</p>
                }
            </div>
            <div className="CartTile-remove" style={{display:"flex", justifyContent:"right"}}>
                <IconButton onClick={handleRemove}>
                    <CancelIcon style={{color:"685BE0"}}/>
                </IconButton>
            </div>
        </div>
    );
}

export default CartTile;
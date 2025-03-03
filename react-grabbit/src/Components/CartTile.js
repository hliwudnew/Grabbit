import "../Styles/CartTile.css"
import bike from "../Images/bike.jpg";
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import { EditWatchlist, EditWatchBadge, Watchlist } from "../App";
import { useContext } from "react";
import { Button } from "@mui/material";
function CartTile({data: item}){

    const set = useContext(EditWatchlist)
    const badge = useContext(EditWatchBadge);
    const watch = useContext(Watchlist);

    function handleRemove(){
        for(let i =0; i < watch.length; i++){
            if(item.id === watch[i].id){
              watch.splice(i,1);
              break;
            }
        }
        set(watch);
        badge(watch.length);
    }

    function handlePurchase(){
        console.log("Send to Stripe API");
    }

    return(
        <div className="CartTile-content">
            <div className="CartTile-data">
                <img style={{width:"5rem",height:"5rem"}} src={item.img}></img>
                <p>{item.name}</p>
                <p>${item.price}</p>
            </div>
            <div>
                <Button onClick={handlePurchase} variant="contianed" style={{backgroundColor:"#685BE0", color:"white"}}>Purchase</Button>
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
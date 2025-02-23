import "../Styles/CartTile.css"
import bike from "../Images/bike.jpg";
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
function CartTile({data: item}){

    return(
        <div className="CartTile-content">
            <div className="CartTile-data">
                <img style={{width:"5rem",height:"5rem"}} src={item.img}></img>
                <p>{item.name}</p>
                <p>${item.price}</p>
            </div>
            <div className="CartTile-remove" style={{display:"flex", justifyContent:"right"}}>
                <IconButton>
                    <CancelIcon style={{color:"685BE0"}}/>
                </IconButton>
            </div>
        </div>
    );
}

export default CartTile;
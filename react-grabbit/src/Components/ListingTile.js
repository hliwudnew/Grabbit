import "../Styles/ListingTile.css"
import {useNavigate } from "react-router-dom";
function ListingTile({data: Item}){
//Hook state, for naviation
const navigate = useNavigate();

    return(
        <div className="ListingTile-container">
            <div onClick={() => navigate("/details",{state: {data: Item}})} className="ListingTile-img-holder">
                <img className="ListingTile-img" src={Item.img}></img>
            </div>
            <div className="ListingTile-description">
                <p>{Item.name}</p>
                <h2>${Item.price}</h2>
            </div>
        </div>
    );
}

export default ListingTile;
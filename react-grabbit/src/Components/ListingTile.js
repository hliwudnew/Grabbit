import "../Styles/ListingTile.css"
import {useNavigate } from "react-router-dom";
function ListingTile({data: Item}){
//Hook state, for naviation
const navigate = useNavigate();

    return(
        <div className="ListingTile-container">
            <div onClick={() => navigate("/details")} className="ListingTile-img-holder">
                <img className="ListingTile-img" src={"https://m.media-amazon.com/images/I/61GcBHN0nEL._AC_SX522_.jpg"}></img>
            </div>
            <div className="ListingTile-description">
                <p>Name</p>
                <h2>$ Price</h2>
            </div>
        </div>
    );
}

export default ListingTile;
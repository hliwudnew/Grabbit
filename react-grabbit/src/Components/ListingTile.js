import "../Styles/ListingTile.css"
import {useNavigate } from "react-router-dom";
function ListingTile({data: item}){
//Hook state, for naviation
const navigate = useNavigate();

    return(
        <div className="ListingTile-container">
            <div onClick={() => navigate("/details",{state: {data: item}})} className="ListingTile-img-holder">
                <img className="ListingTile-img" src={item.img}></img>
            </div>
            <div className="ListingTile-description">
                <div className="ListingTile-description-text">
                    <h4 style={{marginBottom:"0%"}}>{item.name}</h4>
                    <p style={{color:"grey",margin:"0%"}}>{item.condition}</p>
                    <h2>${item.price}</h2>
                </div>
            </div>
        </div>
    );
}

export default ListingTile;
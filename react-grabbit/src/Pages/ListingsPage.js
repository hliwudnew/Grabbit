import { useState } from "react";
import "../Styles/ListingsPage.css"
import ListingTile from "../Components/ListingTile";
import SortingSelect from "../Components/SortingSelect.js";
function ListingsPage(){


    //Temporary hardcoded data
    const [items,setItems] = useState(
        [
            {
                name: "Soccer Ball",
                price: "10",
                description: "This is for sale!",
                contact:"email@gmail.com",
                img:"",
                condition:"New",
                delivery:"in-person",
            }
        ]
    );

    return(
        <div className="ListingsPage-content">
            <div className="ListingsPage-header">
                <SortingSelect/>
            </div>
            <div className="ListingsPage-tiles">
                <ListingTile/>
                <ListingTile/>
                <ListingTile/>
                <ListingTile/>
                <ListingTile/>
                <ListingTile/>
                <ListingTile/>
                <ListingTile/>
            </div>
        </div>
    );
}

export default ListingsPage;
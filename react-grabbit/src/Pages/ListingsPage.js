import { useState } from "react";
import "../Styles/ListingsPage.css"
import ListingTile from "../Components/ListingTile";
import SortingSelect from "../Components/SortingSelect.js";
function ListingsPage(){


    //Temporary hardcoded data
    const [items,setItems] = useState(
        [
            {
                id:"1",
                name: "Soccer Ball",
                price: "10",
                description: "This is for sale!",
                seller:"Chris",
                contact:"Coward@gmail.com",
                img:"https://plus.unsplash.com/premium_photo-1709589145461-4797b4e80e9c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                condition:"Pre-owned",
                delivery:"in-person",
            },
            {
                id:"2",
                name: "Necklace",
                price: "20",
                description: "This is for sale!",
                seller:"Harold",
                contact:"Henry@gmail.com",
                img:"https://images.unsplash.com/photo-1589128777073-263566ae5e4d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                condition:"Brand New",
                delivery:"in-person",
            },
            {
                id:"3",
                name: "Computer",
                price: "100",
                description: "This is for sale!",
                seller:"Obama",
                contact:"Obama@gmail.com",
                img:"https://images.unsplash.com/photo-1537498425277-c283d32ef9db?q=80&w=2078&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                condition:"Brand New",
                delivery:"in-person",
            },
            {
                id:"4",
                name: "Watch",
                price: "2000",
                description: "This is for sale!",
                seller:"Goku",
                contact:"Goku@gmail.com",
                img:"https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                condition:"Brand New",
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
                {
                    items.map((item) => {
                        return(
                            <ListingTile data={item}/>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default ListingsPage;
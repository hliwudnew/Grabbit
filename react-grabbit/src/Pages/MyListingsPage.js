// src/Pages/MyListingsPage.js
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/ListingsPage.css";
import ListingTile from "../Components/ListingTile";
import SortingSelect from "../Components/SortingSelect.js";
import "../Styles/MyListingsPage.css";
function MyListingsPage({userCheck}) {
  const [items, setItems] = useState([]);
  const location = useLocation();

  // Retrieve user info from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Extract query parameters for filtering (if needed)
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";
  const categoryQuery = queryParams.get("category") || "";

  useEffect(() => {
    if (!user) return; // Optionally redirect if user is not logged in

    // Base URL for seller's items (active items only)
    let baseUrl = "http://localhost:5003/api/items/seller/myitems";
    let url = baseUrl;
    if (searchQuery || categoryQuery) {
      let queryString = "";
      if (categoryQuery) {
        queryString += `category=${encodeURIComponent(categoryQuery)}`;
      }
      if (searchQuery) {
        queryString += (queryString ? "&" : "") + `q=${encodeURIComponent(searchQuery)}`;
      }
      url = `${baseUrl}?${queryString}`;
    }

    const headers = {
      Authorization: "Bearer " + localStorage.getItem("jwtToken"),
    };

    fetch(url, { headers })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        return response.json();
      })
      .then((data) => {
        // Since the server now returns only active items, just set them
        setItems(data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, [searchQuery, categoryQuery, user]);

  return (
    <div className="MyListingsPage-content">
      <div className="MyListingsPage-holder">
          <div className="MyListingsPage-Cart">
              <div className="MyListingsPage-header">
                  <h1>Your Listings</h1>
                  <hr style={{display:"block",margin:"0%",backgroundColor:"#685BE0", width:"70%",borderTop:"5px solid #685BE0"}}/>
              </div>
              {
                userCheck ?
                  <div className="MyListingsPage-tiles">
                      {
                        items ?
                        items.map((item)=>{
                            return(
                              <ListingTile key={item._id} data={item}/>
                            )
                        })
                        :
                        console.log("Nothing inside your listings")
                      }
                  </div>
                :
                <div className="MyListingsPage-signin">
                  <h2>Create an account to create lisiting on our website!</h2>
                </div>
              }
          </div>
      </div>
    </div>
  );
}
export default MyListingsPage;
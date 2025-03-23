// src/Pages/MyListingsPage.js
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/ListingsPage.css";
import ListingTile from "../Components/ListingTile";
import SortingSelect from "../Components/SortingSelect.js";

function MyListingsPage() {
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
    <div className="ListingsPage-content">
      <div className="ListingsPage-header">
        <SortingSelect />
      </div>
      <div className="ListingsPage-bottom">
        <div className="ListingsPage-filters">
          <h2>Filters</h2>
          {/* Additional filter UI elements if needed */}
        </div>
        <div className="ListingsPage-tiles">
          {items.map((item) => (
            <ListingTile key={item._id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyListingsPage;
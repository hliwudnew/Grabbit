import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/ListingsPage.css";
import ListingTile from "../Components/ListingTile";
import SortingSelect from "../Components/SortingSelect.js";

function ListingsPage() {
  const [items, setItems] = useState([]);
  const location = useLocation();

  // Retrieve user info from localStorage (if available)
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Extract query parameters "q" and "category" from the URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";
  const categoryQuery = queryParams.get("category") || "";

  useEffect(() => {
    let baseUrl = "";
    if (user) {
      // If a user is logged in, and there's a search or category filter,
      // use the "others search" endpoint to exclude the current user's items.
      if (searchQuery || categoryQuery) {
        baseUrl = "http://localhost:5003/api/items/others/search";
      } else {
        baseUrl = "http://localhost:5003/api/items/others";
      }
    } else {
      // If no user is logged in, use the public endpoints.
      if (searchQuery || categoryQuery) {
        baseUrl = "http://localhost:5003/api/items/search";
      } else {
        baseUrl = "http://localhost:5003/api/items";
      }
    }

    let url = "";
    if (searchQuery || categoryQuery) {
      let queryString = "";
      if (categoryQuery) {
        queryString += `category=${encodeURIComponent(categoryQuery)}`;
      }
      if (searchQuery) {
        queryString += (queryString ? "&" : "") + `q=${encodeURIComponent(searchQuery)}`;
      }
      url = `${baseUrl}?${queryString}`;
    } else {
      url = baseUrl;
    }

    // If a user is logged in, include the Authorization header.
    const headers = {};
    if (user) {
      headers.Authorization = "Bearer " + localStorage.getItem("jwtToken");
    }

    fetch(url, { headers })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        return response.json();
      })
      .then((data) => {
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
          {/* You can add additional filter UI elements here if needed */}
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

export default ListingsPage;
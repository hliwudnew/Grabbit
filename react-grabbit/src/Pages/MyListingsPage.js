import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/ListingsPage.css";
import ListingTile from "../Components/ListingTile.js";
import SortingSelect from "../Components/SortingSelect.js";

function MyListingsPage() {
  const [items, setItems] = useState([]);
  const location = useLocation();

  // Retrieve user info from localStorage (if available)
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Extract query parameters "q" and "category" from the URL (if filtering is desired)
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";
  const categoryQuery = queryParams.get("category") || "";

  useEffect(() => {
    if (!user) return; // Optionally, you might redirect to login if user is not available

    // Base URL for current user's listings
    let baseUrl = "http://localhost:5003/api/items/seller/myitems";

    // If search or category filters are provided, append them
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

    // Set up headers to include the JWT token
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
          {/* Additional filter UI can be added here if desired */}
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
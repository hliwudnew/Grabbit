import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/ListingsPage.css";
import ListingTile from "../Components/ListingTile";
import SortingSelect from "../Components/SortingSelect.js";

function ListingsPage({userCheck}) {
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
    // Determine base URL: if a user is logged in, use the "others" endpoints
    let baseUrl;
    /* New: the code for pulling the user data out of local doesnt work since the "others" endpoints are protected. 
       So I passed user down from App.js which is always accurate. Didint wanna break your routes incase its needed that way
    */
    if (userCheck) {
      baseUrl =
        searchQuery || categoryQuery
          ? "http://localhost:5003/api/items/others/search"
          : "http://localhost:5003/api/items/others";
    } else {
      baseUrl =
        searchQuery || categoryQuery
          ? "http://localhost:5003/api/items/search"
          : "http://localhost:5003/api/items";
    }

    // Build final URL with query parameters if provided
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

    // Set up headers (include Authorization header if user is logged in)
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
          {/* Add additional filter UI elements if needed */}
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
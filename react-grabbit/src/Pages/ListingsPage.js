import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/ListingsPage.css";
import ListingTile from "../Components/ListingTile";
import SortingSelect from "../Components/SortingSelect.js";
function ListingsPage() {
  const [items, setItems] = useState([]);
  const location = useLocation();

  // Extract the query parameter "q" from the URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  useEffect(() => {
    // idk not trying to mess gab's code 
    const url = searchQuery
      ? `http://localhost:5003/api/items/search?q=${encodeURIComponent(searchQuery)}`
      : "http://localhost:5003/api/items";

    fetch(url)
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
  }, [searchQuery]);

  return (
    <div className="ListingsPage-content">
      <div className="ListingsPage-header">
        <SortingSelect />
      </div>
      <div className="ListingsPage-bottom">
        <div className="ListingsPage-filters">
          <h2>Filters</h2>
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
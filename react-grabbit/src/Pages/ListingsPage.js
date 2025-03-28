import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/ListingsPage.css";
import ListingTile from "../Components/ListingTile";
import SortingSelect from "../Components/SortingSelect.js";
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, Alert } from "@mui/material";
function ListingsPage({userCheck}) {
  const [items, setItems] = useState([]);
  const location = useLocation();

  const [delivery,setDelivery]= useState("");
  const [condition,setCondition] = useState("");
  const [category,setCategory] = useState("");
  const [minPrice,setMinPrice] = useState(0);
  const [maxPrice,setMaxPrice] = useState(0);


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
        searchQuery || categoryQuery || delivery.length>0 || condition.length>0 || category.length>0 || minPrice>0 || maxPrice>0
          ? "http://localhost:5003/api/items/others/search"
          : "http://localhost:5003/api/items/others";
    } else {
      baseUrl =
        searchQuery || categoryQuery || delivery.length>0 || condition.length>0 || category.length>0 || minPrice>0 || maxPrice>0
          ? "http://localhost:5003/api/items/search"
          : "http://localhost:5003/api/items";
    }

    // Build final URL with query parameters if provided
    let url = baseUrl;
    if (searchQuery || categoryQuery || delivery.length>0 || condition.length>0 || category.length>0 || minPrice>0 || maxPrice>0) {
      let queryString = "";
      if (categoryQuery) {
        queryString += `category=${encodeURIComponent(categoryQuery)}`;
      }
      if (searchQuery) {
        queryString += (queryString ? "&" : "") + `q=${encodeURIComponent(searchQuery)}`;
      }
      if(delivery.length>0){
        queryString += (queryString ? "&" : "") + `delivery=${encodeURIComponent(delivery)}`
      }
      if(condition.length>0){
        queryString += (queryString ? "&" : "") + `condition=${encodeURIComponent(condition)}`
      }
      if(category.length>0){
        queryString += (queryString ? "&" : "") + `category=${encodeURIComponent(category)}`
      }
      if(minPrice>0){
        queryString += (queryString ? "&" : "") + `minPrice=${encodeURIComponent(minPrice)}`
      }
      if(maxPrice>0){
        queryString += (queryString ? "&" : "") + `maxPrice=${encodeURIComponent(maxPrice)}`
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

  async function handleFilterClear(){
    setDelivery("");
    setCategory("");
    setCondition("");
    setMinPrice(0);
    setMaxPrice(0);
  }

  return (
    <div className="ListingsPage-content">
      <div className="ListingsPage-header">
        <SortingSelect />
      </div>
      <div className="ListingsPage-bottom">
        <div className="ListingsPage-filters">
          <h2>Filters</h2>
          <hr/>
          <h3>Price</h3>
          <div style={{display:"flex", alignItems:"center", marginBottom:"10%"}}>
            <TextField value={minPrice} onChange={(e) => setMinPrice(e.target.value)} size="small" type="number"></TextField>
            <p style={{textAlign:"center",marginLeft:"5%",marginRight:"5%"}}>-</p>
            <TextField value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} size="small" type="number"></TextField>
          </div>
          <hr/>
          <h3 style={{marginTop:"10%"}}>Category</h3>
          <FormControl fullWidth style={{marginBottom:"10%"}}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {/* Home Improvement Categories */}
              <MenuItem value={"furniture"}>Furniture</MenuItem>
              <MenuItem value={"plants"}>Plants</MenuItem>
              <MenuItem value={"tools"}>Tools</MenuItem>
              <MenuItem value={"lighting"}>Lighting</MenuItem>
              <MenuItem value={"cleaning"}>Cleaning</MenuItem>
              <MenuItem value={"bedroom"}>Bedroom</MenuItem>
              <MenuItem value={"bathroom"}>Bathroom</MenuItem>
              <MenuItem value={"kitchen"}>Kitchen</MenuItem>
              {/* Technology Categories */}
              <MenuItem value={"laptops"}>Laptops</MenuItem>
              <MenuItem value={"tablets"}>Tablets</MenuItem>
              <MenuItem value={"headphones"}>Headphones</MenuItem>
              <MenuItem value={"speakers"}>Speakers</MenuItem>
              <MenuItem value={"televisions"}>Televisions</MenuItem>
              <MenuItem value={"gaming consoles"}>Gaming Consoles</MenuItem>
              <MenuItem value={"video games"}>Video games</MenuItem>
              <MenuItem value={"pc parts"}>PC Parts</MenuItem>
            </Select>
          </FormControl>
          <hr/>
          <h3 style={{marginTop:"10%"}}>Condition</h3>
          <FormControl fullWidth style={{marginBottom:"10%"}}>
            <InputLabel>Condition</InputLabel>
            <Select
              value={condition}
              label="Condition"
              onChange={(e) => setCondition(e.target.value)}
            >
              <MenuItem value={"new"}>New</MenuItem>
              <MenuItem value={"pre-owned"}>Pre-owned</MenuItem>
            </Select>
          </FormControl>
          <hr/>
          <h3>Delivery</h3>
          <FormControl fullWidth style={{marginBottom:"10%"}}>
            <InputLabel>Delivery</InputLabel>
            <Select
              value={delivery}
              label="Delivery"
              onChange={(e) => setDelivery(e.target.value)}
            >
              <MenuItem value={"in-person"}>In-Person</MenuItem>
              <MenuItem value={"online"}>Online</MenuItem>
            </Select>
          </FormControl>
          <hr/>
          <div style={{textAlign:"center"}}>
          <Button onClick={handleFilterClear} style={{ backgroundColor: "#685BE0", width: "50%" }} variant="contained">
            Clear Filters
          </Button>
          </div>
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
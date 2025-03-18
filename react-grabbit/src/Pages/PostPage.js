import { useState } from "react";
import "../Styles/PostPage.css";
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, Alert } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";

function PostPage() {
  const navigate = useNavigate();

  // UI state
  const [uploaded, setUploaded] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Data state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [delivery, setDelivery] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setUploaded(true);
      setErrorMsg(""); // Clear any previous error if an image is selected
    }
  };

  const handlePost = async () => {
    // Check if an image is selected before submission
    if (!imageFile) {
      setErrorMsg("Image is required.");
      return;
    }

    // Create FormData to support file upload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("delivery", delivery);
    formData.append("image", imageFile);

    try {
      const response = await fetch("http://localhost:5003/api/items", {
        method: "POST",
        // Do not set Content-Type when sending FormData
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("jwtToken")
        },
        body: formData,
      });
      const json = await response.json();
      console.log("Response:", json);
      if (response.ok) {
        setPostSuccess(true);
      } else {
        setErrorMsg(json.message || "Error posting item");
        console.error("Error posting item:", json);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setErrorMsg("Request failed. Please try again.");
    }
  };

  return (
    <div className="PostPage-container">
      <div className="PostPage-holder">
        <h1>Create a Listing</h1>
        <div className="PostPage-Information">
          <div className="PostingPage-Details">
            <h3>Title</h3>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Title"
              variant="outlined"
              sx={{ input: { color: "#685BE0" } }}
              className="account-input"
            />
            <h3>Price</h3>
            <TextField
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              label="Price"
              variant="outlined"
              sx={{ input: { color: "#685BE0" } }}
              className="account-input"
            />
            <h3>Category</h3>
            <FormControl fullWidth>
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
            <h3>Condition</h3>
            <FormControl fullWidth>
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
            <h3>Delivery</h3>
            <FormControl fullWidth>
              <InputLabel>Delivery</InputLabel>
              <Select
                value={delivery}
                label="Delivery"
                onChange={(e) => setDelivery(e.target.value)}
              >
                <MenuItem value={"in-person"}>In-Person</MenuItem>
                <MenuItem value={"online"}>Online</MenuItem>
                <MenuItem value={"both"}>Both</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="PostingPage-img">
            {uploaded ? (
              <img src={imagePreview} alt="Uploaded" style={{ maxWidth: "100%", maxHeight: "200px" }} />
            ) : (
              <div>
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            )}
          </div>
        </div>
        <div className="PostingPage-description">
          <h3>Description</h3>
          <TextField
            multiline
            label="Description"
            style={{ width: "100%", height: "100%" }}
            variant="outlined"
            sx={{ input: { color: "#685BE0" } }}
            className="account-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="PostingPage-submit">
          {postSuccess ? (
            <Alert style={{ marginBottom: "5%" }} icon={<CheckIcon fontSize="inherit" />} severity="success">
              Post Successful
            </Alert>
          ) : (
            <Button onClick={handlePost} style={{ backgroundColor: "#685BE0", width: "50%" }} variant="contained">
              Post
            </Button>
          )}
          {errorMsg && <Alert severity="error" style={{ marginTop: "10px" }}>{errorMsg}</Alert>}
        </div>
      </div>
    </div>
  );
}

export default PostPage;
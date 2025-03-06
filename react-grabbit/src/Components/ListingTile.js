import "../Styles/ListingTile.css";
import { useNavigate } from "react-router-dom";

function ListingTile({ data: item }) {
  const navigate = useNavigate();

  // Construct the full image URL using the new "imageUrl" field.
  // If not present, fall back to a placeholder image.
  const imageUrl = item.imageUrl 
    ? `http://localhost:5003${item.imageUrl}` 
    : "https://via.placeholder.com/150";

  return (
    <div className="ListingTile-container">
      <div 
        onClick={() => navigate("/details", { state: { data: item } })} 
        className="ListingTile-img-holder"
      >
        <img className="ListingTile-img" src={imageUrl} alt={item.title} />
      </div>
      <div className="ListingTile-description">
        <div className="ListingTile-description-text">
          <h4 style={{ marginBottom: "0%" }}>{item.title}</h4>
          <p style={{ color: "grey", margin: "0%" }}>
            {item.condition} | {item.category} | {item.delivery}
          </p>
          <h2>${item.price}</h2>
        </div>
      </div>
    </div>
  );
}

export default ListingTile;
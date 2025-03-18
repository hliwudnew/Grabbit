import { useNavigate } from "react-router-dom";
import "../Styles/HomeTile.css";

function HomeTile({ img, text }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Use the text prop as the category (converted to lowercase for consistency)
    const category = text.toLowerCase();
    navigate(`/listings?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="HomeTile-container" onClick={handleClick}>
      <img 
        className="HomeTile-img" 
        style={{ width: "inherit", height: "inherit" }} 
        src={img} 
        alt={text} 
      />
      <div className="HomeTile-title">
        <h2 className="HomeTile-text">{text}</h2>
      </div>
    </div>
  );
}

export default HomeTile;
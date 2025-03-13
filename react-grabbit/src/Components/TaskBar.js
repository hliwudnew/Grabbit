import React, { useState, useEffect } from "react";
import "../Styles/TaskBar.css";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import MessageIcon from "@mui/icons-material/Message";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Badge, { badgeClasses } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import Avatar from "@mui/material/Avatar";

function TaskBar({ cartIcon, user }) {
  const navigate = useNavigate();
  const [badge, setBadge] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setBadge(cartIcon);
  }, [cartIcon]);

  // Styles for badge using MUI's styled API
  const CartBadge = styled(Badge)`
    & .${badgeClasses.badge} {
      top: -12px;
      right: -6px;
      background-color: #685be0;
    }
  `;

  function stringToHslColor(str, saturation, lightness) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = hash % 360;
    return `hsl(${hash}, ${saturation}%, ${lightness}%)`;
  }

  // When the search button is clicked, navigate to /listings with a query parameter
  const handleSearch = () => {
    navigate(`/listings?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="TaskBar">
      <div className="TaskBar-content">
        <div className="TaskBar-logo">
          <img
            style={{ width: "3.5rem", height: "3.5rem", cursor: "pointer" }}
            onClick={() => navigate("/")}
            src="./grabbit-cut.png"
            alt="logo"
          />
          <h1>Grabbit</h1>
        </div>
        <div className="TaskBar-pages">
          <button>DropDown</button>
          <TextField
            size="small"
            style={{ width: "100%", borderRadius: "100%" }}
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            style={{ color: "black", borderColor: "black" }}
            variant="outlined"
            onClick={handleSearch}
            className="page"
          >
            <SearchIcon />
          </Button>
        </div>
        <div className="TaskBar-profile">
          {!user ? (
            <IconButton onClick={() => navigate("/login")}>
              <PersonIcon />
            </IconButton>
          ) : (
            <>
              <IconButton onClick={() => navigate("/create")}>
                <AddCircleOutlineIcon />
              </IconButton>
              <IconButton onClick={() => navigate("/messages")}>
                <MessageIcon />
              </IconButton>
              <IconButton onClick={() => navigate("/cart")}>
                <TurnedInIcon />
                <CartBadge badgeContent={badge} color="primary" overlap="circular" />
              </IconButton>
              <Avatar
                onClick={() => navigate("/account")}
                style={{
                  marginLeft: "1%",
                  cursor: "pointer",
                  backgroundColor: stringToHslColor(user.username ? user.username : "Adam Sandler", 40, 60),
                }}
              >
                {user.username ? user.username.substring(0, 1) : "A"}
              </Avatar>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskBar;
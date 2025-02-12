import "../Styles/TaskBar.css";
import {useNavigate } from "react-router-dom";

function TaskBar(){
//Hook state, for naviation
const navigate = useNavigate();

    return(
        <div className="TaskBar">
            <div className="TaskBar-content">
                <div className="TaskBar-logo">
                    <img style={{width:"5.5rem", height: "5rem", cursor:"pointer"}} onClick={() => navigate("/")} src ="./grabbit-cut.png" alt = "logo"></img>
                </div>
                <div className="TaskBar-pages">
                    <button>DropDown</button>
                    <input></input>
                    <button onClick={() => navigate("/listings")} className = "page">Search</button>
                </div>
                <div className="TaskBar-profile">
                    <button onClick={() => navigate("/notifications")}>Notifications</button>
                    <button onClick={() => navigate("/account")}>Account</button>
                    <button onClick={() => navigate("/cart")}>Cart</button>
                </div>
            </div>
        </div>
    );

}

export default TaskBar;
import "../Styles/ErrorPage.css"
import {useNavigate } from "react-router-dom";
function ErrorPage(){
    const navigate = useNavigate();
    return(
        <div className="ErrorPage-content">
            <p>Error Page</p>
            <button onClick={() => navigate("/")}>Back to Home</button>
        </div>
    );
}

export default ErrorPage;
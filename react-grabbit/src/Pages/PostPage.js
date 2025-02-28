import "../Styles/PostPage.css"
import {useNavigate } from "react-router-dom";
function PostPage(){
    //Hook state, for naviation
    const navigate = useNavigate();
    return(
        <div className="PostPage-container">
            <p>Post Page</p>
        </div>
    );
}

export default PostPage;
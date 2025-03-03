import {Button, TextField } from "@mui/material";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import "../Styles/PostPage.css"
import {useNavigate } from "react-router-dom";
import { useState } from "react";
function PostPage(){
    //Hook state, for naviation
    const navigate = useNavigate();

    //For UI changes
    const [uploaded, setUploaded] = useState(false);
    const [post, setPost] = useState(false)

    //For data
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [condtion, setCondition] = useState("");
    const [delivery, setDelivery] = useState("");

    function handleUpload(){
        //Will need to grab the image here, and upload it and then pass it to the image tag below
        setUploaded(true);
    }

    function handlePost(){
        //Sent to database
        console.log("Send to database")
        console.log("\n"+ name + ", "+ price + ", "+ condtion + ", "+ delivery)
        setPost(true)
    }

    return(
        <div className="PostPage-container">
            <div className="PostPage-holder">
                <h1>Create a Listing</h1>
                <div className="PostPage-Information">
                    <div className="PostingPage-Details">
                        <h3>Name</h3>
                        <TextField onChange={(event, newValue) => {setName(event.target.value);}} label="Name" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                        <h3>Price</h3>
                        <TextField onChange={(event, newValue) => {setPrice(event.target.value);}} label="Price" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                        <h3>Condition</h3>
                        <TextField onChange={(event, newValue) => {setCondition(event.target.value);}} label="Condition" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                        <h3>Delivery</h3>
                        <TextField onChange={(event, newValue) => {setDelivery(event.target.value);}} label="Delivery" variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                    </div>
                    <div className="PostingPage-img">
                        {
                            uploaded? 
                            <img alt="img"></img>
                            :
                            <Button style={{backgroundColor:"#685BE0", color:"white"}} onClick={handleUpload}>Upload Image</Button>
                        }
                    </div>
                </div>
                <div className="PostingPage-description">
                    <h3>Description</h3>
                    <TextField multiline label="Description" style={{width:"100%", height:"100%"}} variant="outlined" sx={{ input: { color: '#685BE0' } }} className='account-input'></TextField>
                </div>
                <div className="PostingPage-submit">
                    {
                        post?
                        <Alert style={{marginBottom:"5%"}} icon={<CheckIcon fontSize="inherit" />} severity="success">Post Successful</Alert> 
                        :
                        <Button onClick={handlePost} style={{backgroundColor:"#685BE0", width:"50%"}} variant="contained">Post</Button>
                    }
                </div>
            </div>
        </div>
    );
}

export default PostPage;
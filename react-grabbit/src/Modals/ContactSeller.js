import "../Styles/ContactSeller.css";
import ReactDom from "react-dom";
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, Alert } from "@mui/material";
import { useState } from "react";
import CheckIcon from '@mui/icons-material/Check';
function ContactSeller({open, close, receiverID,senderName,receiverName}){

    const [message,setMessage] = useState();
    const [isSent,setIsSent] = useState(false);

    async function handleContactSeller(){
        const token = localStorage.getItem("jwtToken");
        try{
            const response = await fetch("http://localhost:5002/api/messages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
              },
              body:JSON.stringify({
                receiver: receiverID,
                content: message,
                senderName:senderName,
                receiverName:receiverName
              })
            });
      
            if (!response.ok) {
              const errorData = await response.json();
              console.error("Message Fetch failed:", errorData.message);
              return;
            }
      
            const json = await response.json();
            console.log("Message Send:", json);
            setMessage("");
            setIsSent(true);
          }
          catch(error){
            console.error("Request failed:", error);
          }
    }

    if(!open)return null;    
    return ReactDom.createPortal(
        
        <>
            <div className="ContactSellerModal-overlay"/>
            <div className="ContactSellerModal-container">
                <div style={{textAlign:"right"}}>
                    <Button onClick={close} style={{ backgroundColor: "#685BE0", width: "10%" }} variant="contained">
                        Back
                    </Button>
                </div>
                <div className="ContactSellerModal-holder">
                    <div className="ContactSellerModal-header">
                        <h2>Contact Seller</h2>
                    </div>
                    {
                        !isSent?
                        <>
                            <div className="ContactSellerModal-content">
                                <TextField
                                fullWidth
                                multiline
                                label="Message"
                                style={{ width: "100%", height: "100%" }}
                                variant="outlined"
                                sx={{ input: { color: "#685BE0" } }}
                                className="account-input"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                            <div style={{textAlign:"center", marginTop:"5%"}}>
                                <Button onClick={handleContactSeller} style={{ backgroundColor: "#685BE0", width: "50%" }} variant="contained">
                                    Send Message
                                </Button>
                            </div>
                        </>
                        :
                        <Alert style={{marginBottom:"5%"}} icon={<CheckIcon fontSize="inherit" />} severity="success">Message Sent!</Alert> 
                    }
                </div> 
            </div>
        </>,
        document.getElementById('portal')
    );
}

export default ContactSeller
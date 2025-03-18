import { TextField, Button} from "@mui/material";
import "../Styles/MessagesPage.css";
import SearchIcon from '@mui/icons-material/Search';
import ContactTile from "../Components/ContactTile";
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect } from "react";
import MessageTile from "../Components/MessageTile";

function MessagesPage({user}){

    const [messages,setMessages] = useState([])
    const [text,setText] = useState();
    const [receiver,setReceiver] = useState("67d8b7aa75a87bf59befbda3");
    const token = localStorage.getItem("jwtToken");

    /*
    Note conversation UI probably wont update when a message is sent, but the database will currently
    */


    //Runs on reciver change
    useEffect(() =>{
        requestConversation();
    },[receiver])

    async function requestConversation() {
        try {
            const response = await fetch("http://localhost:5002/api/messages/"+receiver, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
              },
            });
      
            if (!response.ok) {
              const errorData = await response.json();
              console.error("Conversation Fetch failed:", errorData.message);
              return;
            }
      
            const json = await response.json();
            console.log("Response:", json);

            createConversation(json);
          } catch (error) {
            console.error("Request failed:", error);
        }
    }

    function createConversation(convo){
        const conversation =[];
        for(let i = 0; i < convo.length; i++){
            //Our Messages should be dark purple
            if(convo[i].sender === user._id){
                const newMessage = {
                    txt:convo[i].content,
                    colour:"#685be0",
                }
                conversation.push(newMessage)
            }
            //Others messages are light purple
            else{
                const newMessage = {
                    txt:convo[i].content,
                    colour:"#8a7ff0",
                }
                conversation.push(newMessage)
            }
        }
        setMessages(conversation);
    }


    async function sendMessage(){
        try {
            const response = await fetch("http://localhost:5002/api/messages/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                receiver: receiver,
                content: text,
              }),
            });
      
            if (!response.ok) {
              const errorData = await response.json();
              console.error("Conversation Fetch failed:", errorData.message);
              return;
            }
      
            const json = await response.json();
            console.log("Response:", json);
            //Might want to update the conversation here too when the user sends a new message, hgence updating it for themselves on the UI
            requestConversation()// Bad solution for now, since it re pulls the entire convo
        } 
        catch (error) {
            console.error("Request failed:", error);
        }
    }

    

    return(
        <div className="MessagesPage-container">
            <div className="MessagesPage-holder">
                <div className="MessagesPage-left">
                    <div className="MessagesPage-search">
                        <TextField label={<SearchIcon/>} sx={{ input: { color: 'black' }, bgcolor:"white"}} size="small"></TextField>
                    </div>
                    <div className="MessagesPage-contacts">
                        <ContactTile/>
                    </div>
                </div>
                <div className="MessagesPage-right">
                    <div className="MessagesPage-header">
                        <Avatar sx={{ bgcolor: "red" }}>M</Avatar>
                        <p>Mr.Meow</p>
                    </div>
                    <hr style={{display:"block",margin:"0%",borderTop:"1px solid black"}}/>
                    <div className="MessagesPage-Messages">
                    {
                        messages ?
                        messages.map((text) => {
                            return(
                                <MessageTile data={text}/>
                            )
                        })
                        :
                        <></>
                    }
                    </div>
                    <div className="MessagesPage-Texting">
                        <hr/>
                        <IconButton onClick={() => sendMessage()}>
                            <SendIcon/>
                        </IconButton>
                        <TextField onChange={(event) => {setText(event.target.value)}} style={{width:"80%"}} size="small" variant="outlined"></TextField>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessagesPage;
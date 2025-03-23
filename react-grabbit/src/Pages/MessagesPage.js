import { TextField, Button} from "@mui/material";
import "../Styles/MessagesPage.css";
import SearchIcon from '@mui/icons-material/Search';
import ContactTile from "../Components/ContactTile";
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect, useRef } from "react";
import MessageTile from "../Components/MessageTile";

function MessagesPage({user}){

    const [messages,setMessages] = useState([]);
    const [text,setText] = useState();
    const [receiver,setReceiver] = useState("");
    const [contacts,setContacts] = useState([]);
    const [displayName,setDisplayName] = useState("");
    const token = localStorage.getItem("jwtToken");
    const isMounted = useRef(false);

    /*
    Note conversation UI probably wont update when a new message is sent by the other end, if page refreshes it will garanteed
    */

    useEffect(() => {
        requestContacts();
    },[])

    //Runs on reciver change
    useEffect(() =>{
        if(!isMounted.current){
            isMounted.current = true;
            return;
        }
        //console.log("Rec",receiver)
        requestConversation();
        for(let i = 0; i < contacts.length; i++){
            if(contacts[i].sender == receiver){
                setDisplayName(contacts[i].senderName);
            }
        }
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
            //console.log("Response:", json);

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
            var receiverName = "";
            //Looks through the contacts and grabs associated id
            for(let i = 0; i < contacts.length; i++){
                if(contacts[i].sender == receiver){
                    receiverName= contacts[i].senderName;
                }
            }
            const response = await fetch("http://localhost:5002/api/messages/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                receiver: receiver,
                content: text,
                senderName:user.username,
                receiverName:receiverName
              }),
            });
      
            if (!response.ok) {
              const errorData = await response.json();
              console.error("Send Message Fetch failed:", errorData.message);
              return;
            }
      
            const json = await response.json();
            //console.log("Response:", json);
            setText("")
            //Might want to update the conversation here too when the user sends a new message, hgence updating it for themselves on the UI
            requestConversation()// Bad solution for now, since it re pulls the entire convo
        } 
        catch (error) {
            console.error("Request failed:", error);
        }
    }

    async function requestContacts() {
        try {
            const response = await fetch("http://localhost:5002/api/messages", {
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
            //console.log("Contacts:", json);
            setContacts(json)
          } catch (error) {
            console.error("Request failed:", error);
        }
    }
    
    function stringToHslColor(string, saturation, boldness) {
        var hash = 0;
        for (var i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        hash = hash % 360;
        return 'hsl('+hash+', '+saturation+'%, '+boldness+'%)';
    }


    return(
        <div className="MessagesPage-container">
            <div className="MessagesPage-holder">
                <div className="MessagesPage-left">
                    <div className="MessagesPage-search">
                        <TextField label={<SearchIcon/>} sx={{ input: { color: 'black' }, bgcolor:"white"}} size="small"></TextField>
                    </div>
                    <div className="MessagesPage-contacts">
                        {
                            contacts ?
                            contacts.map((person) => {
                                return(
                                    <ContactTile setReceiver={setReceiver} person={person}/>
                                )
                            })
                            :
                            <></>
                        }
                    </div>
                </div>
                <div className="MessagesPage-right">
                    <div className="MessagesPage-header">
                        {
                            messages.length > 0?
                            <>
                            <Avatar style={{
                                backgroundColor: stringToHslColor(displayName ? displayName : "Adam Sandler", 40, 60)
                            }}>
                                {displayName ? displayName.substring(0, 1) : "A"}
                            </Avatar>
                            <p>{displayName ? displayName: ""}</p>
                            </>
                            :
                            <h2>Welcome to Your Messages</h2>
                        }
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
                        {
                            messages.length > 0?
                            <>
                                <hr/>
                                <IconButton onClick={() => sendMessage()}>
                                    <SendIcon/>
                                </IconButton>
                                <TextField value={text} onChange={(event) => {setText(event.target.value)}} style={{width:"80%"}} size="small" variant="outlined"></TextField>
                            </>
                            :
                            <></>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessagesPage;
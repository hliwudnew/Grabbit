import { TextField, Button, IconButton, Avatar } from "@mui/material";
import "../Styles/MessagesPage.css";
import SearchIcon from "@mui/icons-material/Search";
import ContactTile from "../Components/ContactTile";
import SendIcon from "@mui/icons-material/Send";
import { useState, useEffect, useRef } from "react";
import MessageTile from "../Components/MessageTile";

function MessagesPage({ user: propUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState(""); 
  const [receiver, setReceiver] = useState("");
  const [contacts, setContacts] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const token = localStorage.getItem("jwtToken");
  const isMounted = useRef(false);

  const user = propUser || JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    requestContacts();
  }, []);

  // Whenever receiver or contacts change, fetch conversation and update displayName.
  useEffect(() => {
    if (receiver) {
      requestConversation();
      const matchingContact = contacts.find((contact) => contact.sender === receiver);
      if (matchingContact) {
        setDisplayName(matchingContact.senderName);
      }
    }
  }, [receiver, contacts]);

  async function requestConversation() {
    try {
      if (!receiver) return;
      const response = await fetch(`http://localhost:5002/api/messages/${receiver}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Conversation fetch failed:", errorData.message);
        return;
      }
      const data = await response.json();
      console.log("Received conversation:", data);
      createConversation(data);
    } catch (error) {
      console.error("Request failed:", error);
    }
  }

  function createConversation(responseData) {
    // Determine the messages array
    let messagesArray = [];
    if (responseData && Array.isArray(responseData.messages)) {
      messagesArray = responseData.messages;
    } else if (Array.isArray(responseData)) {
      messagesArray = responseData;
    }
    messagesArray = messagesArray.filter((msg) => msg); // remove any undefined values
    const conversation = messagesArray.map((msg) => ({
      id: msg._id,
      txt: msg.content,
      // Different color if the message sender is the current user
      colour: msg.sender === user._id ? "#685be0" : "#8a7ff0",
    }));
    setMessages(conversation);
  }

  async function sendMessage() {
    if (!text.trim()) {
      console.log("Empty message, no request made");
      return;
    }
    try {
      const matchingContact = contacts.find((contact) => contact.sender === receiver);
      const receiverName = matchingContact ? matchingContact.senderName : "Unknown Receiver";
      const response = await fetch("http://localhost:5002/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver: receiver,
          content: text,
          senderName: user.username,
          receiverName: receiverName,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Send message fetch failed:", errorData.message);
        return;
      }
      const data = await response.json();
      console.log("Message sent:", data);
      setText("");
      // Refresh the conversation after sending a message
      requestConversation();
    } catch (error) {
      console.error("Request failed:", error);
    }
  }

  async function requestContacts() {
    try {
      const response = await fetch("http://localhost:5002/api/messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Contacts fetch failed:", errorData.message);
        return;
      }
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Request failed:", error);
    }
  }

  function stringToHslColor(str, saturation, lightness) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = hash % 360;
    return `hsl(${hash}, ${saturation}%, ${lightness}%)`;
  }

  return (
    <div className="MessagesPage-container">
      {!user ? (
        <div>Please log in to view messages.</div>
      ) : (
        <div className="MessagesPage-holder">
          <div className="MessagesPage-left">
            <div className="MessagesPage-search">
              <TextField
                label={<SearchIcon />}
                sx={{ input: { color: "black" }, bgcolor: "white" }}
                size="small"
              />
            </div>
            <div className="MessagesPage-contacts">
              {contacts &&
                contacts.map((person) => (
                  <ContactTile key={person.sender} setReceiver={setReceiver} person={person} />
                ))}
            </div>
          </div>
          <div className="MessagesPage-right">
            <div className="MessagesPage-header">
              {messages.length > 0 ? (
                <>
                  <Avatar style={{ backgroundColor: stringToHslColor(displayName || "Default", 40, 60) }}>
                    {displayName ? displayName.charAt(0) : "A"}
                  </Avatar>
                  <p>{displayName}</p>
                </>
              ) : (
                <h2>Welcome to Your Messages</h2>
              )}
            </div>
            <hr style={{ display: "block", margin: "0%", borderTop: "1px solid black" }} />
            <div className="MessagesPage-Messages">
              {messages &&
                messages.map((msg, index) => (
                  <MessageTile key={msg.id || index} data={msg} />
                ))}
            </div>
            <div className="MessagesPage-Texting">
              {messages.length > 0 && (
                <>
                  <hr />
                  <IconButton onClick={sendMessage}>
                    <SendIcon />
                  </IconButton>
                  <TextField
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    style={{ width: "80%" }}
                    size="small"
                    variant="outlined"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessagesPage;
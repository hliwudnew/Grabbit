import { TextField, Button} from "@mui/material";
import "../Styles/MessagesPage.css";
import SearchIcon from '@mui/icons-material/Search';
import ContactTile from "../Components/ContactTile";
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
function MessagesPage(){

    return(
        <div className="MessagesPage-container">
            <div className="MessagesPage-holder">
                <div className="MessagesPage-left">
                    <div className="MessagesPage-search">
                        <TextField label={<SearchIcon/>} sx={{ input: { color: 'black' }, bgcolor:"white"}} size="small"></TextField>
                    </div>
                    <div className="MessagesPage-contacts">
                        <ContactTile/>
                        <ContactTile/>
                        <ContactTile/>
                        <ContactTile/>
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
                        <p>Hellow</p>
                        <p>Hellow</p>
                        <p>Hellow</p>
                    </div>
                    <div className="MessagesPage-Texting">
                        <hr/>
                        <IconButton>
                            <SendIcon/>
                        </IconButton>
                        <TextField style={{width:"80%"}} size="small" variant="outlined"></TextField>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessagesPage;
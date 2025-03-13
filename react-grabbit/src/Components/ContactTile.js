import '../Styles/ContactTile.css'
import Avatar from '@mui/material/Avatar';

function ContactTile(){

    return(
        <div className="ContactTile-container">
            <Avatar sx={{ bgcolor: "red" }}>M</Avatar>
            <p>Mr.Meow</p>
        </div>
    );

}

export default ContactTile;
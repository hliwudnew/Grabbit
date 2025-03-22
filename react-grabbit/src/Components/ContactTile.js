import '../Styles/ContactTile.css'
import Avatar from '@mui/material/Avatar';

function ContactTile({person, setReceiver}){
    function stringToHslColor(string, saturation, boldness) {
        var hash = 0;
        for (var i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        hash = hash % 360;
        return 'hsl('+hash+', '+saturation+'%, '+boldness+'%)';
    }

    return(
        <div onClick={() => setReceiver(person.sender)} className="ContactTile-container">
            <Avatar style={{
                backgroundColor: stringToHslColor(person ? person.senderName : "Adam Sandler", 40, 60)
            }}>
                {person ? person.senderName.substring(0, 1) : "A"}
            </Avatar>
            <p>{person.senderName}</p>
        </div>
    );

}

export default ContactTile;
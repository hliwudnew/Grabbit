import "../Styles/MessageTile.css"

function MessageTile({data: text}){
    return(
        text.colour === "#685be0" ?
        //Our Messages on Right
        <div className="MessageTile-container" style={{display:"flex", justifyContent:"end"}}>
            <p style={{padding:"1%", backgroundColor:text.colour, width:"fit-content"}}>{text.txt}</p>
        </div>
        :
        //Their Messages on Left
        <div className="MessageTile-container" style={{display:"flex", justifyContent:"start"}}>
            <p style={{padding:"1%", backgroundColor:text.colour, width:"fit-content"}}>{text.txt}</p>
        </div>

    )
}

export default MessageTile;
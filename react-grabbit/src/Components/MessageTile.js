import "../Styles/MessageTile.css"

function MessageTile({data: text}){
    return(
        <div className="MessageTile-container">
            <p style={{padding:"1%"}}>{text}</p>
        </div>
    )
}

export default MessageTile;
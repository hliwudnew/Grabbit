import "../Styles/HomeTile.css"
function HomeTile({img, text}){

    return(
        <div className="HomeTile-container">
            <img className="HomeTile-img" style={{width:"inherit",height:"inherit"}} src={img}></img>
            <div className="HomeTile-title">
                <h2 className="HomeTile-text">{text}</h2>
            </div>
        </div>
    );
}

export default HomeTile;
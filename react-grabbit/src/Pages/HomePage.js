import "../Styles/HomePage.css"
import rabbit from "../Images/rabbit-banner.jpg"
import HomeTile from "../Components/HomeTile";
function HomePage(){

    return(
        <div className="HomePage-content">
            <div className="HomePage-banner">
                <h2>Trying to go down the rabbit hole?<br/> Dig into any of our popular categories!</h2>
                <img style={{width:"20%",height:"10%", borderRadius:"10%"}} src={rabbit}></img>
            </div>
            <div className="HomePage-categories">
                <h2 style={{textAlign:"left"}}>Home Improvement</h2>
                <div className="HomePage-tiles">
                    <HomeTile text={"Furniture"} img={"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                    <HomeTile text={"Plants"} img={"https://images.unsplash.com/photo-1459156212016-c812468e2115?q=80&w=2010&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                    <HomeTile text={"Tools"} img={"https://images.unsplash.com/photo-1599256631012-9c2b32bfa8bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                    <HomeTile text={"Lighting"} img={"https://images.unsplash.com/photo-1523376460408-aeb5f5d051b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                    <HomeTile text={"Cleaning"} img={"https://images.unsplash.com/photo-1691057185806-ea8b5b9a4506?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                    <HomeTile text={"Bedroom"} img={"https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                    <HomeTile text={"Bathroom"} img={"https://plus.unsplash.com/premium_photo-1661902468735-eabf780f8ff6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                    <HomeTile text={"Kitchen"} img={"https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                </div>
                <h2 style={{textAlign:"left"}}>Technology</h2>
                <div className="HomePage-tiles">
                    <HomeTile text={"Laptops"} img={"https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                    <HomeTile text={"Tablets"} img={"https://images.unsplash.com/photo-1601836211234-ca6cbde9a1cb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                    <HomeTile text={"Headphones"} img={"https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                    <HomeTile text={"Speakers"} img={"https://images.unsplash.com/photo-1609702847389-b8aec1b0b929?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                    <HomeTile text={"Televisions"} img={"https://images.unsplash.com/photo-1700915705689-41f10a9131e5?q=80&w=1937&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                    <HomeTile text={"Gaming Consoles"} img={"https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                    <HomeTile text={"Video games"} img={"https://images.unsplash.com/photo-1573070253609-88bdb9cbd406?q=80&w=2001&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                    <HomeTile text={"PC Parts"} img={"https://images.unsplash.com/photo-1596697938289-68e8d0c6e8f4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
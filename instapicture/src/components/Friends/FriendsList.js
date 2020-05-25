import React from 'react';
import Css from './friendsList.css';

class FriendsList extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className={Css["alert"]} >
                <img src={require('./images/'+this.props.imgRoad)} onClick={()=>{alert("跳转到个人主页")}} 
                    alt="" />
                <label className="alert-heading">{this.props.Name}</label>        
                <hr/>
                <label>
                    {this.props.tags.map((tag,index) =>
                        (<span className={Css["badge"]} key={index}>{tag}</span>)
                    )}
                    {/* <button>+关注</button> */}
                </label>
            </div>
        )
    }
}

export default FriendsList;
import React from 'react';
import Css from './friendsList.css';
import {request} from '../../assets/js/libs/request.js';

class FriendsList extends React.Component{
    constructor(props){
        super(props)
    }
    addFri(name){
        console.log(name);
    }

    render(){
        if(this.props.i===0){
            return(
                <div className={Css["alert_head"]} >
                    <img src={this.props.imgRoad} onClick={(e)=>{this.addFri(this.props.Name)}}
                         alt="" />
                    <label className="alert-heading">{this.props.Name}</label>

                    <label>
                        {this.props.tags.map((tag,index) =>
                            (<span className={Css["badge"]} key={index}>{tag}</span>)
                        )}
                        {/* <button>+关注</button> */}
                    </label>
                </div>
            )
        }
        else{
            return(
                <div className={Css["alert"]} >
                    <img src={this.props.imgRoad} onClick={()=>{this.addFri(this.props.Name)}}
                         alt="" />
                    <label className="alert-heading">{this.props.Name}</label>

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
}

export default FriendsList;
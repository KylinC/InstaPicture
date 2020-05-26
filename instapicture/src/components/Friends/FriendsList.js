import React from 'react';
import {connect} from "react-redux";
import Css from './friendsList.css';
import {request} from '../../assets/js/libs/request.js';
import config from "../../assets/js/conf/config";
import {Toast} from "antd-mobile";

class FriendsList extends React.Component{
    constructor(props){
        super(props)
    }
    addFri(name){

        let sUrl=config.proxyBaseUrl+"/api/friends/addfriend/?token="+config.token;
        request(sUrl, "post",{uid:this.props.state.user.uid,focusname:name}).then(res=>{
            // console.log("enter",res);
            if (res.code ===200){
                Toast.info(res.data,5);
            }else{
                Toast.info(res.data,2);
            }
        });
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
export default connect((state)=>{
    return{
        state:state
    }
})(FriendsList)
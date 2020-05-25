import React from 'react';
import {connect} from "react-redux";
import  {Route,Switch}  from  'react-router-dom';
import Friendslist from '../../../src/components/Friends/FriendsList';
import asyncComponents from '../../components/async/AsyncComponent';
import config from '../../assets/js/conf/config.js';
import {request} from '../../assets/js/libs/request.js';
import Css from '../../assets/css/home/home/index.css';
import SubHeaderComponent from '../../components/header/subheader';
import action from "../../actions";
import {Toast} from "antd-mobile";

class List extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            data:[]
        };
    }

    componentDidMount(){
        this.getFriends();
        console.log(this.props.state.user.uid);
    }

    getFriends(){
        let sUrl=config.proxyBaseUrl+"/api/friends/my/?token="+config.token;
        request(sUrl, "post",{uid:this.props.state.user.uid}).then(res=>{
            // console.log("enter",res);
            if (res.code ===200){
                this.setState({data:res.data},()=>{
                    console.log(this.state.data);
                })
            }else{
                Toast.info(res.data,2);
            }
        });
        // request( config.proxyBaseUrl+"/api/friends/?token=1",'post',{"aa":"bb"}).then(res=>{
        //     console.log(res);
        // })
    }
    pushPage(url){
        this.props.history.push(config.path+url);
    }

    render(){
        var ItemView = this.state.data.map(function(item,index) {
            //return <FriendList itemData= {item} key = {index}/>
            return <Friendslist Name={item.Name} imgRoad={item.imgRoad} tags={item.tags} i={index} key={index}/>
        });
        return(

            <div>
                <SubHeaderComponent title="我的关注" right-text="搜索" onClickRightBtn={()=>{this.pushPage.bind(this, 'friends/search');}} ></SubHeaderComponent>
                {ItemView}
            </div>

        )
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(List)
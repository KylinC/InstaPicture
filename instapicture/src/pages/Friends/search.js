import React from 'react';
import Css from '../../assets/css/home/friends/search.css';
import Friendslist from '../../components/Friends/FriendsList';
import SubHeaderComponent from '../../components/header/subheader';
import {request} from '../../assets/js/libs/request.js';
import config from "../../assets/js/conf/config";
import {Toast} from "antd-mobile";

class Search extends React.Component{
    constructor(props){
        super(props)
        this.state={
            username:"",
            data:[
            ]
        }
    }
    inputChange(e){
        this.setState({
            username:e.target.value
        })
    }
    getSearch(){
        console.log(this.state.username);

        let sUrl=config.proxyBaseUrl+"/api/friends/search/?token="+config.token;
        request(sUrl, "post",{uname:this.state.username}).then(res=>{
            // console.log("enter",res);
            if (res.code ===200){
                this.setState({data:res.data},()=>{
                    console.log(this.state.data);
                })
            }else{
                Toast.info("未寻找到好友信息",2);
            }
        });
    }
    render(){
        var ItemView = this.state.data.map(function(item,index) {
            return <Friendslist Name={item.Name} imgRoad={item.imgRoad} tags={item.tags} i={index+1} key={index}/>
        });
        return (
            <div>
                <SubHeaderComponent title="搜索用户"></SubHeaderComponent>
                <div className={Css['contain']}>
                    <div className={Css["bar6"]}>
                        <form>
                            <input type="text" placeholder="请输入用户名" onChange={(e)=>this.inputChange(e)} name="cname"/>
                            <button type="button" onClick={()=>{this.getSearch()}}></button>
                        </form>
                    </div>
                </div>
                {ItemView}
            </div>
        )
    }
}

export default Search;
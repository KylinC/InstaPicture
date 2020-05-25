import React from 'react';
import  {Route,Switch}  from  'react-router-dom';
import Friendslist from '../../../src/components/Friends/FriendsList';
import asyncComponents from '../../components/async/AsyncComponent';
import config from '../../assets/js/conf/config.js';
import {request} from '../../assets/js/libs/request.js';
import Css from '../../assets/css/home/home/index.css';
import SubHeaderComponent from '../../components/header/subheader';

class List extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            test:"111",
            data:[
                {
                    Name:"simon",
                    imgRoad:'1.jpg',
                    tags:['高尔夫球', '史宾格犬', '磁带播放机']
                },
                {
                    Name:"simon",
                    imgRoad:'1.jpg',
                    tags:['高尔夫球', '史宾格犬', '111']
                }
            ]
        };
    }

    componentDidMount(){
        this.getFriends();
    }

    getFriends(){
        // let sUrl=config.proxyBaseUrl+"/api/friends/my?token="+config.token;
        // request(sUrl, "post",{})
        // .then(function(res){
        //     console.log(res);
        // })
        fetch("http://localhost:9000/testAPI")
            .then(res => res.json())
            .then(res => console.log(res));
            // .then(res => this.setState({test: res.data}));
    }

    render(){
        var ItemView = this.state.data.map(function(item,index) {
            //return <FriendList itemData= {item} key = {index}/>
            return <Friendslist Name={item.Name} imgRoad={item.imgRoad} tags={item.tags} key={index}/> 
          });
        return(
            
            <div>
                <SubHeaderComponent title="我的关注" right-text="搜索" ></SubHeaderComponent>
                {ItemView}
            </div>
        
        )
    }
}

export default List;
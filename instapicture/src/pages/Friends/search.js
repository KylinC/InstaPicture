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
                {
                    Name:"lucy",
                    imgRoad:'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-25-aa.jpg',
                    tags:['只爱美剧',"品茶"]
                },
                {
                    Name:"simon",
                    imgRoad:'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-04-29-%E6%88%AA%E5%B1%8F2020-04-29%20%E4%B8%8B%E5%8D%888.29.19.png',
                    tags:['非洲鼓', '烘焙', '萌萌哒']
                },
                {
                    Name:"小问号的朋友",
                    imgRoad:'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-25-6e7f837cly1gexlxjjkdgj21d81d8n8o.jpg',
                    tags:['玄不救非，氪不改命']
                },
                {
                    Name:"Morty",
                    imgRoad:'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-25-074422.jpg',
                    tags:['有点怂','青春期小孩']
                },
                {
                    Name:"三楼的男票",
                    imgRoad:'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-25-6e7f837cly1gexlxjwzzaj21d81d8amb.jpg',
                    tags:['写代码太恶心了']
                }
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
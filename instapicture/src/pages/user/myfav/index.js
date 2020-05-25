import React from 'react';
import {connect} from "react-redux";
import { Modal} from 'antd-mobile';
import config from '../../../assets/js/conf/config.js';
import {safeAuth,lazyImg} from '../../../assets/js/utils/util.js';
import UpRefresh from '../../../assets/js/libs/uprefresh.js';
import {request} from '../../../assets/js/libs/request.js';
import SubHeaderComponent from '../../../components/header/subheader';
import Css from '../../../assets/css/user/myfav/index.css';
import styles from './css/ListItemStyle.css'
import Content from './homePage/content.js';
import Person from './homePage/Personinfo.js';
import imgURL from '../../../assets/images/home/index/ins-title.png';

class  MyFav extends React.Component{
    constructor(props){
        super(props);
        safeAuth(props);
        this.state = {
            myinfo:{},
            mycontent:[]
        }
        this.bScroll=true;
        this.oUpRefresh=null;
        this.curPage=1;
        this.maxPage=0;
        this.offsetBottom=100;
    }
    componentDidMount(){
        this.getReco();
       
    }
    componentWillUnmount(){
        this.oUpRefresh=null;
        this.setState=(state,callback)=>{
            return;
        }
    }
    pushPage(url){
        this.props.history.push(config.path+url);
    }
    getReco(){
        request(config.proxyBaseUrl+"/api/userinfos/queryinfo?token="+config.token,"post",{uid:this.props.state.user.uid}).then(res=>{
            if (res.code ===200){
                this.setState({myinfo:res.data},()=>{
                    lazyImg();
                })
            }
        } );
        request(config.proxyBaseUrl+"/api/items/queryinfo?token="+config.token,"post",{uid:this.props.state.user.uid}).then(res=>{
            if (res.code ===200){
                this.setState({mycontent:res.data},()=>{
                    lazyImg();
                })
            }
        } );

    }
    render(){
        return(
            <div>
                <div className={Css['page']}>   
                <SubHeaderComponent title="我的主页"></SubHeaderComponent>
                <div className={Css['user-info-wrap']}>
                    <div className={Css['head']}><img className={Css['im-title']} src={imgURL} /></div>
                </div>
               <Person data={this.state.myinfo}/>
               <Content data={this.state.mycontent}/>
                </div>
        
            
            </div>
            
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(MyFav)
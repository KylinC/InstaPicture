import React from 'react';
import Swiper from '../../../assets/js/libs/swiper.min.js';
import config from '../../../assets/js/conf/config.js';
import {request} from '../../../assets/js/libs/request.js';
import {connect} from "react-redux";
import {lazyImg,setScrollTop} from '../../../assets/js/utils/util.js';
import "../../../assets/css/common/swiper.min.css";
import Css from '../../../assets/css/home/index/index.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faList, faUserCircle} from '@fortawesome/free-solid-svg-icons'

import WeiBoList from './contentPage/WeiBoList.js' ;
import Recitem from './data/item.json';
import Recfriend from './data/friend.json';

import styles from './css/ListItemStyle.css'
import FriendList from './contentPage/friendList.js';


class IndexComponent extends React.Component{
    constructor(){
        super();
        this.state = {
            sRecfriend:[],
            sRecitem:[],
            bScroll:false,
            pageStyle:{display:"none"}
        }
        this.bScroll=true;
        this.friend=[];
        this.items=[];
    }
    componentDidMount(){
        this.getReco();
        setScrollTop(global.scrollTop.index);
        window.addEventListener("scroll",this.eventScroll.bind(this),false);
       
       
    }
    componentWillUnmount(){
        this.bScroll=false;
        window.removeEventListener("scroll",this.eventScroll.bind(this));
        this.setState=(state,callback)=>{
            return;
        }
    }
    eventScroll(){
        if (this.bScroll) {
            let iScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            global.scrollTop.index = iScrollTop;
            if (iScrollTop >= 80) {
                this.setState({bScroll: true})
            } else {
                this.setState({bScroll: false})
            }
        }
    }

    pushPage(pUrl){
        this.props.history.push(config.path+pUrl)
    }

    getReco(){
        for(var i = 0, len = Recfriend.data.length; i < len; i++){
            request(config.proxyBaseUrl+"/api/userinfos/queryinfo?token="+config.token,"post",{uid: Recfriend.data[i]}).then(res=>{
                if (res.code ===200){
                     this.friend.push(res.data);
                }
            } )
        };
        for(var i = 0, len = Recitem.data.length; i < len; i++){
            request(config.proxyBaseUrl+"/api/items/queryID?token="+config.token,"post",{uid: Recitem.data[i]}).then(res=>{
                if (res.code ===200){
                     this.items.push(res.data);
                }
            } )
        };
        this.setState({sRecfriend:this.friend},()=>{
            console.log(this.state.sRecfriend);
        });
        this.setState({sRecitem:this.items},()=>{
            console.log(this.state.sRecitem);
        });
        
    }
    
    render(){
        
        return(
            <div>
                {this.state.bScroll?(
                    <div className={Css['page']}>
                         <div className={this.state.bScroll?Css['search-header']+" "+Css["red-bg"]:Css['search-header']+" "+Css["red-bg"]}>
                              <div className={Css['classify-icon']}>
                                <FontAwesomeIcon size="lg" icon={faList} />
                    </div>

                    <div className={Css['login-wrap']}>
                        {
                            this.props.state.user.isLogin?<div className={Css['my']} onClick={this.pushPage.bind(this, "home/my")}></div>:<div className={Css['login-text']} onClick={this.pushPage.bind(this, "login/index")}>
                                <FontAwesomeIcon size="lg" icon={faUserCircle} />
                            </div>
                        }
                    </div>
                  </div>
                 </div>
                ):(null)}
                <div>
                <div className={styles.header}>
                    <h1>InstaPicture</h1>
                    <p>welcome</p>
                </div>
                <div className={styles.item}>
                 <div className={styles.part}>
                    可能感兴趣的陌生人
                </div>
               </div>
               <FriendList data={this.state.sRecfriend} />
                <div className={styles.item}>
                 <div className={styles.part}>
                    可能感兴趣的内容
                </div>
               </div>
                <WeiBoList data={this.state.sRecitem} />
                <div className={styles.footer}>
                    meet what you want
                </div>
            </div>
              
            </div>
             
         
            
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(IndexComponent)
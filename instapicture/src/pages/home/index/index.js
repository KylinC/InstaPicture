import React from 'react';
//import { PanResponder,Alert} from "react-native";
import Swiper from '../../../assets/js/libs/swiper.min.js';
import config from '../../../assets/js/conf/config.js';
import {request} from '../../../assets/js/libs/request.js';
import {connect} from "react-redux";
import {lazyImg,setScrollTop} from '../../../assets/js/utils/util.js';
import "../../../assets/css/common/swiper.min.css";
import Css from '../../../assets/css/home/index/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faList, faUserCircle, faPlusCircle} from '@fortawesome/free-solid-svg-icons'
import imgURL from '../../../assets/images/home/index/ins-title.png';

import WeiBoList from './contentPage/WeiBoList.js' ;
import Recitem from './data/item.json';
import Recfriend from './data/friend.json';

import styles from './css/ListItemStyle.css'
import FriendList from './contentPage/friendList.js';


class IndexComponent extends React.Component{
    constructor(){
        super();
        this.state = {
            bMask:false,
            sCartPanel:Css['down'],
            sRecfriend:[],
            sRecitem:[],
            bScroll:false,
            isFresh:false,
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
    //     this._panResponder = PanResponder.create({
    //         //监听的事件回调,必须设为true,否则事件无法监听
    //          onStartShouldSetPanResponder: () => true,
    //          onMoveShouldSetPanResponder: ()=> true,

    //          onPanResponderMove: (evt,gs)=>{
    //              //可自定义滑动距离
    //              if (gs.dy >= 220){
    //                  this.setState({
    //                      isFresh:true,
    //                  })
    //              }

    //          },

    //          onPanResponderRelease:() => {
    //            if (this.state.isFresh){
    //                Alert.alert("大于等于220")
    //                this.setState({
    //               //需置为false,否则就失去了监听的效果
    //               isFresh:false,
    //                })
    //            }
    //          },

    //      });
    //    if(this.state.isFresh){
    //        this.pushPage.bind(this,"home/index")
    //    }
    }
    componentWillUnmount(){
        this.bScroll=false;
        window.removeEventListener("scroll",this.eventScroll.bind(this));
        this.setState=(state,callback)=>{
            return;
        };

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

    showCartPanel(){
        this.refs['mask'].addEventListener("touchmove",function (e) {
            e.preventDefault();
        },false);
        this.setState({sCartPanel:Css['up'],bMask:true});
    }
    hideCartPanel(){
        if (!this.bMove){
            this.setState({sCartPanel:Css['down'],bMask:false});
        }
    }

    getReco(){
            request(config.proxyBaseUrl+"/api/userinfos/queryID?token="+config.token,"post",{uid:Recfriend.data}).then(res=>{
                if (res.code ===200){
                    this.setState({sRecfriend:res.data},()=>{
                    });
                }
            } );
            request(config.proxyBaseUrl+"/api/items/queryID?token="+config.token,"post",{uid: Recitem.data}).then(res=>{
                if (res.code ===200){
                    this.setState({sRecitem:res.data},()=>{
                    });
                }
            } );
    }
    
    render(){
        
        return(
            <div>
                {true?(
                    <div className={Css['page']}>
                         <div className={this.state.bScroll?Css['search-header']+" "+Css["red-bg"]:Css['search-header']+" "+Css["red-bg"]}>
                              <div className={Css['classify-icon']} onClick={this.showCartPanel.bind(this)}>
                                <FontAwesomeIcon size="lg" icon={faPlusCircle} />
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
                <div className={Css['user-info-wrap']}>
                    <div className={Css['head']}><img className={Css['im-title']} src={imgURL} /></div>
                </div>

                <div className={styles.item}>
                 <div className={styles.part}>
                    可能感兴趣的陌生人
                </div>
               </div>
               <div className={styles.item}>
               {this.state.sRecfriend!=undefined? <FriendList data={this.state.sRecfriend} />:''}
               </div>
                <div className={styles.item}>
                 <div className={styles.part}>
                    可能感兴趣的内容
                </div>
               </div>
               <div className={styles.item}>
               {this.state.sRecitem!=undefined?  <WeiBoList data={this.state.sRecitem} />:''}
               </div>
                <div className={styles.footer}>
                    meet what you want
                </div>
               </div>

        <div ref="mask" className={this.state.bMask?Css['mask']:Css['mask']+" hide"}></div>
            <div ref="cart-panel" className={Css['cart-panel']+" "+this.state.sCartPanel}>
            <div ref="goods-info" className={Css['goods-info']}>
            <div className={Css['close-panel-wrap']}>
            <div className={Css['spot']}></div>
            <div className={Css["line"]}></div>
            <div className={Css['close']} onClick={this.hideCartPanel.bind(this)}></div>
            </div>

        </div>
        <div className={Css['attr-wrap']}>

            </div>
            <div className={Css['amount-wrap']}>

            </div>
            <div className={Css['sure-btn']}>发布</div>
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
import React from 'react';
import config from '../../../assets/js/conf/config.js';
import {request} from '../../../assets/js/libs/request.js';
import {connect} from "react-redux";
import {safeAuth, lazyImg,setScrollTop} from '../../../assets/js/utils/util.js';
import "../../../assets/css/common/swiper.min.css";
import Css from '../../../assets/css/home/index/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUserCircle, faPlusCircle} from '@fortawesome/free-solid-svg-icons'
import imgURL from '../../../assets/images/home/index/ins-title.png';
import {Toast} from "antd-mobile";

import WeiBoList from './contentPage/WeiBoList.js' ;

import styles from './css/ListItemStyle.css'
import FriendList from './contentPage/friendList.js';


class IndexComponent extends React.Component{
     constructor(props){
        super(props);
        safeAuth(props);
        this.state = {
            bMask:false,
            sCartPanel:Css['down'],
            sRecfriend:[],
            sRecitem:[],
            RecFriendIDs:[],
            RecItemIDs:[],
            bScroll:false,
            isFresh:false,
            pageStyle:{display:"none"},
            uploads:"http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-26-download.jpg",
            uploadsfile:"",
            uploadscom:""
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
    uploadImg(){
        let formData = new FormData();
        formData.append('imgfile', this.refs['imgfile'].files[0]);

        let sUrl=config.proxyBaseUrl+"/api/items/uploadimg";
        // console.log(this.refs['headfile'].files[0]);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', config.proxyBaseUrl+"/api/items/uploadimg");
        xhr.onreadystatechange=()=>{
            if(xhr.readyState == 4 && xhr.status == 200){
                var res=eval('(' + xhr.responseText + ')');
                if (res.code===200){
                    // console("callback succ");
                    this.setState({uploads:"http://localhost/"+res.data.generatename});
                    this.setState({uploadsfile:res.data.generatename});
                }
            }
        }
        xhr.onload = function() {
            // console.log(xhr);
        }
        xhr.send(formData);
    }
    comChange(e){
        this.setState({
            uploadscom:e.target.value
        })
    }
    async sureUpload(){
        var tmp_image_id;
        var tmp_item_id;
        // console.log(this.state.uploads,this.state.uploadsfile,this.state.uploadscom);
        let sUrl=config.proxyBaseUrl+"/api/items/release/?token="+config.token;

        await request(sUrl, "post",{uid:this.props.state.user.uid,upic:this.state.uploadsfile,ucomment:this.state.uploadscom}).then(res=>{
            // console.log("enter",res);
            if (res.code ===200){
                if (!this.bMove){
                    this.setState({sCartPanel:Css['down'],bMask:false});
                }
                Toast.info(res.data,3);
                this.setState({uploads:"http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-26-download.jpg",uploadscom:''});
                tmp_image_id = res.image_id;
                tmp_item_id = res.item_id
            }else{
                Toast.info("发布未成功",2);
            }
        });
        if (!this.bMove){
            this.setState({sCartPanel:Css['down'],bMask:false});
        }
        Toast.info("发布成功",2);

        sUrl=config.proxyBaseUrl+"/python/update_image_feature?token="+config.token;
        await request(sUrl, "post",{uimgid: tmp_image_id, uweight:2.0}).then(res=>{
            // console.log('update image feature: ' + res.success)
        });
        sUrl=config.proxyBaseUrl+"/python/update_item_feature?token="+config.token;
        await request(sUrl, "post",{uitemid: tmp_item_id}).then(res=>{
            // console.log('update item feature: ' + res.success)
        });
        await request(config.proxyBaseUrl+'/python/update_user_feature?token='+config.token,
            "post", {uid: this.props.state.user.uid}).then(res=>{
            // console.log('update user feature: ' + res.success)
        });
    }
    async getReco(){
        await request(config.proxyBaseUrl+"/python/get_rec_items?token="+config.token,"post",
            {uid: this.props.state.user.uid}).then(res=>{
            if (res.code ===200){
                this.setState({RecItemIDs:res.data},()=>{
                });
            }
        } ).catch(err=>{console.log(err)});
        await request(config.proxyBaseUrl+"/python/get_rec_users?token="+config.token,"post",
            {uid: this.props.state.user.uid}).then(res=>{
            if (res.code ===200){
                this.setState({RecFriendIDs:res.data},()=>{
                });
            }
        } ).catch(err=>{console.log(err)});
        await request(config.proxyBaseUrl+"/api/items/queryID?token="+config.token,"post",
            {uid: this.state.RecItemIDs}).then(res=>{
            if (res.code ===200){
                this.setState({sRecitem:res.data},()=>{
                });
            }
        } );
        await request(config.proxyBaseUrl+"/api/userinfos/queryID?token="+config.token,"post",
            {uid: this.state.RecFriendIDs}).then(res=>{
            if (res.code ===200){
                this.setState({sRecfriend:res.data},()=>{
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
                 <div style={{marginLeft:10}}>可能感兴趣的陌生人</div>
                </div>
               </div>
               <div className={styles.item}>
               {this.state.sRecfriend!=undefined? <FriendList data={this.state.sRecfriend} />:''}
               </div>
                <div className={styles.item}>
                 <div className={styles.part}>
                 <div style={{marginLeft:10}}>可能感兴趣的内容</div>
                </div>
               </div>
               <div className={styles.item}>
               {this.state.sRecitem!=undefined?  <WeiBoList data={this.state.sRecitem} />:''}
               </div>
                <div className={styles.footer}>
                     dreamed a dream in times gone by.
                </div>
               </div>

            <div ref="mask" className={this.state.bMask?Css['mask']:Css['mask']+" hide"}></div>
                <div ref="cart-panel" className={Css['cart-panel']+" "+this.state.sCartPanel}>
                <div ref="goods-info" className={Css['goods-info']}>
                    <div className={Css['close-panel-wrap']}>
                    <div className={Css['close']} onClick={this.hideCartPanel.bind(this)}></div>
                    </div>
                </div>
                <div className={Css['attr-wrap']}>
                    <div className={Css['main']}>
                        <ul className={Css['head']}>
                        <li></li>
                        <li><img src={this.state.uploads} alt=""/><input ref="imgfile" type="file" onChange={this.uploadImg.bind(this)}/></li>
                        </ul>
                    </div>
                </div>
                <div className={Css['amount-wrap']}>
                    <input className={Css['amount-name']} type="text" placeholder="输入你的评论吧！" onChange={(e)=>this.comChange(e)} value={this.state.uploadscom}/>
                </div>
                <div className={Css['sure-btn']} onClick={this.sureUpload.bind(this)}>发布</div>
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
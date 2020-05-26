import React, { Component, PropTypes } from 'react';
import {connect} from "react-redux";
import config from '../../../../assets/js/conf/config.js';
import {safeAuth,lazyImg} from '../../../../assets/js/utils/util.js';
import UpRefresh from '../../../../assets/js/libs/uprefresh.js';
import {request} from '../../../../assets/js/libs/request.js';
import styles from '../css/ListItemStyle.css' ;

//导入评论组件
import CommentForm from './CommentForm' ;



/**
 * 取得当前时间
 * @return {[type]} [description]
 */
function getCurrentFormatDate() {
  var date = new Date() ;
  var seperator1 = "-" ;
  var seperator2 = ":" ;
  var month = date.getMonth() + 1 ;
  var strDate = date.getDate() ;
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " + date.getHours() + seperator2 + date.getMinutes()
          + seperator2 + date.getSeconds();
  return currentdate;
}

/**
 * 微博评论列表组件
 */
class WeiBoListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storagepath:'',
      figurepath:'',
      name:'',
      //点赞数
      likeNum:this.props.itemData.ProsNum,
      //反对数
      unlikeNum:this.props.itemData.ConsNum,
      commentNum:this.props.itemData.CommentNum
    }
  }
  componentDidMount(){
    this.getReco();
  }
  getReco(){ 
    request(config.proxyBaseUrl+"/api/images/queryinfo?token="+config.token,"post",{uid:this.props.itemData.ImageID}).then(res=>{
      if (res.code ===200){
            this.setState({storagepath:res.data},()=>{
                lazyImg();
            })
        }
    } );
    request(config.proxyBaseUrl+"/api/userinfos/queryinfo?token="+config.token,"post",{uid:this.props.itemData.OwnerID}).then(res=>{
      if (res.code ===200){
          this.setState({figurepath:res.data.head},()=>{
              lazyImg();
          });
          this.setState({name:res.data.nickname},()=>{
            lazyImg();
        });
      }
    } )

  }
  //渲染界面
  render() {
    let data = this.props.itemData;
    return (
      <div>
          {this._renderHeadView(data)}
          {this._renderFooterView()}
          {<CommentForm itemdata={this.props.itemData.CommentIDList} itemid={this.props.itemData.ItemID} comnum={this.props.itemData.CommentNum} clist={this.props.itemData.CommentIDList}/>}
        </div>
     );
  }

  /**
   * 渲染顶部View
   */
  _renderHeadView(data){
    return(
      <div className={styles.item}>
        <img src={require("../../../../assets/images/common/lazyImg.jpg")} data-echo={this.state.figurepath} className={styles.imgStyle}></img>
        <div className={styles.topRightView}>
          <div className={styles.nickNameAndSendTime}>
            <span>{this.state.name}</span> 
          </div>
          <img src={require("../../../../assets/images/common/lazyImg.jpg")} data-echo={"http://localhost/"+ this.state.storagepath} className={styles.fakeimg}></img>
          <p>{data.Text}</p>
        </div>
      </div>
    )
  }

  /**
   * 渲染底部View
   */
   _renderFooterView(){
       return(
         <div className={styles.commentViewStyle}>
           <ul className={styles.butstyle}>
             {/* 此处新增方法 */}
             <li className={styles.button} onClick={this._dianzan.bind(this)}>点赞:{this.state.likeNum}</li><div className={styles.shuxian}></div>
             <li className={styles.button} >评论:{this.state.commentNum}</li><div className={styles.shuxian}></div>
             <li className={styles.button} onClick={this._fandui.bind(this)}>反对:{this.state.unlikeNum}</li><div className={styles.shuxian}></div>
           </ul>
         </div>
       );
   }


     /**
      * 点赞方法
      */
     _dianzan(){
       //取得当前时间
      let currentTime = getCurrentFormatDate();
      var date = new Date() ;
      let Pid=Number(date)+Number(this.props.itemData.ItemID)+Number(this.props.state.user.uid);
      let sUrl1=config.proxyBaseUrl+"/api/pros/give_pro?token="+config.token;
      request(sUrl1, "post",{proid:Pid,itemid:this.props.itemData.ItemID,userid:this.props.state.user.uid,time:currentTime}).then(res=>{
          if (res.code ===200){
              console.log("pro sumbmit to db")
          }
      });
      let sUrl2=config.proxyBaseUrl+"/api/items/updateitem?token="+config.token;
      request(sUrl2, "post",{uid:this.props.itemData.ItemID,prosnum:parseInt(this.state.likeNum)+1,consnum:this.props.itemData.ConsNum,commentnum:this.props.itemData.CommentNum}).then(res=>{
        if (res.code ===200){
            console.log("pro sumbmit to Items")
        }
      });
       this.setState({
         likeNum:parseInt(this.state.likeNum)+1
       })
     }
      /**
       * 反对方法
       */
     _fandui(){
       //取得当前时间
      let currentTime = getCurrentFormatDate();
      var date = new Date() ;
      let Cid=Number(date)+Number(this.props.itemData.ItemID)+Number(this.props.state.user.uid);
      let sUrl1=config.proxyBaseUrl+"/api/cons/give_con?token="+config.token;
      request(sUrl1, "post",{conid:Cid,itemid:this.props.itemData.ItemID,userid:this.props.state.user.uid,time:currentTime}).then(res=>{
          if (res.code ===200){
              console.log("con sumbmi to db")
          }
      });
      let sUrl2=config.proxyBaseUrl+"/api/items/updateitem?token="+config.token;
      request(sUrl2, "post",{uid:this.props.itemData.ItemID,prosnum:this.props.itemData.ProsNum,consnum:parseInt(this.state.unlikeNum)+1,commentnum:this.props.itemData.CommentNum}).then(res=>{
        if (res.code ===200){
            console.log("con sumbmit to Items")
        }
      });
       this.setState({
        unlikeNum:parseInt(this.state.unlikeNum)+1
       })
     }

 }
 export default connect((state)=>{
  return{
      state:state
  }
})(WeiBoListItem)

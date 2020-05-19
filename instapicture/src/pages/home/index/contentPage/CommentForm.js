import React, { Component, PropTypes } from 'react';
import {connect} from "react-redux";
import config from '../../../../assets/js/conf/config.js';
import {safeAuth,lazyImg} from '../../../../assets/js/utils/util.js';
import UpRefresh from '../../../../assets/js/libs/uprefresh.js';
import {request} from '../../../../assets/js/libs/request.js';
import styles from '../css/commentStyle.css';
import CommentReplyList from './CommentReplyList' ;


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
 * 评论组件
 */
class CommentForm extends Component {


  constructor(props) {
    super(props);
    safeAuth(props);
    this.state =  {
      //默认回复内容为空
      replycontents:[]
    }
  }
  componentDidMount(){
    this.getReco();
  }
  getReco(){
    var com=[];
    if(this.props.itemdata!=undefined){
      for(var i = 0, len = this.props.itemdata.length; i < len; i++){
        request(config.proxyBaseUrl+"/api/comments/queryID?token="+config.token,"post",{uid: this.props.itemdata[i]}).then(res=>{
            if (res.code ===200){
                 com.push(res.data);
            }
        } )
    };
    };
    this.setState({replycontents:com});
  }

  render() {
    //遍历评论内容
    var replyContentDatas = this.state.replycontents.map(function(data,index) {
     return(
        <CommentReplyList key={index} reply={data}/>
     );
   });

   return (
      <div className={styles.rootView}>
        <div className={styles.headView}>
          {/* 回复的文本框 */}
            <div className={styles.textareaViewStyle}>
              <textarea cols='4' rows='4' ref="content"/>
              <button className={styles.commentBtnStyle} onClick={this._reply.bind(this)}>评论</button>
            </div>
        </div>
        {/* 回复内容 */}
            {replyContentDatas}
      </div>
     );
  }

  /**
   * 回复评论功能
   */
  _reply(){
      //取得当前时间
      let currentTime = getCurrentFormatDate();
      //取得回复的内容
      let recontent = this.refs.content.value;
      if(recontent.length==0){
        alert('评论内容不能为空！')
        return ;
      }
      let newContent = {
        CommentUserID:this.props.state.user.uid,
        CommentText:recontent,
        Time:currentTime,
      }
      //取得老的回复内容
      let oldRepContent = this.state.replycontents,
      //新的回复内容和老的回复内容叠加起来
      newRplContent = oldRepContent.concat(newContent);//数组的叠加
      //
      this.setState({
          replycontents:newRplContent,
      });
      //清空输入框内容
      this.refs.content.value = "";

      var date = new Date() ;
      let Cid=Number(date)+Number(this.props.itemid)+Number(this.props.state.user.uid);
      let sUrl1=config.proxyBaseUrl+"/api/comments/give_comment?token="+config.token;
      request(sUrl1, "post",{comid:Cid,itemid:this.props.itemid,userid:this.props.state.user.uid,content:recontent,time:currentTime}).then(res=>{
          if (res.code ===200){
              console.log("comment sumbmi to db")
          }
      });
      let sUrl2=config.proxyBaseUrl+"/api/items/updateComment?token="+config.token;
      request(sUrl2, "post",{uid:this.props.itemid,commentnum:parseInt(this.props.comnum)+1}).then(res=>{
        if (res.code ===200){
            console.log("comment sumbmit to Items")
        }
      });
      var new_list=[String];
      new_list=this.props.clist;
      new_list.push(Cid);
      console.log(new_list);
      let sUrl3=config.proxyBaseUrl+"/api/items/updateComment2?token="+config.token;
      request(sUrl3, "post",{uid:this.props.itemid,CList:new_list}).then(res=>{
        if (res.code ===200){
            console.log("comment list sumbmit to Items")
        }
      });
  }
}
export default connect((state)=>{
  return{
      state:state
  }
})(CommentForm)
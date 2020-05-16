import React, { Component, PropTypes } from 'react';
import config from '../../../../assets/js/conf/config.js';
import {safeAuth,lazyImg} from '../../../../assets/js/utils/util.js';
import UpRefresh from '../../../../assets/js/libs/uprefresh.js';
import {request} from '../../../../assets/js/libs/request.js';
import styles from '../css/ListItemStyle.css' ;

//导入评论组件
import CommentForm from './CommentForm' ;



/**
 * 微博评论列表组件
 */
export default class WeiBoListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storagepath:'',
      figurepath:'',
      name:'',
      //点赞数
      likeNum:this.props.itemData.prosNum,
      //反对数
      unlikeNum:this.props.itemData.consNum,
      commentNum:this.props.itemData.commentNum
    }
  }
  componentDidMount(){
    this.getReco();
  }
  getReco(){
    request(config.proxyBaseUrl+"/api/images/queryinfo?token="+config.token,"post",{uid:this.props.itemData.imageID}).then(res=>{
        if (res.code ===200){
            this.setState({storagepath:res.data},()=>{
                lazyImg();
            })
        }
    } );
    request(config.proxyBaseUrl+"/api/userinfos/queryinfo?token="+config.token,"post",{uid:this.props.itemData.ownerID}).then(res=>{
      if (res.code ===200){
          this.setState({figurepath:res.data.head},()=>{
              lazyImg();
          });
          this.setState({name:res.data.nickname})
      }
    } )

  }
  //渲染界面
  render() {
    this.console.log(this.props.itemData);
    let data = this.props.itemData ;

    return (
      <div>
          {this._renderHeadView(data)}
          {this._renderFooterView(data)}
          {/* 点击评论按钮 则展开评论组件，否则隐藏  新添加的方法*/}
          <CommentForm itemdata={this.props.itemData.commentIDList}/>
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
          <img src={require("../../../../assets/images/common/lazyImg.jpg")} data-echo={this.state.storagepath} className={styles.fakeimg}></img>
          <p>{this.props.itemData.text}</p>
        </div>
      </div>
    )
  }

  /**
   * 渲染底部View
   */
   _renderFooterView(data){
       return(
         <div className={styles.commentViewStyle}>
           <ul className={styles.butstyle}>
             {/* 此处新增方法 */}
             <li className={styles.button} onClick={this._dianzan.bind(this)}>点赞:{this.state.likeNum}</li><div className={styles.shuxian}></div>
             <li className={styles.button} onClick={this._comment.bind(this)}>评论:{this.state.commentNum}</li><div className={styles.shuxian}></div>
             <li className={styles.button} onClick={this._fandui.bind(this)}>反对:{this.state.unlikeNum}</li><div className={styles.shuxian}></div>
           </ul>
         </div>
       );
   }

   /**
    * 评论方法
    */
   _comment(){
       this.setState({
         isComment:true
       })
     }
     /**
      * 点赞方法
      */
     _dianzan(){
       this.setState({
         isComment:false,
         likeNum:parseInt(this.state.likeNum)+1,
       })
     }
      /**
       * 反对方法
       */
     _fandui(){
       this.setState({
        isComment:false,
        unlikeNum:parseInt(this.state.unlikeNum)+1,
       })
     }

 }

import React, { Component, PropTypes } from 'react';

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
      //是否点击评论按钮标志
      isComment:false,
      //默认的条目数据
      itemData:this.props.itemData,
      //默认的点赞数
      likeNum:this.props.itemData.like,
      //默认的反对数
      unlikeNum:this.props.itemData.unlike
    }
  }
  //渲染界面
  render() {

    let data = this.props.itemData ;

    return (
      <div>
          {this._renderHeadView(data)}
          {this._renderFooterView(data)}
          {/* 点击评论按钮 则展开评论组件，否则隐藏  新添加的方法*/}
          {this.state.isComment?  <CommentForm itemdata={this.props.itemData.comments}/>:null}
        </div>
     );
  }

  /**
   * 渲染顶部View
   */
  _renderHeadView(data){
    return(
      <div className={styles.item}>
        <img src={require('../img/tiger.jpg')} className={styles.imgStyle}></img>
        <div className={styles.topRightView}>
          <div className={styles.nickNameAndSendTime}>
            <span>{data.nickName}</span> 
            <span>{data.sendTime}</span>
          </div>
          <img src={require('../img/tiger.jpg')} className={styles.fakeimg}></img>
          <p>{data.content}</p>
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
             <li className={styles.button} onClick={this._comment.bind(this)}>评论:{data.comment}</li><div className={styles.shuxian}></div>
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

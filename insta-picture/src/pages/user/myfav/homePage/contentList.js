import React, { Component, PropTypes } from 'react';

import styles from '../css/ListItemStyle.css' ;

/**
 * 微博评论列表组件
 */
export default class ContentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //默认的条目数据
      itemData:this.props.itemData,
      //默认的点赞数
      likeNum:this.props.itemData.NoCollect,
      //默认的反对数
      unlikeNum:this.props.itemData.NoPointGreat
    }
  }
  //渲染界面
  render() {

    let data = this.props.itemData ;

    return (
      <div>
          {this._renderHeadView(data)}
          {this._renderFooterView(data)}
          <hr className={styles.hrStyle}/>
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
             <li className={styles.button} >点赞:{this.state.likeNum}</li><div className={styles.shuxian}></div>
             <li className={styles.button} >评论:{data.NoComment}</li><div className={styles.shuxian}></div>
             <li className={styles.button} >反对:{this.state.unlikeNum}</li><div className={styles.shuxian}></div>
           </ul>
         </div>
       );
   }

 }

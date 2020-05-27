import React, { Component, PropTypes } from 'react';
import config from '../../../../../assets/js/conf/config.js';
import {safeAuth,lazyImg} from '../../../../../assets/js/utils/util.js';
import UpRefresh from '../../../../../assets/js/libs/uprefresh.js';
import {request} from '../../../../../assets/js/libs/request.js';
import styles from '../../css/ListItemStyle.css' ;

/**
 * 微博评论列表组件
 */
export default class ContentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storagepath:'',
      figurepath:'',
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
          })
      }
  } )

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
        <img src={require("../../../../../assets/images/common/lazyImg.jpg")} data-echo={this.state.figurepath} className={styles.imgStyle}></img>
        <div className={styles.topRightView}>
          <div className={styles.nickNameAndSendTime}>
          <p style={{marginTop:40}}>{data.Text}</p>
          </div>
          <img src={require("../../../../../assets/images/common/lazyImg.jpg")} data-echo={"http://localhost/"+ this.state.storagepath} className={styles.fakeimg}></img>
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
            <div className={styles.item}>
          <ul className={styles.butstyle}>
             {/* 此处新增方法 */}
             <li className={styles.button} >点赞:{this.state.likeNum}</li><div className={styles.shuxian}></div>
             <li className={styles.button} >评论:{this.state.commentNum}</li><div className={styles.shuxian}></div>
             <li className={styles.button} >反对:{this.state.unlikeNum}</li><div className={styles.shuxian}></div>
           </ul>
           </div>
         </div>
       );
   }

 }

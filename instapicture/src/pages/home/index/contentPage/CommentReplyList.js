import React, { Component, PropTypes } from 'react';
import config from '../../../../assets/js/conf/config.js';
import {safeAuth,lazyImg} from '../../../../assets/js/utils/util.js';
import UpRefresh from '../../../../assets/js/libs/uprefresh.js';
import {request} from '../../../../assets/js/libs/request.js';
import styles from '../css/commentStyle.css';

/**
 * 评论列表组件
 */
export default class CommentReplyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      figurepath:'',
      name:''
    }
  }
  componentDidMount(){
    this.getReco();
  }
  getReco(){
    request(config.proxyBaseUrl+"/api/userinfos/queryinfo?token="+config.token,"post",{uid:this.props.reply.CommentUserID}).then(res=>{
      if (res.code ===200){
          this.setState({figurepath:res.data.head},()=>{
              lazyImg();
          });
          this.setState({name:res.data.nickname})
      }
    } )

  }
  render() {

    let replyContent = this.props.reply ;

    return (
      <div className={styles.commentListStyle}>
        <img src={require("../../../../assets/images/common/lazyImg.jpg")} data-echo={this.state.figurepath} className={styles.img} />
            <div className={styles.commentContentStyle}>
              <div className={styles.nickNameStyle}>
                <span>{this.state.name}</span>
                <span>{this.props.reply.Text}</span>
              </div>
              <span className={styles.timeSize}>{this.props.reply.Time}</span>
            </div>
      </div>
    );
  }
}

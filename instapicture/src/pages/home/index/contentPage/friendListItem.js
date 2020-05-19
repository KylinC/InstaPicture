import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router-dom';
import styles from '../css/ListItemStyle.css' ;
import config from '../../../../assets/js/conf/config.js';

export default class FriendListItem extends Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      let datas=this.props.itemData;
        return(
          <div>
            <div className={styles.littlepart}>
              <a><img src={require("../../../../assets/images/common/lazyImg.jpg")} data-echo={datas.ProfileImagePath} className={styles.imgStyle}></img></a>
              <a className={styles.wid}> ID: {datas.UserID}</a>
              <a className={styles.wid}>{datas.UserName}</a>
              <span><Link to={{pathname:config.path+"home/index/personalpage/index",state:datas.UserID}}>主页</Link></span>
            </div>
          </div>
  
        ) ;
  }
  }
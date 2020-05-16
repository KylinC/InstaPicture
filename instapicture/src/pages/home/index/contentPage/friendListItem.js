import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router-dom';
import styles from '../css/ListItemStyle.css' ;
import config from '../personalpage/config.js';

export default class FriendListItem extends Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      console.log(this.props.itemData);
        return(
          <div>
            <div className={styles.littlepart}>
              <a><img src={require("../../../../assets/images/common/lazyImg.jpg")} data-echo={this.props.itemData.head} className={styles.imgStyle}></img></a>
              <a className={styles.wid}> ID: {this.props.itemData.uid}</a>
              <a className={styles.wid}>{this.props.itemData.nickname}</a>
              <a><Link to={config.path+"home/index/personalpage/index"}>访问主页</Link></a>
            </div>
              
          </div>
  
        ) ;
  }
  }
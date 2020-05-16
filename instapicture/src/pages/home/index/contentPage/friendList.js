import React, { Component, PropTypes } from 'react';

import styles from '../css/ListStyle.css' ;

import FriendListItem from './friendListItem.js';

export default class FriendList extends Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      //遍历渲染每个条目
     console.log(this.props.data);
     console.log(this.props.data[0]);
      var ItemView = this.props.data.map(function(item,index) {
        return <FriendListItem itemData= {item} key = {index}/>
      }) ;
  
      return(
        <div className={styles.items}>
           {this.props.data[0]!=undefined?
            <a><FriendListItem itemData= {this.props.data[0]}/></a>:''
            }
        </div>
      ) ;
  }
  }
  FriendList.propTypes = {
};
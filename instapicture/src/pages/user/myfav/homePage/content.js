import React, { Component, PropTypes } from 'react';

import styles from '../css/ListItemStyle.css' ;

import ContentList from './contentList.js'

//定义一个主页组件
export default class Content extends Component {

    constructor(props) {
      super(props);
    }
  
    render() { 
        let datas=this.props.data;
      return(
        <div>
               <div className={styles.item}>
                 <div className={styles.part}>
                    最近的动态
                </div>
               </div>
               {this._renderFooterView(datas)}
              
        </div>
      ) ;
      
  }
  /**
   * 渲染底部View
   */
   _renderFooterView(datas){
      //遍历渲染每个条目
    var ItemView =datas.map(function(item,index) {
        return <ContentList itemData= {item} key = {index}/>
      }) ;
  
      return(
        <div className={styles.listRootViewStyle}>
         {ItemView}
        </div>
      ) ;
   }

  }
  
  Content.propTypes = {
  };
  
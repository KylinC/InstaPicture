import React, { Component, PropTypes } from 'react';

import styles from '../../css/ListItemStyle.css' ;

import ContentList from './contentList.js'

//定义一个主页组件
export default class HomePage extends Component {

    constructor(props) {
      super(props);
    }
  
    render() { 
        let datas=this.props.data;
      return(
        <div>
               {this._renderHeadView(datas)}
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
   * 渲染顶部View
   */
  _renderHeadView(datas){
    return(
      <div className={styles.item}>

        <div className={styles.demo}>
          <p>
              头像：<img src={require('../../img/tiger.jpg')} className={styles.imgStyle}></img>
          </p>
          <p>
              ID：{datas.personalInfo.ID}
          </p>
          <p>
              Name：{datas.personalInfo.name}
          </p>
          <p>
              Gender：{datas.personalInfo.gender}
          </p>
          <p>
              Interest Tag：{datas.personalInfo.interest}
          </p>
          <p>
              Signature:{datas.personalInfo.signature}
          </p>
        </div>
      
      </div>
     
    )
  }

  /**
   * 渲染底部View
   */
   _renderFooterView(datas){
      //遍历渲染每个条目
    var ItemView =datas.contentsInfo.map(function(item,index) {
        return <ContentList itemData= {item} key = {index}/>
      }) ;
  
      return(
        <div className={styles.listRootViewStyle}>
         {ItemView}
        </div>
      ) ;
   }

  }
  
  HomePage.propTypes = {
  };
  
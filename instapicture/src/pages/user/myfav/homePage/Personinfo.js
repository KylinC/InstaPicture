import React, { Component, PropTypes } from 'react';

import styles from '../css/ListItemStyle.css' ;

import ContentList from './contentList.js'

//定义一个主页组件
export default class Person extends Component {

    constructor(props) {
      super(props);
    }
  
    render() { 
        let datas=this.props.data;
      return(
        <div>
               {this._renderHeadView(datas)}     
        </div>
      ) ;
      
  }
   /**
   * 渲染顶部View
   */
  //个人信息如下，可以添加，后期需要加入兴趣标签等
  _renderHeadView(datas){
    return(
      <div className={styles.item}>

        <div className={styles.demo}>
          <p className={styles.isolation}>
              头像：<img src={require("../../../../assets/images/common/lazyImg.jpg")} data-echo={datas.head} className={styles.imgStyle}></img>
          </p>
          <p className={styles.isolation}>
              ID：{datas.uid}
          </p>
          <p className={styles.isolation}>
              Name：{datas.nickname}
          </p>
          <p className={styles.isolation}>
              Gender：{(datas.gender==="1")?'Male':'Female'}
          </p>
          <p className={styles.isolation}>
              Cellphone：{datas.cellPhone}
          </p>
        </div>
      
      </div>
     
    )
  }


  }
  
  Person.propTypes = {
  };
  
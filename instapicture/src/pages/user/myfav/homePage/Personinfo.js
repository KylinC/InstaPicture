import React, { Component, PropTypes } from 'react';

import styles from '../css/ListItemStyle.css' ;
import Css from '../css/friendsList.css';


//定义一个主页组件
export default class Person extends Component {

    constructor(props) {
      super(props);
      this.state={
        tags:this.props.data.tags
      }
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
              姓名：{datas.nickname}
          </p>
          <p className={styles.isolation}>
              性别：{(datas.gender==="1")?'男':'女'}
          </p>
          <p className={styles.isolation}>
              联系方式：{datas.cellPhone}
          </p>
        </div>
                  
      </div>
     
    )
  }
/*
<div className={Css["alert"]} >
                    <label>
                        {datas.tags.map((tag,index) =>
                            (<span className={Css["badge"]} key={index}>{tag}</span>)
                        )}
                        </label>
                        </div>
*/

  }
  
  Person.propTypes = {
  };
  
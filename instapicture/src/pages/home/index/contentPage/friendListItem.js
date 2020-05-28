import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router-dom';
import styles from '../css/ListItemStyle.css' ;
import config from '../../../../assets/js/conf/config.js';
import {request} from '../../../../assets/js/libs/request.js';
import {safeAuth,lazyImg} from '../../../../assets/js/utils/util.js';
import Css2 from '../css/friendsList.css';

export default class FriendListItem extends Component {
    constructor(props) {
      super(props);
      this.state={
        sInterest:[]
      }
    }
    componentDidMount(){
      this.getReco();
    }
    getReco(){ 
      request(config.proxyBaseUrl+"/api/userinfos/queryinfo?token="+config.token,"post",{uid:this.props.itemData.UserID}).then(res=>{
        if (res.code ===200){
            this.setState({sInterest:res.data.tags},()=>{
                lazyImg();
            })
        }
    } );
  
    }
    render() {
      let datas=this.props.itemData;
        return(
          <div>
            <div className={styles.littlepart}>
            <a style={{marginLeft:10}}><img src={require("../../../../assets/images/common/lazyImg.jpg")} data-echo={datas.ProfileImagePath} className={styles.imgStyle}></img></a>
              <a className={styles.wid}>{datas.UserName}</a>
              <span><Link to={{pathname:config.path+"home/index/personalpage/index",state:datas.UserID}}>主页</Link></span>
               <div className={Css2["alert"]} >
                    <label>
                        {this.state.sInterest.map((tag,index) =>
                            (<span className={Css2["badge"]} key={index}>{tag}</span>)
                        )}
                        </label>
                </div>
            </div>
          </div>
  
        ) ;
  }
  }
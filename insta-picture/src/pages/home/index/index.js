import React from 'react';
import Swiper from '../../../assets/js/libs/swiper.min.js';
import config from '../../../assets/js/conf/config.js';
import {request} from '../../../assets/js/libs/request.js';
import {connect} from "react-redux";
import {lazyImg,setScrollTop} from '../../../assets/js/utils/util.js';
import "../../../assets/css/common/swiper.min.css";
import Css from '../../../assets/css/home/index/index.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faList, faUserCircle} from '@fortawesome/free-solid-svg-icons'

class  IndexComponent extends React.Component{
    constructor(){
        super();
        this.state = {
            aSwiper:[],
            aNav:[],
            aGoods:[],
            aRecoGoods:[],
            bScroll:false,
            pageStyle:{display:"none"}
        }
        this.bScroll=true;
    }
    componentDidMount(){
        setScrollTop(global.scrollTop.index);

        window.addEventListener("scroll",this.eventScroll.bind(this),false);
    }
    componentWillUnmount(){
        this.bScroll=false;
        window.removeEventListener("scroll",this.eventScroll.bind(this));
        this.setState=(state,callback)=>{
            return;
        }
    }
    eventScroll(){
        if (this.bScroll) {
            let iScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            global.scrollTop.index = iScrollTop;
            if (iScrollTop >= 80) {
                this.setState({bScroll: true})
            } else {
                this.setState({bScroll: false})
            }
        }
    }

    pushPage(pUrl){
        this.props.history.push(config.path+pUrl)
    }

    render(){
        return(
            <div className={Css['page']}>
                <div className={this.state.bScroll?Css['search-header']+" "+Css["red-bg"]:Css['search-header']+" "+Css["red-bg"]}>
                    <div className={Css['classify-icon']}>
                        <FontAwesomeIcon size="lg" icon={faList} />
                    </div>

                    <div className={Css['login-wrap']}>
                        {
                            this.props.state.user.isLogin?<div className={Css['my']} onClick={this.pushPage.bind(this, "home/my")}></div>:<div className={Css['login-text']} onClick={this.pushPage.bind(this, "login/index")}>
                                <FontAwesomeIcon size="lg" icon={faUserCircle} />
                            </div>
                        }
                    </div>
                </div>




            </div>
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(IndexComponent)
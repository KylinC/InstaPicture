import React from 'react';
import {connect} from "react-redux";
import config from './config.js';
import {safeAuth,lazyImg} from '../../../../assets/js/utils/util.js';
import UpRefresh from '../../../../assets/js/libs/uprefresh.js';
import {request} from '../../../../assets/js/libs/request.js';
import SubHeaderComponent from '../../../../components/header/subheader';
import Css from '../../../../assets/css/user/myfav/index.css';
import PersonPage from "./homePage/index"
class  PersonalPage extends React.Component{
    constructor(props){
        super(props);
        safeAuth(props);
        this.state = {
            aGoods:[]
        }
        this.bScroll=true;
        this.oUpRefresh=null;
        this.curPage=1;
        this.maxPage=0;
        this.offsetBottom=100;
    }
    componentWillUnmount(){
        this.oUpRefresh=null;
        this.setState=(state,callback)=>{
            return;
        }
    }
    pushPage(url){
        this.props.history.push(config.path+url);
    }
    render(){
        return(
            <div>
                <div className={Css['page']}>   
                <SubHeaderComponent title="他/她的主页"></SubHeaderComponent>
                <PersonPage />
                </div>
              
            </div>
            
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(PersonalPage)
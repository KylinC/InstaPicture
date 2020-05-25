import React from 'react';
import {connect} from "react-redux";
import config from '../../../assets/js/conf/config.js';
import action from '../../../actions';
import SubHeaderComponent from '../../../components/header/subheader';
//import Css from '../../../assets/css/home/cart/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser, faUserCircle, faSearch} from '@fortawesome/free-solid-svg-icons'
import Css from '../../../assets/css/user/my/index.css';
class CartIndex extends React.Component{
    constructor(){
        super();
        this.state = {
        }
    }
    componentDidMount(){
    }
    componentWillUnmount(){
    }
    pushPage(url){
        this.props.history.push(config.path+url);
    }
    render(){
        return(
            <div>
                <SubHeaderComponent title="关注"></SubHeaderComponent>
                <div className={Css['user-info-wrap']}></div>
                <div className={Css["menu-list-wrap"]}>
                    <ul onClick={this.pushPage.bind(this, 'friends/my')}>
                        <li><FontAwesomeIcon size="lg" icon={faUser} />  我的关注</li>
                        <li></li>
                    </ul>
                    <ul onClick={this.pushPage.bind(this, 'friends/search')}>
                        <li><FontAwesomeIcon size="lg" icon={faSearch} />  搜索用户</li>
                        <li></li>
                    </ul>
                </div>

            </div>
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(CartIndex)
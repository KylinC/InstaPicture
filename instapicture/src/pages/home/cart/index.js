import React from 'react';
import {connect} from "react-redux";
import config from '../../../assets/js/conf/config.js';
import SubHeaderComponent from '../../../components/header/subheader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser, faUserCircle, faSearch} from '@fortawesome/free-solid-svg-icons'
import Css from '../../../assets/css/user/my/index.css';
import {request} from "../../../assets/js/libs/request";

class CartIndex extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount(){
        this.update_state()
    }
    componentWillUnmount(){
    }
    async update_state(){
        let sUrl=config.proxyBaseUrl+"/python/update_social_feature?token="+config.token;
        await request(sUrl, "post",{uid:this.props.state.user.uid}).then(res=>{
            console.log('update social feature: ' + res.success)
        });
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
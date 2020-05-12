import React from 'react';
import {connect} from "react-redux";
import { Modal} from 'antd-mobile';
import config from '../../../assets/js/conf/config.js';
import action from '../../../actions';
import {request} from '../../../assets/js/libs/request.js';
import SubHeaderComponent from '../../../components/header/subheader';
import Css from '../../../assets/css/user/my/index.css';
class  IndexComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            sHead:require("../../../assets/images/user/my/default-head.png"),
            sNickname:"昵称",
            iPoints:0
        }
    }
    componentDidMount(){
        this.getUserInfo();
    }
    outLogin(){
        if (this.props.state.user.isLogin===true){
            Modal.alert('', '确认要退出吗？', [
                { text: '取消', onPress: () => {}, style: 'default' },
                { text: '确认', onPress: () => {
                        let sUrl=config.proxyBaseUrl+"/api/userinfos/safeout?token="+config.token;
                        request(sUrl, "post",{uid:this.props.state.user.uid}).then(res=>{
                            if (res.code===200){
                                this.props.dispatch(action.user.outLogin());
                                this.props.dispatch(action.cart.clearCart());
                                this.props.history.push(config.path+'login/index');
                            }
                        });
                    }
                }
            ]);
        }else{
            this.props.history.push(config.path+'login/index');
        }

    }
    getUserInfo(){
        if (this.props.state.user.isLogin===true) {
            let sUrl = config.proxyBaseUrl+"/api/userinfos/queryinfo?token="+config.token;
            request(sUrl,"post",{uid:this.props.state.user.uid}).then(res => {
                if (res.code === 200) {
                    this.setState({sHead: res.data.head!==''?res.data.head:this.state.sHead, sNickname: res.data.nickname, iPoints: res.data.points});
                }
            });
        }
    }
    componentWillUnmount(){
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
                <SubHeaderComponent title="用户中心"></SubHeaderComponent>
                <div className={Css['user-info-wrap']}>
                    <div className={Css['head']}>
                        <img src={this.state.sHead} alt={this.state.sNickname}/>
                    </div>
                    <div className={Css['nickname']}>{this.state.sNickname}</div>
                    <div className={Css['points']}>Some Words</div>
                </div>
                <div className={Css["menu-list-wrap"]}>
                    <ul onClick={this.pushPage.bind(this, 'profile/index')}>
                        <li>个人资料</li>
                        <li></li>
                    </ul>
                    <ul onClick={this.pushPage.bind(this, 'user/mobile/index')}>
                        <li>绑定手机</li>
                        <li></li>
                    </ul>
                    <ul onClick={this.pushPage.bind(this, 'user/modpwd/index')}>
                        <li>修改密码</li>
                        <li></li>
                    </ul>
                    <ul onClick={this.pushPage.bind(this, 'user/myfav/index')}>
                        <li>我的主页</li>
                        <li></li>
                    </ul>
                    <div className={Css['btn']} onClick={this.outLogin.bind(this)}>{this.props.state.user.isLogin===true?"安全退出":"登录/注册"}</div>
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
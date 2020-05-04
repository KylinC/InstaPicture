import React from 'react';
import config from '../../../assets/js/conf/config.js';
import {request} from '../../../assets/js/libs/request.js';
import { Switch,Toast } from 'antd-mobile';
import SubHeaderComponent from '../../../components/header/subheader';
import Css from '../../../assets/css/home/reg/index.css';
export default class RegIndex extends React.Component{
    constructor(){
        super();
        this.state={
            checked:false,
            sCellphone:'',
            bCodeSuccess:false,
            sCodeText:'获取短信验证码',
            sCode:'',
            sPassword:'',
            sType:"password"
        };
        this.timer=null;
        this.bSendCode=true;
        this.bSubmit=true;
    }
    componentDidMount(){
        document.getElementById("title").innerHTML = "会员注册";
    }
    componentWillUnmount(){
        clearInterval(this.timer);
        this.setState=(state,callback)=>{
            return;
        }
    }
    //验证手机号
    checkCellphone(e){
        this.setState({sCellphone:e.target.value},()=>{
            if (this.bSendCode){
                if(this.state.sCellphone.match(/^1[0-9][0-9]{9}/)){
                    this.setState({bCodeSuccess:true});
                }else{
                    this.setState({bCodeSuccess:false});
                }
            }
        })
    }
    //点击获取短信验证码
    async getCode(){
        if (this.bSendCode && this.state.bCodeSuccess){
            let resData=await this.isSameCellphone();
            if (resData.code===200){
                if (resData.data.isreg==='1'){
                    Toast.info("您输入的手机号已存在",2);
                    return false;
                }
            }
            this.bSendCode=false;
            let iTime=10;
            this.setState({sCodeText:'重新发送('+iTime+'s)',bCodeSuccess:false});
            this.timer=setInterval(()=>{
                if (iTime>0){
                    iTime--;
                    this.setState({sCodeText:'重新发送('+iTime+'s)'});
                }else{
                    clearInterval(this.timer);
                    this.bSendCode=true;
                    this.setState({sCodeText:'获取短信验证码'});
                    this.setState({bCodeSuccess:true});
                }
            },1000);
        }

    }
    //点击注册按钮提交数据
    async submitData(){
        if(this.state.sCellphone.match(/^\s*$/)){
            Toast.info("请输入您的手机号",2);
            return false;
        }
        if(!this.state.sCellphone.match(/^1[0-9][0-9]{9}/)){
            Toast.info("您输入的手机号格式不正确",2);
            return false;
        }
        let resData=await this.isSameCellphone();
        if (resData.code===200){
            if (resData.data.isreg==='1'){
                Toast.info("您输入的手机号已存在",2);
                return false;
            }
        }
        if(this.state.sCode.match(/^\s*$/)){
            Toast.info("请输入短信验证码",2);
            return false;
        }
        if(this.state.sPassword.match(/^\s*$/)){
            Toast.info("请输入密码",2);
            return false;
        }
        if (this.bSubmit){
            this.bSubmit=false;
            let sUrl=config.baseUrl+"/api/home/user/reg?token="+config.token;
            request(sUrl, "post",{vcode:this.state.sCode, cellphone:this.state.sCellphone,password:this.state.sPassword}).then(res=>{
                if (res.code ===200){
                    this.props.history.goBack();
                }
            });
        }

    }
    //显示密码是明码还是暗码
    changePwd(checked) {
        if (checked){
            this.setState({sType:"text"});
        }else{
            this.setState({sType:"password"});
        }
        this.setState({checked: checked});
    }
    //检测手机号是否注册过
    isSameCellphone(){
        let sUrl=config.baseUrl+"/api/home/user/isreg?token="+config.token;
        return request(sUrl, "post",{username:this.state.sCellphone}).then(res=>{
            return res;
        });
    }
    render(){
        return (
            <div className={Css['page']}>
                <SubHeaderComponent title="用户注册"></SubHeaderComponent>
                <div className={Css['main']}>
                    <div className={Css['cellphone-wrap']}>
                        <div className={Css['cellphone']}><input type="tel" placeholder="请输入手机号" onChange={(e)=>{this.checkCellphone(e)}}/></div>
                        <div className={this.state.bCodeSuccess?Css['code-btn']+" "+Css['success']:Css['code-btn']} onClick={this.getCode.bind(this)}>{this.state.sCodeText}</div>
                    </div>
                    <div className={Css['code-wrap']}><input type="text" placeholder="请输入短信验证码" onChange={(e)=>{this.setState({sCode:e.target.value})}} /></div>
                    <div className={Css['password-wrap']}>
                        <div className={Css['password']}><input type={this.state.sType} placeholder="请输入密码" onChange={(e)=>{this.setState({sPassword:e.target.value})}} /></div>
                        <div className={Css['switch-wrap']}>
                            <Switch color="#B15BFF" checked={this.state.checked} onClick={this.changePwd.bind(this,!this.state.checked)}></Switch>
                        </div>
                    </div>
                    <div className={Css['sure-btn']} onClick={this.submitData.bind(this)}>注册</div>
                </div>
            </div>
        )
    }
}
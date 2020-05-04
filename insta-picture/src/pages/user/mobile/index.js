import React from 'react';
import {connect} from "react-redux";
import { Toast} from 'antd-mobile';
import config from '../../../assets/js/conf/config.js';
import {safeAuth} from '../../../assets/js/utils/util.js';
import {request} from '../../../assets/js/libs/request.js';
import SubHeaderComponent from '../../../components/header/subheader';
import Css from '../../../assets/css/user/mobile/index.css';
class  MobileIndex extends React.Component{
    constructor(props){
        super(props);
        safeAuth(props);
        this.state = {
            sCellphone:'',
            bCodeSuccess:false,
            sCodeText:'获取验证码',
            sCode:''
        }
        this.timer=null;
        this.bSendCode=true;
        this.bSubmit=true;
    }
    componentDidMount(){

    }

    componentWillUnmount(){
        clearInterval(this.timer);
        this.setState=(state,callback)=>{
            return;
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
        if (this.bSubmit){
            this.bSubmit=false;
            let sUrl=config.baseUrl+"/api/user/myinfo/updatecellphone?token="+config.token;
            request(sUrl, "post",{vcode:this.state.sCode, cellphone:this.state.sCellphone,uid:this.props.state.user.uid}).then(res=>{
                if (res.code ===200){
                    Toast.info("绑定手机成功！",2,()=>{
                        this.props.history.goBack();
                    })
                }else{
                    Toast.info(res.data,2);
                }
            });
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
                    this.setState({sCodeText:'获取验证码'});
                    this.setState({bCodeSuccess:true});
                }
            },1000);
        }

    }
    //检测手机号是否注册过
    isSameCellphone(){
        let sUrl=config.baseUrl+"/api/home/user/isreg?token="+config.token;
        return request(sUrl, "post",{username:this.state.sCellphone}).then(res=>{
            return res;
        });
    }
    render(){
        return(
            <div className={Css['page']}>
                <SubHeaderComponent title="绑定手机"></SubHeaderComponent>
                <div className={Css['main']}>
                    <div className={Css['tip']}>
                        <div className={Css['icon']}></div>
                        <div className={Css['text']}>新手机号验证后，即可绑定成功！</div>
                    </div>
                    <div className={Css['input-wrap']} style={{marginTop:'0.5rem'}}>
                        <input type="tel" className={Css['cellphone']} placeholder='绑定手机号' onChange={(e)=>{this.checkCellphone(e)}} />
                    </div>
                    <div className={Css['input-wrap']} style={{marginTop:'0.2rem'}}>
                        <input type="text" className={Css['code']} placeholder='请输入短信验证码' onChange={(e)=>{this.setState({sCode:e.target.value})}}  />
                        <div className={this.state.bCodeSuccess?Css['code-btn']+" "+Css['success']:Css['code-btn']} onClick={this.getCode.bind(this)}>{this.state.sCodeText}</div>
                    </div>
                    <div className={Css['save-btn']} onClick={this.submitData.bind(this)}>下一步</div>
                </div>
            </div>
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(MobileIndex)
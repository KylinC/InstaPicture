import React from 'react';
import {connect} from "react-redux";
import { ActionSheet,Toast} from 'antd-mobile';
import config from '../../../assets/js/conf/config.js';
import {safeAuth} from '../../../assets/js/utils/util.js';
import {request} from '../../../assets/js/libs/request.js';
import SubHeaderComponent from '../../../components/header/subheader';
import Css from '../../../assets/css/user/profile/index.css';
class  ProfileIndex extends React.Component{
    constructor(props){
        super(props);
        safeAuth(props);
        this.state = {
            sHead:require("../../../assets/images/user/my/default-head.png"),
            sNickname:"昵称",
            sGender:"",
            iGender:0,
            sHeadName:""
        }
    }
    componentDidMount(){
        this.getUserInfo();
    }

    getUserInfo(){
        if (this.props.state.user.isLogin===true) {
            let sUrl = config.baseUrl + "/api/user/myinfo/userinfo/uid/" + this.props.state.user.uid + "?token=" + config.token;
            request(sUrl).then(res => {
                if (res.code === 200) {
                    this.setState({sHead: res.data.head!==''?res.data.head:this.state.sHead, sNickname: res.data.nickname, iGender: res.data.gender,sGender:res.data.gender==='1'?"男":res.data.gender==='2'?"女":""});
                }
            });
        }
    }
    componentWillUnmount(){
        this.setState=(state,callback)=>{
            return;
        }
    }
    //选择性别
    selectGender(){
        const BUTTONS = ['男', '女', '取消'];
        ActionSheet.showActionSheetWithOptions({
                options: BUTTONS,
                cancelButtonIndex: BUTTONS.length - 1,
                //destructiveButtonIndex: BUTTONS.length - 2,
                 title: '选择性别',
                //message: 'I am description, description, description',
                maskClosable: true,
                'data-seed': 'logId',
                onTouchStart: e => e.preventDefault()
            },
            (buttonIndex) => {
                if (buttonIndex!==2){
                    this.setState({ sGender: buttonIndex===0?"男": buttonIndex===1?'女':this.state.sGender,iGender:buttonIndex===0?1:buttonIndex===1?2:this.state.iGender});
                }
            });
    }
    //保存数据
    submitSave(){
        if (this.state.sNickname.match(/^\s*$/)){
            Toast.info("请输入昵称",2);
            return false;
        }
        if (this.state.sGender.match(/^\s*$/)){
            Toast.info("请选择性别",2);
            return false;
        }
        let sUrl=config.baseUrl+"/api/user/myinfo/updateuser?token="+config.token;
        let jData={
            uid:this.props.state.user.uid,
            nickname:this.state.sNickname,
            gender:this.state.iGender,
            head:this.state.sHeadName
        };
        request(sUrl, "post",jData).then(res=>{
            if (res.code===200){
                Toast.info(res.data,2,()=>{
                    this.props.history.goBack();
                });
            }
        });
    }
    //图片上传
    uploadHead(){
        let sUrl=config.baseUrl+"/api/user/myinfo/formdatahead?token="+config.token;
        request(sUrl, "file",{headfile:this.refs['headfile'].files[0]}).then(res=>{
            if (res.code===200){
                this.setState({sHead:"http://vueshop.glbuys.com/userfiles/head/"+res.data.msbox,sHeadName:res.data.msbox});
            }
        });
    }
    render(){
        return(
            <div className={Css['page']}>
                <SubHeaderComponent title="个人资料" right-text="保存" onClickRightBtn={this.submitSave.bind(this)}></SubHeaderComponent>
                <div className={Css['main']}>
                    <ul className={Css['head']}>
                        <li>头像</li>
                        <li><img src={this.state.sHead} alt=""/><input ref="headfile" type="file" onChange={this.uploadHead.bind(this)}/></li>
                    </ul>
                    <ul className={Css['list']}>
                        <li>昵称</li>
                        <li><input type="text" placeholder="请设置昵称" value={this.state.sNickname} onChange={(e)=>{this.setState({sNickname:e.target.value})}} /></li>
                        <li className={Css['arrow']}></li>
                    </ul>
                    <ul className={Css['list']}>
                        <li>性别</li>
                        <li><input type="text" placeholder="请选择性别" readOnly onClick={this.selectGender.bind(this)} value={this.state.sGender} /></li>
                        <li className={Css['arrow']}></li>
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
})(ProfileIndex)
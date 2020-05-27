import React from 'react';
import config from '../../../assets/js/conf/config.js';
import {request} from '../../../assets/js/libs/request.js';
import { Switch,Toast, Checkbox } from 'antd-mobile';
import SubHeaderComponent from '../../../components/header/subheader';
import Css from '../../../assets/css/home/reg/index.css';
import { checkItem } from '../../../actions/cartaction.js';
export default class RegIndex extends React.Component{
    constructor(){
        super();
        this.state={
            sID:0,
            checked:false,
            sCellphone:'',
            bCodeSuccess:false,
            sNickname:"",
            sGender:'Male',
            sInterest:[],
            hobby:[
                {
                    'title':"鲤鱼",
                    'checked':false
                },
                {
                    'title':"史宾格犬",
                    'checked':false
                },
                {
                    'title':"磁带播放器",
                    'checked':false
                },
                {
                    'title':"链锯",
                    'checked':false
                },
                {
                    'title':"教堂",
                    'checked':false
                },
                {
                    'title':"法国号角",
                    'checked':false
                },
                {
                    'title':"垃圾车",
                    'checked':false
                },
                {
                    'title':"油泵",
                    'checked':false
                },
                {
                    'title':"高尔夫球",
                    'checked':false
                },
                {
                    'title':"降落伞",
                    'checked':false
                }
            ],
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
    /**
     * 注意：爱好有多个值
     * @param e
     */
    changeHobby(key){
        var hobby = this.state.hobby;
        hobby[key].checked=!hobby[key].checked;
        this.setState({
            hobby:hobby
        })
    }
    //点击注册按钮提交数据
    async submitData(){
        var num=this.state.sCellphone;
        var nums=num.substr(5,11);
        var ID=parseInt(nums);
        this.setState({
            sID:ID
        });
        var inter=[];
        for(var i = 0, len = this.state.hobby.length; i < len; i++){
            if(this.state.hobby[i].checked===true){
                inter.push(this.state.hobby[i].title);
            }
        };
        let resData=await this.isSameCellphone();
        if(!this.state.sCellphone.match(/^1[0-9][0-9]{9}/)){
            Toast.info("您输入的手机号格式不正确",2);
            return false;
        }
        if (resData.code===200){
            if (resData.data==='1'){
                Toast.info("您输入的手机号已存在",2);
                return false;
            }
        }
        if(this.state.sPassword.match(/^\s*$/)){
            Toast.info("请输入密码",2);
            return false;
        }
        if(this.state.sNickname.match(/^\s*$/)){
            Toast.info("请输入姓名",2);
            return false;
        }
        if (this.bSubmit){
            this.bSubmit=false;
            let sUrl=config.proxyBaseUrl+"/api/userinfos/reginfo?token="+config.token;
            console.log(sUrl);
            request(sUrl, "post",{id:this.state.sID,nickname:this.state.sNickname, cellphone:this.state.sCellphone,password:this.state.sPassword,gender:this.state.sGender,interest:inter}).then(res=>{
                console.log("bsumbmit",res)
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
        let sUrl=config.proxyBaseUrl+"/api/userinfos/isreg?token="+config.token;
        return request(sUrl, "post",{cellphone:this.state.sCellphone}).then(res=>{
            console.log("isSameCellphone",res)
            return res;
        });
    }
    render(){
        return (
            <div className={Css['page']}>
                <SubHeaderComponent title="用户注册"></SubHeaderComponent>
                <div className={Css['main']}>
                   <div className={Css['code-wrap']} style={{marginTop:"0px"}}><input type="text" placeholder="请输入手机号" onChange={(e)=>{this.setState({sCellphone:e.target.value})}} /></div>
                    
                    <div className={Css['password-wrap']}>
                        <div className={Css['password']}><input type={this.state.sType} placeholder="请输入密码" onChange={(e)=>{this.setState({sPassword:e.target.value})}} /></div>
                        <div className={Css['switch-wrap']}>
                            <Switch color="#B15BFF" checked={this.state.checked} onClick={this.changePwd.bind(this,!this.state.checked)}></Switch>
                        </div>
                    </div>
                    <div className={Css['code-wrap']} style={{marginTop:"15px"}}><input type="text" placeholder="请输入姓名" onChange={(e)=>{this.setState({sNickname:e.target.value})}} /></div>
                    <div className={Css['code-wrap']} style={{marginTop:"15px",height:'27px'}}>
                    <a>请选择性别</a>
                    <a style={{marginLeft:'190px'}}>
                    <select value={this.state.sGender} onChange={(e)=>{this.setState({sGender:e.target.value})}}>
                        <option value='男'>男</option>
                        <option value='女'>女</option>
                    </select>
                    </a>
                    </div>
                    <div className={Css['code-wrap']} style={{marginTop:"15px",height:'27px'}}>请选择兴趣:</div>
                    <div style={{marginLeft:'19px'}}>
                    {   
                        this.state.hobby.map( (value,key)=>{
                            return (<span key={key}>
                                        <input type="checkbox" checked={value.checked} onChange={this.changeHobby.bind(this,key)}/>{value.title}
                                    </span>)
                        })
                    }
                    </div>
                    <div className={Css['sure-btn']} onClick={this.submitData.bind(this)}>注册</div>
                </div>
            </div>
        )
    }
}
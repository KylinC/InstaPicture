//会员登录
function login(data){
    return {
        type:"login",
        data:data
    }
}
//退出会员
function outLogin(){
    return {
        type:"outLogin",
        data:{}
    }
}
export{
    login,
    outLogin
}
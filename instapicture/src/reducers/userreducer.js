let defaultState={
    uid:localStorage['uid']!==undefined?localStorage['uid']:'',
    nickname:localStorage['nickname']!==undefined?localStorage['nickname']:'',
    authToken:localStorage['authToken']!==undefined?localStorage['authToken']:'',
    isLogin:localStorage['isLogin']!==undefined?Boolean(localStorage['isLogin']):false
}
function userReducer(state=defaultState,action){
    switch (action.type){
        case "login":
            state.uid = action.uid;
            state.nickname = action.nickname;
            state.authToken=action.authToken;
            state.isLogin=action.isLogin;
            return Object.assign({},state, action.data);
        case "outLogin":
            localStorage.removeItem("uid");
            localStorage.removeItem("nickname");
            localStorage.removeItem("authToken");
            localStorage.removeItem("isLogin");
            sessionStorage.removeItem("addressId");
            localStorage.removeItem("addressId");
            state.uid = "";
            state.nickname = "";
            state.authToken="";
            state.isLogin=false;
            return Object.assign({},state, action.data);
        default:
            return state;
    }
}
export default userReducer;
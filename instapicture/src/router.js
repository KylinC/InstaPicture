/*
exact :完全匹配路由 
* */
import React from 'react';
import  {HashRouter as Router,Route,Switch,Redirect}  from  'react-router-dom';
import {AuthRoute} from './routes/private';
import asyncComponents from './components/async/AsyncComponent';
import config from './assets/js/conf/config.js';
const PersonalPage=asyncComponents(()=>import('./pages/home/index/personalpage/index'));
const HomeComponent=asyncComponents(()=>import('./pages/home/home/index'));
const LoginIndex=asyncComponents(()=>import('./pages/home/login/index'));
const RegIndex=asyncComponents(()=>import('./pages/home/reg/index'));
const ProfileIndex=asyncComponents(()=>import('./pages/user/profile/index'));
const UserMobileIndex=asyncComponents(()=>import('./pages/user/mobile/index'));
const UserModpwdIndex=asyncComponents(()=>import('./pages/user/modpwd/index'));
const MyFav=asyncComponents(()=>import('./pages/user/myfav/index'));
const Transfer=asyncComponents(()=>import('./pages/transfer/index'));
const List=asyncComponents(()=>import('./pages/Friends/my'));
const SearchFriends=asyncComponents(()=>import('./pages/Friends/search'));
export default class RouterComponent extends React.Component{
    render(){
        return(
            <React.Fragment>
                <Router>
                    <React.Fragment>
                        <Switch>
                            <Route path={config.path+"home/index/personalpage/index"} component={PersonalPage} ></Route>
                            <Route path={config.path+"home"} component={HomeComponent} ></Route>
                            <Route path={config.path+"login/index"} component={LoginIndex} ></Route>
                            <Route path={config.path+"reg/index"} component={RegIndex} ></Route>
                            <AuthRoute path={config.path+"profile/index"} component={ProfileIndex} ></AuthRoute>
                            <AuthRoute path={config.path+"user/mobile/index"} component={UserMobileIndex} ></AuthRoute>
                            <AuthRoute path={config.path+"user/modpwd/index"} component={UserModpwdIndex} ></AuthRoute>
                            <AuthRoute path={config.path+"user/myfav/index"} component={MyFav} ></AuthRoute>
                            <Route path={config.path+"friends/my"} component={List} ></Route>
                            <Route path={config.path+"friends/search"} component={SearchFriends} ></Route>
                            <Route path={config.path+"transfer"} component={Transfer} ></Route>
                            <Redirect to={config.path+"home/index"}></Redirect>
                        </Switch>
                    </React.Fragment>
                </Router>
            </React.Fragment>
        )
    }
}
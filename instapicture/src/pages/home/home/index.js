import React from 'react';
import  {Route,Switch}  from  'react-router-dom';
import {connect} from "react-redux";
import asyncComponents from '../../../components/async/AsyncComponent';
import config from '../../../assets/js/conf/config.js';
import Css from '../../../assets/css/home/home/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserFriends,faIdCard,faImages,faUserAlt,faBox } from '@fortawesome/free-solid-svg-icons'
// import { faInstagram } from '@fortawesome/free-brands-svg-icons'

const IndexComponent=asyncComponents(()=>import('../index/index'));
const CartIndex=asyncComponents(()=>import('../cart/index'));
const UserIndex=asyncComponents(()=>import('../../user/index/index'));
const AlbumIndex=asyncComponents(()=>import('../album/index'));

class HomeComponent extends React.Component{
    constructor(props){
        super(props);
        this.state={
            bHomeStyle:true,
            bCartStyle:false,
            bAlbumStyle:false,
            bMyStyle:false,
            activeColor:"#B15BFF",
            noneActiveColor:"#000000"
        }
    }
    componentWillMount(){
    }
    componentDidMount(){
        this.handleNavStyle(this.props)
    }
    componentWillReceiveProps(newProps){
        this.handleNavStyle(newProps)
    }
    goPage(pUrl){
      this.props.history.push(config.path+pUrl);
    }
    handleNavStyle(props){
        switch (props.location.pathname){
            case config.path+"home/index":
                this.setState({
                    bHomeStyle:true,
                    bCartStyle:false,
                    bAlbumStyle:false,
                    bMyStyle:false
                });
                break;
            case config.path+"home/cart":
                this.setState({
                    bHomeStyle:false,
                    bCartStyle:true,
                    bAlbumStyle:false,
                    bMyStyle:false
                });
                break;
            case config.path+"home/album":
                this.setState({
                    bHomeStyle:false,
                    bCartStyle:false,
                    bAlbumStyle:true,
                    bMyStyle:false
                });
                break;
            case config.path+"home/my":
                this.setState({
                    bHomeStyle:false,
                    bCartStyle:false,
                    bAlbumStyle:false,
                    bMyStyle:true
                });
                break;
            default:
                break;
        }

    }
    componentWillUnmount(){
        this.setState=(state,callback)=>{
            return;
        }
    }
    render(){
        return(
            <div>
                <React.Fragment>
                    <Switch>
                        <Route path={config.path+"home/index"} component={IndexComponent} ></Route>
                        <Route path={config.path+"home/cart"} component={CartIndex} ></Route>
                        <Route path={config.path+"home/album"} component={AlbumIndex} ></Route>
                        <Route path={config.path+"home/my"} component={UserIndex} ></Route>
                    </Switch>
                </React.Fragment>
                <div className={Css['bottom-nav']}>
                    <ul onClick={this.goPage.bind(this,'home/index')}>
                        {/*<li className={this.state.bHomeStyle?Css['home']+" "+Css['active']:Css['home']}></li>*/}
                        <FontAwesomeIcon size="lg" color={this.state.bHomeStyle?this.state.activeColor:this.state.noneActiveColor} icon={faImages} />
                        <li className={this.state.bHomeStyle?Css['text']+" "+Css['active']:Css['text']}></li>
                    </ul>
                    <ul onClick={this.goPage.bind(this,'home/cart')}>
                        {/*<li className={this.state.bCartStyle?Css['cart']+" "+Css['active']:Css['cart']}></li>*/}
                        <FontAwesomeIcon size="lg" color={this.state.bCartStyle?this.state.activeColor:this.state.noneActiveColor} icon={faUserFriends} />
                        <li className={this.state.bCartStyle?Css['text']+" "+Css['active']:Css['text']}></li>
                    </ul>
                    <ul onClick={this.goPage.bind(this,'home/album')}>
                        {/*<li className={this.state.bCartStyle?Css['cart']+" "+Css['active']:Css['cart']}></li>*/}
                        <FontAwesomeIcon size="lg" color={this.state.bAlbumStyle?this.state.activeColor:this.state.noneActiveColor} icon={faBox} />
                        <li className={this.state.bAlbumStyle?Css['text']+" "+Css['active']:Css['text']}></li>
                    </ul>
                    <ul onClick={this.goPage.bind(this,'home/my')}>
                        {/*<li className={this.state.bMyStyle?Css['my']+" "+Css['active']:Css['my']}></li>*/}
                        <FontAwesomeIcon size="lg" color={this.state.bMyStyle?this.state.activeColor:this.state.noneActiveColor} icon={faUserAlt} />
                        <li className={this.state.bMyStyle?Css['text']+" "+Css['active']:Css['text']}></li>
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
})(HomeComponent)
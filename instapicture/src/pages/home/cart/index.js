import React from 'react';
import {connect} from "react-redux";
import config from '../../../assets/js/conf/config.js';
import action from '../../../actions';
import SubHeaderComponent from '../../../components/header/subheader';
import Css from '../../../assets/css/home/cart/index.css';

class CartIndex extends React.Component{
    constructor(){
        super();
        this.state = {
        }
    }
    componentDidMount(){
    }
    componentWillUnmount(){
    }
    render(){
        return(
            <div>
                <SubHeaderComponent title="关注"></SubHeaderComponent>


            </div>
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(CartIndex)
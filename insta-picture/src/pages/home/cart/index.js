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
            bAllChecked:true
        }
    }
    componentDidMount(){
        this.isAllChecked();
    }
    componentWillUnmount(){
        this.setState=(state,callback)=>{
            return;
        }
    }
    //删除商品
    delItem(index){
        if (this.props.state.cart.aCartData.length>0){
            this.props.dispatch(action.cart.delItem({index:index}));
        }
        this.isAllChecked();
    }
    //选择商品
    checkItem(index,checked){
        if (this.props.state.cart.aCartData.length>0){
            this.props.dispatch(action.cart.checkItem({index:index, checked:checked}));
            this.isAllChecked();
        }
    }
    //是否全选
    isAllChecked(){
        if (this.props.state.cart.aCartData.length>0){
            let bChecked=true;
            for (let key in this.props.state.cart.aCartData){
                if (!this.props.state.cart.aCartData[key].checked){
                    this.setState({bAllChecked:false});
                    bChecked=false;
                    break;
                }
            }
            if (bChecked){
                this.setState({bAllChecked:true});
            }
        }else{
            this.setState({bAllChecked:false});
        }
    }
    //点击全选按钮
    setAllChecked(checked){
        if (this.props.state.cart.aCartData.length>0){
            this.setState({bAllChecked:checked});
            this.props.dispatch(action.cart.setAllChecked({checked:checked}));
        }
    }
    //增加数量
    incAmount(index){
        if (this.props.state.cart.aCartData.length>0){
            if (this.props.state.cart.aCartData[index].checked){
                this.props.dispatch(action.cart.incAmount({index:index}));
            }
        }
    }
    //减少数量
    decAmount(index){
        if (this.props.state.cart.aCartData.length>0){
            if (this.props.state.cart.aCartData[index].checked){
                this.props.dispatch(action.cart.decAmount({index:index}));
            }
        }
    }
    //改变数量
    changeAmount(e,index){
        if (this.props.state.cart.aCartData.length>0){
            let iAmount=1;
            if (e.target.value!==''){
                iAmount = e.target.value.replace(/[a-zA-Z]|[\u4e00-\u9fa5]|[#|*|,|+|;|.]/g,'');
                if (iAmount===''){
                    iAmount=1;
                }
            }
            this.props.dispatch(action.cart.changeAmount({amount:iAmount,index:index}))
        }
    }
    //去结算
    goBalance(){
        if(this.props.state.cart.total>0){
            this.props.history.push(config.path+"balance/index")
        }
    }
    render(){
        return(
            <div>
                <SubHeaderComponent title="关注管理"></SubHeaderComponent>

            </div>
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(CartIndex)
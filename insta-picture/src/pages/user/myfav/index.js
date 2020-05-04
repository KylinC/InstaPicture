import React from 'react';
import {connect} from "react-redux";
import { Modal} from 'antd-mobile';
import config from '../../../assets/js/conf/config.js';
import {safeAuth,lazyImg} from '../../../assets/js/utils/util.js';
import UpRefresh from '../../../assets/js/libs/uprefresh.js';
import {request} from '../../../assets/js/libs/request.js';
import SubHeaderComponent from '../../../components/header/subheader';
import Css from '../../../assets/css/user/myfav/index.css';
class  MyFav extends React.Component{
    constructor(props){
        super(props);
        safeAuth(props);
        this.state = {
            aGoods:[]
        }
        this.oUpRefresh=null;
        this.curPage=1;
        this.maxPage=0;
        this.offsetBottom=100;
    }
    componentDidMount(){
        this.getData();
    }

    componentWillUnmount(){
        this.oUpRefresh=null;
        this.setState=(state,callback)=>{
            return;
        }
    }
    getData(){
        let url=config.baseUrl+"/api/user/fav/index?uid="+this.props.state.user.uid+"&token="+config.token+"&page="+this.curPage;
        request(url).then(res=>{
            if (res.code ===200){
                this.maxPage=res.pageinfo.pagenum;
                this.setState({aGoods:res.data},()=>{
                    lazyImg();
                    this.getScrollPage();
                });
            }
        })
    }
    getScrollPage(){
        this.oUpRefresh=new UpRefresh({"curPage":this.curPage,"maxPage":this.maxPage,"offsetBottom":this.offsetBottom},curPage=>{
            let url=config.baseUrl+"/api/user/fav/index?uid="+this.props.state.user.uid+"&token="+config.token+"&page="+curPage;
            request(url).then((res)=>{
                if (res.code===200){
                    if (res.data.length>0){
                        let aGoods=this.state.aGoods;
                        for (let i=0;i<res.data.length;i++){
                            aGoods.push(res.data[i]);
                        }
                        this.setState({aGoods:aGoods},()=>{
                            lazyImg();
                        });
                    }
                }
            });
        });
    }
    //删除收藏
    delFav(index,fid){
        Modal.alert('', '确认要删除吗？', [
            { text: '取消', onPress: () => {}, style: 'default' },
            { text: '确认', onPress: () => {
                let url=config.baseUrl+"/api/user/fav/del?uid="+this.props.state.user.uid+"&fid="+fid+"&token="+config.token;
                request(url, 'post').then(res=>{
                    if (res.code===200){
                        let goods=this.state.aGoods;
                        goods.splice(index, 1);
                        this.setState({aGoods:goods},()=>{
                            lazyImg();
                        })
                    }
                })

                }
            }
        ]);
    }
    pushPage(url){
        this.props.history.push(config.path+url);
    }
    render(){
        return(
            <div className={Css['page']}>
                <SubHeaderComponent title="我的收藏"></SubHeaderComponent>
                <div className={Css['main']}>
                    {
                        this.state.aGoods.length>0?
                            this.state.aGoods.map((item, index)=>{
                                return (
                                    <div className={Css['goods-list']} key={index}>
                                        <div className={Css['image']}><img  alt={item.title} data-echo={item.image} src={require("../../../assets/images/common/lazyImg.jpg")} /></div>
                                        <div className={Css['title']}>{item.title}</div>
                                        <div className={Css['price']}>¥{item.price}</div>
                                        <div className={Css['btn-wrap']}>
                                            <div className={Css['btn']} onClick={this.pushPage.bind(this, 'goods/details/item?gid='+item.gid)}>购买</div>
                                            <div className={Css['btn']} onClick={this.delFav.bind(this,index,item.fid)}>删除</div>
                                        </div>
                                    </div>
                                )
                            })
                        :""
                    }

                </div>
            </div>
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(MyFav)
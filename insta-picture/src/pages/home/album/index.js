import React from 'react';
import config from '../../../assets/js/conf/config.js';
import SubHeaderComponent from '../../../components/header/subheader';
import ImageList from '../../../components/ImageList/ImageList'
import Css from '../../../assets/css/home/index/index.css';
import {request} from '../../../assets/js/libs/request.js';
import {lazyImg,setScrollTop} from '../../../assets/js/utils/util.js';


class AlbumIndex extends React.Component{
    constructor(){
        super();
        this.state = {
            aRecoGoods:[],
            bScroll:false
        }
        this.bScroll=true;
    }
    componentDidMount(){
        this.getReco();
        window.addEventListener("scroll",this.eventScroll.bind(this),false);
    }
    componentWillUnmount(){
        this.bScroll=false;
        window.removeEventListener("scroll",this.eventScroll.bind(this));
        this.setState=(state,callback)=>{
            return;
        }
    }
    eventScroll(){
        if (this.bScroll) {
            let iScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            global.scrollTop.index = iScrollTop;
            if (iScrollTop >= 80) {
                this.setState({bScroll: true})
            } else {
                this.setState({bScroll: false})
            }
        }
    }
    getReco(){
        request(config.baseUrl+"/api/home/index/recom?token="+config.token).then(res=>{
            if (res.code ===200){
                this.setState({aRecoGoods:res.data},()=>{
                    lazyImg();
                })
            }
        } )
    }
    render(){
        console.log(this.state.bScroll);
        return(
            <div>
                {this.state.bScroll?(<SubHeaderComponent title="Album"></SubHeaderComponent>):(null)}
                <div className={Css['cart-main']}>
                    {/*<div className={Css['reco-item-wrap']}>*/}
                    {/*    {*/}
                    {/*        this.state.aRecoGoods!=null?*/}
                    {/*            this.state.aRecoGoods.map((item, index)=>{*/}
                    {/*                return (*/}
                    {/*                    <div key={index} className={Css['reco-item']}>*/}
                    {/*                        <div className={Css['image']}><img src={require("../../../assets/images/common/lazyImg.jpg")} alt={item.title} data-echo={item.image} /></div>*/}
                    {/*                    </div>*/}
                    {/*                )*/}
                    {/*            })*/}
                    {/*            :''*/}
                    {/*    }*/}
                    {/*</div>*/}
                </div>
                {/*<ImageList photoImages={photoFiles} />*/}
            </div>
        );
    }
}
export default AlbumIndex
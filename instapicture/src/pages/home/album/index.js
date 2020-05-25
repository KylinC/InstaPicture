import React from 'react';
import config from '../../../assets/js/conf/config.js';
import SubHeaderComponent from '../../../components/header/subheader';
import ImageList from '../../../components/ImageList/ImageList'
import Css from '../../../assets/css/home/index/index.css';
import {safeAuth} from '../../../assets/js/utils/util.js';
import {connect} from "react-redux";
import {request} from '../../../assets/js/libs/request.js';
import {lazyImg,setScrollTop} from '../../../assets/js/utils/util.js';


class AlbumIndex extends React.Component{
    constructor(props){
        super(props);
        safeAuth(props);
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
        request(config.proxyBaseUrl+"/api/images/album?token="+config.token,"post",{uid:this.props.state.user.uid}).then(res=>{
            if (res.code ===200){
                this.setState({aRecoGoods:res.data},()=>{
                    lazyImg();
                })
            }
        } )
        request( config.proxyBaseUrl+"/api/images?token=1",'post',{"aa":"bb"}).then(res=>{
            console.log(res);
        })
    }
    render(){
        return(
            <div>
                {this.state.bScroll?(<SubHeaderComponent title="Album"></SubHeaderComponent>):(null)}
                <div className={Css['cart-main']}>
                    <div className={Css['reco-item-wrap']}>
                        {
                            this.state.aRecoGoods!=null?
                                this.state.aRecoGoods.map((item, index)=>{
                                    return (
                                        <div key={index} className={Css['reco-item']}>
                                            <div className={Css['image']}><img src={require("../../../assets/images/common/lazyImg.jpg")} alt={item.UploadTime} data-echo={item.storagePath} /></div>
                                            <div className={Css['image-bottom']}><img src={"http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-09-b0942619ab5f3d03ed2f71340d1385d5.png"}/></div>
                                        </div>
                                    )
                                })
                                :''
                        }
                    </div>
                </div>
                {/*<ImageList photoImages={photoFiles} />*/}
            </div>
        );
    }
}
export default connect((state)=>{
    return{
        state:state
    }
})(AlbumIndex)
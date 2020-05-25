import React from 'react';
import Css from '../../assets/css/home/friends/search.css';
import Friendslist from '../../components/Friends/FriendsList';

class Search extends React.Component{
    constructor(props){
        super(props)
        this.state={
        }
    }
    render(){
        return (
            <div>
                <div className={Css['contain']}>
                    <div className={Css["bar6"]}>
                        <form>
                            <input type="text" placeholder="请输入用户名" name="cname"/>
                            <button type="submit"></button>
                        </form>
                    </div>
                </div>
                {/* <div id="container">
                    <div classname="search bar6">
                        <form>
                            <input type="text" placeholder="请输入用户名" name="cname"/>
                            <button type="submit"></button>
                        </form>
                    </div>
                </div> */}
                <Friendslist Name='simon' imgRoad='1.jpg' tags={['高尔夫球', '史宾格犬', '磁带播放机']}></Friendslist>
                <Friendslist Name='simon' imgRoad='1.jpg' tags={['鲤鱼', '史宾格犬', '磁带播放机']}></Friendslist>
                <Friendslist Name='simon' imgRoad='1.jpg' tags={['鲤鱼', '史宾格犬', '磁带播放机']}></Friendslist>
                <Friendslist Name='simon' imgRoad='1.jpg' tags={['鲤鱼', '史宾格犬', '磁带播放机']}></Friendslist>
                <Friendslist Name='simon' imgRoad='1.jpg' tags={['鲤鱼', '史宾格犬', '磁带播放机']}></Friendslist>
                <Friendslist Name='simon' imgRoad='1.jpg' tags={['鲤鱼', '史宾格犬', '磁带播放机']}></Friendslist>
                <Friendslist Name='simon' imgRoad='1.jpg' tags={['鲤鱼', '史宾格犬', '磁带播放机']}></Friendslist>
                <Friendslist Name='simon' imgRoad='1.jpg' tags={['鲤鱼', '史宾格犬', '磁带播放机']}></Friendslist>
                <Friendslist Name='simon' imgRoad='1.jpg' tags={['鲤鱼', '史宾格犬', '磁带播放机']}></Friendslist>
                <Friendslist Name='simon' imgRoad='1.jpg' tags={['鲤鱼', '史宾格犬', '磁带播放机']}></Friendslist>
                <Friendslist Name='simon' imgRoad='1.jpg' tags={['鲤鱼', '史宾格犬', '磁带播放机']}></Friendslist>
            </div>
        )
    }
}

export default Search;
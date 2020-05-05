import React from 'react' ;
//引入微博列表组件
import WeiBoList from './WeiBoList.js' ;
//导入数据
import RecContent from '../data/RecContent.json';
import RecFriend from '../data/RecFriend.json';

import styles from '../css/ListItemStyle.css'
import FriendList from './friendList.js';

class ContentPage extends React.Component {
    render() {
        return (
            <div>
                <div className={styles.header}>
                    <h1>InstaPicture</h1>
                    <p>welcome</p>
                </div>
                <div className={styles.item}>
                 <div className={styles.part}>
                    可能感兴趣的陌生人
                </div>
               </div>
               <FriendList data={RecFriend.data} />
                <div className={styles.item}>
                 <div className={styles.part}>
                    可能感兴趣的内容
                </div>
               </div>
                <WeiBoList data={RecContent.data} />
                <div className={styles.footer}>
                    power by node
                </div>
            </div>
        )
    }
}

export default ContentPage;

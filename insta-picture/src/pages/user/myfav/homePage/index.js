import React from 'react';
import HomePage from './Homes.js';

import datas from '../data/data2.json' ;
import styles from '../css/ListItemStyle.css'

class PersonalPage extends React.Component {

    constructor(props){
        super(props);
    }
    render() {
        return (
            <div>
                <div className={styles.header}>
                    <h1>InstaPicture</h1>
                </div>
               <HomePage data={datas.data}/>
            </div>
        )
    }
}

export default PersonalPage;
import React from 'react';
import datas from '../data/data2.json' ;
import styles from '../css/ListItemStyle.css'
import Content from './content.js';
import Person from './Personinfo.js';

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
               <Person data={datas.data}/>
               <Content data={datas.data}/>
            </div>
        )
    }
}

export default PersonalPage;
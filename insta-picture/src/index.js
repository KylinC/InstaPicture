/*eslint-disable*/
import 'babel-polyfill';
import 'url-search-params-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import RouterComponent from './router';
import * as serviceWorker from './serviceWorker';
import "./assets/css/common/public.css";
import './assets/js/conf/global.js';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducers from './reducers';
let store=createStore(reducers);
class Index extends React.Component{
    render(){
        return(
            <React.Fragment>
                <Provider store={store}>
                    <RouterComponent />
                </Provider>
            </React.Fragment>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

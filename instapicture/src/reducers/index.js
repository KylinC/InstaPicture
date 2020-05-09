import {combineReducers} from "redux";
import hkReducer from './hkreducer.js';
import cartReducer from './cartreducer.js';
import userReducer from './userreducer.js';
let reducers=combineReducers({
    hk:hkReducer,
    cart:cartReducer,
    user:userReducer
});
export default reducers;
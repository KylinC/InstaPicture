import ReactDOM from 'react-dom';
import {fetch} from 'whatwg-fetch';
let oLoad=ReactDOM.findDOMNode(document.getElementById("page-load"));
function request(pUrl,pType='get'.toLocaleLowerCase(),data={}){
    showLoad();
    let config={},headers={},params='';
    if(pType==='file'.toLocaleLowerCase()){
        pType="post";
        if(data instanceof Object){
            params=new FormData();
            for(let key in data){
                params.append(key,data[key]);
            }
        }
        config={
            method:pType,
            body:params
        }
    }else if (pType ==="get".toLocaleLowerCase()){
        config = {
            method: pType
        }
    }else{
        headers = {
            'Content-Type':'application/x-www-form-urlencoded'
        }
        if (data instanceof Object){
            for (let key in data){
                params+=`&${key}=${encodeURIComponent(data[key])}`;
            }
            params = params.slice(1)
        }
        config = {
            method: pType,
            headers,
            body:params
        }
    }
    return fetch(pUrl,config).then(res=> {
            hideLoad();
            return res.json();
        }
    );
}
function showLoad(){
    oLoad.style.display="block";
}
function hideLoad(){
    oLoad.style.display="none";
}
export {
    request
};
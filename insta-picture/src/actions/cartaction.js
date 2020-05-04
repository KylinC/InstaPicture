
function addCart(data){
    return {
        type:"addCart",
        data:data
    }
}

function delItem(data){
    return {
        type:"delItem",
        data:data
    }
}

function checkItem(data) {
    return {
        type:"checkItem",
        data:data
    }
}

function setAllChecked(data){
    return {
        type:"allItem",
        data:data
    }
}

function incAmount(data){
    return {
        type:"incAmount",
        data:data
    }
}

function decAmount(data){
    return {
        type:"decAmount",
        data:data
    }
}

function changeAmount(data){
    return {
        type:"changeAmount",
        data:data
    }
}

function clearCart(data){
    return {
        type:"clearCart",
        data:data
    }
}
export{
    addCart,
    delItem,
    checkItem,
    setAllChecked,
    incAmount,
    decAmount,
    changeAmount,
    clearCart
}
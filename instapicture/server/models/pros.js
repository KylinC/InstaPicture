var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var proSchema=new Schema({
    
    "ProID":Number,
    "ItemID":Number,
    "ProUserID":Number,
    "Time":{type: Date, default: Date.now}
});

module.exports=mongoose.model('Pros',proSchema,'Pros');
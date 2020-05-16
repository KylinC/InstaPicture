var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var proSchema=new Schema({
    
    "ProID":Number,
    "ItemID":Number,
    "ProUserID":Number,
    "Time":String
})

module.exports=mongoose.model('Pros',proSchema,'Pros');
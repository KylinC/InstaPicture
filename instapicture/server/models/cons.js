var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var conSchema=new Schema({
    
    "ConID":Number,
    "ItemID":Number,
    "ConUserID":Number,
    "Time":String
})

module.exports=mongoose.model('Cons',conSchema,'Cons');
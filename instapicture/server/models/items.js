var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var itemSchema=new Schema({
    //contents
    "ItemID":Number,
    "OwnerID":Number,
    "Text":String,
    "ImageID":Number,
    "ProsNum":Number,
    "ConsNum":Number,
    "CommentNum":Number,
    "CommentIDList":[Number],
    "UploadTime":String
})

module.exports=mongoose.model('Items',itemSchema,'Items');
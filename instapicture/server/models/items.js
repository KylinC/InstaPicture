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
    "UploadTime":{type: Date, default: Date.now},
    "ItemFeature":[Number]
});

module.exports=mongoose.model('Items',itemSchema,'Items');
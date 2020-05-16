var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var commentSchema=new Schema({
    //comment
    "CommentID":Number,
    "ItemID":Number,
    "CommentUserID":Number,
    "CommentText":String,
    "Time":String
})

module.exports=mongoose.model('Comments',commentSchema,'Comments');
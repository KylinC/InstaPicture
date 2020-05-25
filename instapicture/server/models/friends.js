var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var friendSchema=new Schema({
    // friends
    "CelebrityID" : Number,
    "FollowerID" : Number,
});

module.exports=mongoose.model('Friends',friendSchema,'Friends');
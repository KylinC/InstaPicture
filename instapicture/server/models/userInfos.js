var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var userSchema=new Schema({
    //UserInfos
    "UserID" : Number,
    "PhoneNum" : String,
    "UserName":String,
    "Password" : String,
    "Gender" : String,
    "ProfileImagePath" : String,
    "TagList": Array,
    "BirthDate" : String,
    "UploadImageNum" : Number,
    "MaxImageNum" : Number,
    "TagFeature" : Array,
    "UserFeature" : Array,
    "SocialFeature" : Array
});

module.exports=mongoose.model('UserInfos',userSchema,'UserInfos');
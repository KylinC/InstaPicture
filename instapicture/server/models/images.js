var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var imageSchema=new Schema({
    // Images
    "ImageID" : Number,
    "UserID" : Number,
    "UploadTime": String,
    "StoragePath" : String,
    "FeatureWeight" : Number,
    "ImageFeature" : Array,
});

module.exports=mongoose.model('Images',imageSchema,'Images');
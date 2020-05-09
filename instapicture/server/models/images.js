var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var imageSchema=new Schema({
    // Images
    "imageId" : Number,
    "userId" : Number,
    "uploadTime": String,
    "storagePath" : String,
    "FeatureWeight" : Number,
    "imageFeature" : Array,
});

module.exports=mongoose.model('Images',imageSchema,'Images');
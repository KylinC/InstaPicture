var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
const multer  = require('multer');
const Urlconfig = require('../utils/config');
// schema
var Model=require('../models/items');
var imgModel=require('../models/images');

// password require
mongoose.connect('mongodb://127.0.0.1:27017/picturebase');//design是数据库名

// mount (disconnected,error)
mongoose.connection.on('connected',function( c ){
    // console.log('connected');
});

// relative router
router.post('/',function(req,res,next){
    Model.find({},function(err,docs){
        if(err){
            res.json({
                success:'fail',
                data:null
            })
        }else{
            res.json({
                success:'true',
                data:docs
            })
        }
    })
})
router.post('/updateitem/',function(req,res,next){
    // update in mongoose
    Model.updateOne({ItemID: req.body.uid},{ProsNum: req.body.prosnum, ConsNum:req.body.consnum, CommentNum:req.body.commentnum},function (err,doc) {
        if(err)
        {
            console.log(err)
            return
        }
        res.json({
            status:1,
            code: 200,
            data:"修改成功"
        })
    })
})
router.post('/updateComment/',function(req,res,next){
    // update in mongoose
    Model.updateOne({ItemID: req.body.uid},{CommentNum:req.body.commentnum},function (err,doc) {
        if(err)
        {
            console.log(err)
            return
        }
        res.json({
            status:1,
            code: 200,
            data:"修改成功"
        })
    })
})
router.post('/updateComment2/',function(req,res,next){
    // update in mongoose
    var array=[String];
    array=req.body.CList.split(',');
    Model.updateOne({ItemID: req.body.uid},{CommentIDList:array},function (err,doc) {
        if(err)
        {
            console.log(err)
            return
        }
        console.log(array);
        res.json({
            status:1,
            code: 200,
            data:"修改成功"
        })
    })
})
router.post('/queryinfo/',function(req,res,next){
    Model.find({OwnerID:req.body.uid},function(err,docs){
        console.log(req.body.uid);
        console.log(docs);
        if(err){
            res.json({
                success:'fail',
                data:null
            })
        }else{
            res.json({
                status:1,
                code:200,
                data:docs
            })
        }
    })
})
router.post('/queryID/',function(req,res,next){
    var array=[String];
    array=req.body.uid.split(',');
    console.log('item IDs:' + array);
    Model.find({ItemID:{$in:array}},function(err,docs){
        // console.log(docs);
        if(err){
            res.json({
                success:'fail',
                data:null
            })
        }else{
                res.json({
                    status:1,
                    code:200,
                    data:docs
                })
        }
    })
})

// default file path
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        var singfileArray = file.originalname.split('.');
        var fileExtension = singfileArray[singfileArray.length - 1];
        cb(null, singfileArray[0] + '-' + Date.now() + "." + fileExtension);
        // console.log(file);
    }
})

var upload = multer({
    storage: storage
})

router.post('/uploadimg/',upload.single('imgfile'),function(req,res,next){
    let file = req.file;
    console.log(file);
    res.json({
        status:1,
        code: 200,
        data:{
            originname:file.originalname,
            generatename:file.filename
        }
    })
})

router.post('/release/',function(req,res,next){
    var imageid=Math.floor(Math.random()*(40000000-2000+1)+2000);
    var itemid=Math.floor(Math.random()*(40000000-2000+1)+4521);
    var newimage = new imgModel({
        ImageID : imageid,
        UserID : req.body.uid,
        StoragePath : req.body.upic
    });
    newimage.save(function (err, res) {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    });

    var newitem = new Model({
        ItemID : itemid,
        OwnerID: req.body.uid,
        Text: req.body.ucomment,
        ImageID:imageid,
        ProsNum:0,
        ConsNum:0,
        CommentNum:0
    });
    newitem.save(function (err, res) {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    });

    res.json({
        success:'true',
        code:200,
        data:"发布成功！",
        image_id:imageid,
        item_id:itemid
    })
})

module.exports=router;
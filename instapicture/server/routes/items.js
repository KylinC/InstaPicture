var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
// schema
var Model=require('../models/items');

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
    Model.find({ItemID:{$in:array}},function(err,docs){
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

module.exports=router;
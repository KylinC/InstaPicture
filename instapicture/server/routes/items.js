var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
// schema
var Model=require('../models/items');

// password require
mongoose.connect('mongodb://127.0.0.1:27017/picturebase');//design是数据库名

// mount (disconnected,error)
mongoose.connection.on('connected',function(){
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
    Model.find({ItemID:req.body.uid},function(err,docs){
        console.log(req.body.uid);
        console.log(docs);
        if(err){
            res.json({
                success:'fail',
                data:null
            })
        }else{
            if(docs.length===1){
                res.json({
                    status:1,
                    code:200,
                    data:{
                        ownerID:docs[0].OwnerID,
                        text:docs[0].Text,
                        imageID:docs[0].ImageID,
                        prosNum:docs[0].ProsNum,
                        consNum:docs[0].ConsNum,
                        commentNum:docs[0].CommentNum,
                        commentIDList:docs[0].CommentIDList
                    }
                })
            }
            else{
                res.json({
                    success:'query fail',
                    data:null
                })
            }
        }
    })
})

module.exports=router;
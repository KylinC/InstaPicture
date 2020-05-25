var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
// schema
var Model=require('../models/images');

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
                code:200,
                data:docs
            })
        }
    })
})

router.post('/album/',function(req,res,next){
    Model.find({UserID:req.body.uid},function(err,docs){
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
router.post('/queryinfo/',function(req,res,next){
    // find in mongoose
    Model.find({ImageID: req.body.uid},function(err,docs){
        // req.body.uid
        console.log(req.body.uid);
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
                    data:docs[0].StoragePath
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


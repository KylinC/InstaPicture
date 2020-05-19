var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
// schema
var Model=require('../models/comments');

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

router.post('/queryID/',function(req,res,next){
    Model.find({CommentID:req.body.uid},function(err,docs){
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
                        CommentUserID:docs[0].CommentUserID,
                        CommentText:docs[0].CommentText,
                        Time:docs[0].Time
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
router.post('/give_comment/',function(req,res,next){
    var comment=new Model({
        CommentID:req.body.comid,
        ItemID:req.body.itemid,
        CommentUserID:req.body.userid,
        CommentText:req.body.content,
        Time:req.body.time
    });
    comment.save(function (err) {
     if (err) { 
          res.json({
          success:'fail',
          data:null })
      }else{
         res.json({
             status:1,
             code:200,
             data: '1'
         })
      }
     });
     console.log(comment);
 })

module.exports=router;


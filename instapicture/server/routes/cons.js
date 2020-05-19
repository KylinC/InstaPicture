var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
// schema
var Model=require('../models/cons');

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
router.post('/give_con/',function(req,res,next){
    var con=new Model({
        ConID:req.body.conid,
        ItemID:req.body.itemid,
        ConUserID:req.body.userid,
        Time:req.body.time,
    });
    con.save(function (err) {
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
     console.log(con);
 })


module.exports=router;


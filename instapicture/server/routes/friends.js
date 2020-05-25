var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
// schema
var Model=require('../models/friends');
// password require
mongoose.connect('mongodb://127.0.0.1:27017/friendsbase');

//to-do populate
router.post('/',function(req,res){

})

module.exports=router;
// router.post('/friends/my/',function(req,res,next){
//     Model.find({FollowerID:req.body.uid},function(err,docs){
//         if(err){
//             res.json({
//                 success:'fail',
//                 data:null
//             })
//         }else{
//             res.json({
//                 status:1,
//                 code:200,
//                 data:docs
//             })
//         }
//     })
// })


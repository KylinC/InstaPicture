var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
// schema
var Model=require('../models/friends');
var userModel=require('../models/userInfos');

// password require
mongoose.connect('mongodb://127.0.0.1:27017/picturebase');//design是数据库名

// mount (disconnected,error)
mongoose.connection.on('connected',function(){
    console.log('connected',"friends");
});

//to-do populate
router.post('/',function(req,res,next){
    // Model.find({CelebrityID:120660863572807},function(err,docs){
    //     if(err){
    //         res.json({
    //             success:'fail',
    //             data:null
    //         })
    //     }else{
    //         res.json({
    //             success:'true',
    //             data:docs
    //         })
    //     }
    // })

    res.json({
        success:'true',
        code:200,
        data:[
            {
                Name:"simon",
                imgRoad:'1.jpg',
                tags:['高尔夫球', '史宾格犬', '磁带播放机']
            },
            {
                Name:"simon",
                imgRoad:'1.jpg',
                tags:['高尔夫球', '史宾格犬']
            }
        ]
    })
})

var findres=[];

router.post('/my/',function(req,res,next){
    let findres=[];
    Model.find({FollowerID:req.body.uid},function(err,docs){
        for(var i=0;i<docs.length;i++){
            let tmpID = docs[i].CelebrityID;
            userModel.find({UserID:tmpID},function (err1,docs1) {
                findres.push({Name:docs1[0].UserName,
                    imgRoad:docs1[0].ProfileImagePath,
                    tags:docs1[0].TagList
                })
            })

        }
    })

    res.json({
        success:'true',
        code:200,
        data:[
            {
                Name:"simon",
                imgRoad:'1.jpg',
                tags:['高尔夫球', '史宾格犬', '磁带播放机']
            },
            {
                Name:"simon",
                imgRoad:'1.jpg',
                tags:['高尔夫球', '史宾格犬']
            }
        ]
    })
})

module.exports=router;


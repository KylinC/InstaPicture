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


router.post('/my/',function(req,res,next){
    let findres=[];
    let findresid=[];
    Model.find({FollowerID:req.body.uid},function(err,docs){
        for(var i=0;i<docs.length;i++){
            findresid.push(docs[i].CelebrityID);
        }
        // console.log(findresid);
        userModel.find({UserID:{$in:findresid}},function (err1,docs1) {
            for(var i=0;i<docs1.length;i++){
                findres.push({Name:docs1[i].UserName,
                    imgRoad:docs1[i].ProfileImagePath,
                    tags:docs1[i].TagList
                })
            }
            res.json({
                success:'true',
                code:200,
                data:findres
            })
        })
    })
})

router.post('/search/',function(req,res,next){
    userModel.find({UserName:req.body.uname},function(err,docs){
        if(docs.length===0){
            res.json({
                success:'true',
                code:201,
                data:null
            })
        }
        else{
            res.json({
                success:'true',
                code:200,
                data:[{Name:docs[0].UserName,
                    imgRoad:docs[0].ProfileImagePath,
                    tags:docs[0].TagList
                }]
            })
        }
    })
})

module.exports=router;


var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
// schema
var Model=require('../models/userInfos');
const multer  = require('multer');
const QiniuManager = require('../utils/QiniuManager');
const Urlconfig = require('../utils/config');

// qiniu cloud default config
const createManager = () => {
    const accessKey = "m-_8vmjUtJYAGMDO4UO04yd322nnPm3C9pTrbAXN"
    const secretKey = "4l8y6dFJB6ZgMl5BOxyX7L4MW-mL_ipeimNhVRlw"
    const bucketName = "kylinya"
    return new QiniuManager(accessKey, secretKey, bucketName)
}

// password require
mongoose.connect('mongodb://127.0.0.1:27017/piacturebase');//design是数据库名

// mount (disconnected,error)
mongoose.connection.on('connected',function(){
    // console.log('connected');
});

// relative router
router.post('/',function(req,res,next){
    // console.log(req.query);
    // find in mongoose
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
    // res.json({aa:"success user"})
})

router.post('/pwdlogin/',function(req,res,next){
    // find in mongoose
    Model.find({PhoneNum: req.body.cellphone},function(err,docs){
        console.log(req.body.cellphone);
        console.log(docs);
        if(err){
            res.json({
                success:'fail',
                data:null
            })
        }else{
            if(docs.length===1){
                if(docs[0].Password===req.body.password){
                    res.json({
                        status:1,
                        code:200,
                        data:{
                            auth_token:"ssdd",
                            nickname:docs[0].UserName,
                            uid:docs[0].UserID,
                            utype:"0"
                        }
                    })
                }
                else{
                    res.json({
                        status:0,
                        code:303,
                        data:"您输入的用户名或密码不正确"
                    })
                }
            }
            else{
                res.json({
                    status:0,
                    code:303,
                    data:"您输入的用户名不存在"
                })
            }
        }
    })
})

router.post('/queryinfo/',function(req,res,next){
    // find in mongoose
    Model.find({UserID: req.body.uid},function(err,docs){
        // req.body.uid
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
                        cellPhone: docs[0].PhoneNum,
                        gender: ((docs[0].Gender==="Male")?"1":"2"),
                        head: docs[0].ProfileImagePath,
                        nickname: docs[0].UserName,
                        points: "0",
                        uid: docs[0].UserID,
                        utype: "0"
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

router.post('/safeout/',function(req,res,next){
    // console.log(req.body);
    // find in mongoose
    // single logic !!!

    // single logic
    res.json({
        status:1,
        code: 200,
        data:"已安全退出"
    })
})

router.post('/updateuser/',function(req,res,next){
    // update in mongoose
    Model.updateOne({UserID: req.body.uid},{UserName: req.body.nickname, ProfileImagePath:req.body.head, Gender:(req.body.gender==1)?"Male":"Female"},function (err,doc) {
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

router.post('/modpwd/',function(req,res,next){
    // update in mongoose
    Model.updateOne({UserID: req.body.uid},{Password: req.body.password},function (err,doc) {
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

router.post('/isauth/',function(req,res,next){
    // console.log(req.body);
    // find in mongoose
    // Auth Roter

    Model.find({UserID: req.body.uid},function(err,docs){
        // req.body.uid
        if(err){
            res.json({
                status:0,
                code: 201,
                data:"查询失败"
            })
        }else{
            if(docs.length===1){
                if(req.body.auth_token==="ssdd"){
                    res.json({
                        status:1,
                        code: 200,
                        data: "有权限访问"
                    })
                }
                else{
                    res.json({
                        status:0,
                        code: 201,
                        data: "无权限访问1"
                    })
                }
            }
            else{
                res.json({
                    status:0,
                    code: 201,
                    data:"无权限访问2"
                })
            }
        }

    })
})

// default file path
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/avator')
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

router.post('/formdatahead/',upload.single('avatar'),function(req,res,next){
    let file = req.file;
    // console.log(file)
    // find in mongoose
    // generate OSS
    const manager = createManager();
    manager.uploadFile(file.filename, Urlconfig.baseUrl+file.path);

    res.json({
        status:1,
        code: 200,
        data:{
            originname:file.originalname,
            generatename:file.filename
        }
    })
})

module.exports=router;


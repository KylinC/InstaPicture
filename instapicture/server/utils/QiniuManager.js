// https://github.com/KylinC/eMarkDown/blob/master/src/utils/QiniuManager.js

const qiniu = require('qiniu')
const axios = require('axios/index')
const fs = require('fs')
class QiniuManager {
    constructor(accessKey, secretKey, bucket ) {
        //generate mac
        this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
        this.bucket = bucket

        // init config class
        this.config = new qiniu.conf.Config()
        // zone
        this.config.zone = qiniu.zone.Zone_z0

        this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
    }
    uploadFile(key, localFilePath) {
        // generate uploadToken
        const options = {
            scope: this.bucket + ":" + key,
        };
        const putPolicy = new qiniu.rs.PutPolicy(options)
        const uploadToken=putPolicy.uploadToken(this.mac)
        const formUploader = new qiniu.form_up.FormUploader(this.config)
        const putExtra = new qiniu.form_up.PutExtra()
        // file upload
        formUploader.putFile(uploadToken, key, localFilePath, putExtra, function(respErr, respBody, respInfo) {
            if (respErr) {
                throw respErr;
            }

            if (respInfo.statusCode == 200) {
                console.log(respBody);
            } else {
                console.log(respInfo.statusCode);
                console.log(respBody);
            }
        });

    }

}

module.exports = QiniuManager
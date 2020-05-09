const QiniuManager = require('../utils/QiniuManager');

const createManager = () => {
    const accessKey = "m-_8vmjUtJYAGMDO4UO04yd322nnPm3C9pTrbAXN"
    const secretKey = "4l8y6dFJB6ZgMl5BOxyX7L4MW-mL_ipeimNhVRlw"
    const bucketName = "kylinya"
    return new QiniuManager(accessKey, secretKey, bucketName)
}

const manager = createManager();
var res = manager.uploadFile("testfile.png", "/Users/kylinchan/Desktop/sss.png");
console.log(res);


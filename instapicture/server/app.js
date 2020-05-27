var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs=require('ejs');
const PythonConnector = require('./python_server/PythonConnector');

// test
var friendsRouter=require('./routes/friends');
var imagesRouter=require('./routes/images');
var userimfosRouter = require('./routes/userInfos');
var indexRouter = require('./routes/index');
var itemRouter= require('./routes/items');
var commentRouter= require('./routes/comments');
var conRouter= require('./routes/cons');
var proRouter= require('./routes/pros');

var app = express();

// proxy
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router definitions
app.use('/', indexRouter);
app.use('/api/images',imagesRouter);
app.use('/api/friends',friendsRouter);
app.use('/api/userinfos',userimfosRouter);
app.use('/api/items',itemRouter);
app.use('/api/comments',commentRouter);
app.use('/api/pros',proRouter);
app.use('/api/cons',conRouter);

app.post('/python/get_rec_items', async function (req,res,next) {
    var user_id = Number(req.body.uid);
    await console.log('uid='+user_id);
    try {
        // synchronous function
        const prediction = await PythonConnector.invoke('get_rec_items', user_id);
        res.json({
            status:1,
            code:200,
            data:prediction})
    }
    catch (e) {
        console.log(`error in ${req.url}`, e);
        res.json({
                success:'fail',
                data:null
            })
    }
});

app.post('/python/get_rec_users', async function (req,res,next) {
    var user_id = Number(req.body.uid);
    await console.log('uid='+user_id);
    try {
        // synchronous function
        const prediction = await PythonConnector.invoke('get_rec_users', user_id);
        res.json({
            status:1,
            code:200,
            data:prediction})
    }
    catch (e) {
        console.log(`error in ${req.url}`, e);
        res.json({
                success:'fail',
                data:null
            })
    }
});

app.post('/python/update_user_feature', async function (req,res,next) {
    var user_id = Number(req.body.uid);
    await console.log('uid='+user_id);
    try {
        // synchronous function
        await PythonConnector.invoke('update_user_feature', user_id);
        res.json({success: 'OK'})
    }
    catch (e) {
        console.log(`error in ${req.url}`, e);
        res.json({success:'fail'})
    }
});

app.post('/python/update_social_feature', async function (req,res,next) {
    var user_id = Number(req.body.uid);
    await console.log('uid='+user_id);
    try {
        // synchronous function
        await PythonConnector.invoke('update_social_feature', user_id);
        res.json({success: 'OK'})
    }
    catch (e) {
        console.log(`error in ${req.url}`, e);
        res.json({success:'fail'})
    }
});

app.post('/python/update_image_feature', async function (req,res,next) {
    var img_id = Number(req.body.uimgid);
    var weight = Number(req.body.uweight);
    await console.log('img_id='+img_id);
    await console.log('weight='+weight);
    try {
        // synchronous function
        await PythonConnector.invoke('update_image_feature', img_id, weight);
        res.json({success: 'OK'})
    }
    catch (e) {
        console.log(`error in ${req.url}`, e);
        res.json({success:'fail'})
    }
});

app.post('/python/update_item_feature', async function (req,res,next) {
    var item_id = Number(req.body.uitemid);
    await console.log('item_id='+item_id);
    try {
        // synchronous function
        await PythonConnector.invoke('update_item_feature', item_id);
        res.json({success: 'OK'})
    }
    catch (e) {
        console.log(`error in ${req.url}`, e);
        res.json({success:'fail'})
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err.message);
  
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, async () => {
    console.log(`Started listening on port ${PORT} ...`);
    await PythonConnector.invoke('listen');
});

module.exports = app;

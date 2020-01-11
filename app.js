var createError = require('http-errors');
var express = require('express');
var connect = require('connect');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session'); // 引入session中间件
var logger = require('morgan');
var bodyParser = require('body-parser');

// 自己写的中间件
var myBodyParse = require('./models/bodyParse');
var handleBodyData = require('./models/uploadData.js');
// express 自带的
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// 引入视图渲染
let photos = require('./routes/photos');
// 用户注册功能
let register = require('./routes/register');
// 信息提示中间件
let message = require('./libs/message');
let login = require('./routes/login');
// 用户评论内容
let entries = require('./routes/entries');
let Entry = require('./libs/entry');
// 验证中间件
let validate = require('./libs/middleware/validate');
// 用户信息挂载中间件
let user = require('./libs/middleware/user');
// 分页中间件
let page = require('./libs/middleware/page');

// 得到生产环境
let env = process.env.NODE_ENV || 'development';
// 注意在process.env中并没有NODE_ENV 这个属性，需要自己设置
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
if(env =='production'){
	app.set('photo','/mounted-volume/photos');
}
if (app.get('env') === 'production') {
  //app.set('trust proxy', 1) // trust first proxy
  app.set('photo','/mounted-volume/photos');
 // sess.cookie.secure = true // serve secure cookies
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



// session中间件已经从express中移开
//app.use(express.session());
app.set('trust proxy', 1) // trust first proxy
app.use(session({ secret: 'LLL'}));
// 挂载用户信息
app.use(user);
//可以在任何视图中访问message
app.use(message);
app.use(express.static(path.join(__dirname, 'public')));




//app.use('/', indexRouter);
app.use('/users', usersRouter);

/*图片操作功能*/
app.set('photos',path.join(__dirname,'/public/photos'));
app.get('/photos',photos.list);
app.get('/upload',photos.form); // 渲染提交图片页面的模板
app.post('/upload',handleBodyData);
app.post('/upload',photos.submit(app.get('photos')));
app.get('/photos/:id/download',photos.download(app.get('photos')));

/*用户注册功能*/

app.get('/register',register.form); // 在搜索框中输入register时渲染注册页面
app.post('/register',handleBodyData);
app.post('/register',register.submit);// 注册提交后的操作

/*用户登录功能*/
app.get('/login',login.form);
app.post('/login',handleBodyData);
app.post('/login',login.submit);
app.get('logout',login.logout);
/*用户评论功能*/
//app.get('/',page(Entry.count,5),entries.list);
app.get('/',page(Entry.count,5),entries.list);

app.get('/post',entries.form);
app.post('/post',handleBodyData); // 顺序
app.post('/post',validate.required('entry[title]'));
app.post('/post',validate.lengthAbove('entry[title]',4));

app.post('/post',entries.submit);




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

module.exports = app;



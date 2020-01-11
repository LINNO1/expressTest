let User = require('../libs/User');
let session = require('express-session');
// 用视图模板渲染注册页面
exports.form=(req,res)=>{
	res.render('register',{title: 'Register'});
}

/*
PRG 模式，post/redirect/get 用户提交表单数据后，重定向到另外一个web上
主要是防止表单重复提交
*/
exports.submit =(req,res,next)=>{
	let data = req.body.user;
	console.log("req.body=",req.body);
	User.getByName(data.name,(err,user)=>{
		if(err) return next(err);
		if(user.id){
			console.log("user.id=",user.id);
			console.log("req.session=",req.session);
			res.error(req,'Username already taken!');
			res.redirect('back'); // 重定向
		}else{
			user = new User({
				name: data.name,
				pass: data.pass
			});
			user.save(err=>{
				if(err) return next(err);
				req.session.uid = user.id;
				console.log("req.session=",req.session);
				console.log("req.session.uid=",req.session.uid);
				res.redirect('/');
			})
		}
	})
}

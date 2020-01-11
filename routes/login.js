let User = require('../libs/User');
exports.form = (req,res)=>{
	res.render('login',{title: 'Login'});
}
exports.submit =(req,res,next)=>{
	let data = req.body.user;
	User.authenticate(data.name,data.pass,(err,user)=>{
		if(err) return next(err);
		if(user){
			req.session.uid = user.id;
			res.redirect('/');
		}else{
			res.error(req,'Invalid credentials');
			res.redirect('back');
		}
	})
}

exports.logout =(req,res)=>{
	req.session.destory(err=>{
		if(err) throw err;
		res.redirect('/');
	})
}
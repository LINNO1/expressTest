/*用户加载中间件，从数据库中加载用户信息，将用户的信息挂载在 req 这个上下文对象中
构建在Node之上的高层框架可能会提供额外的对象存放已认证用户之类的数据，但Express坚持使用Node提供的原始对象
*/


let User = require('../user');
module.exports=(req,res,next)=>{
	let uid = req.session.uid;
	if(!uid) return next();
	User.getById(uid,(err,user)=>{
		if(err) return next(err);
		// 将用户的信息输出到相应对象中
		req.user = res.locals.user = user;
		next();
	})
}
/*
res.locals包含响应局部变量的对象，仅可用于在该请求/响应周期（如果有）中呈现的视图。
否则，此属性与app.locals相同。
此属性对于公开请求级别的信息很有用，例如请求路径名，经过身份验证的用户，用户设置等

*/
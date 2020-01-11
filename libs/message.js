let express = require("express");
let res = express.response; 
//express.response对象是Express给响应对象用的原型。
//向这个对象中添加属性意味着所有中间件和路由都能访问它们。 

res.message = (req,msg,type)=>{
	type = type || "info";
	let sess = req.session;

	sess.message = sess.message || [];
	sess.message.push({type: type, string: msg});
}

res.error =(req,msg)=>{
	return res.message(req,msg,'error');
}

module.exports=(req,res,next)=>{
	res.locals.message = req.session.message||[];
	res.locals.removeMessage=()=>{
		req.session.message=[];
	}
	next();
}
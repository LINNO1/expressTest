module.exports=(fn,perpage)=>{
	perpage = perpage || 10;  // 每一页的条数
	return (req,res,next)=>{
		let page = Math.max(parseInt(req.param("page")||"1",10),1)-1;
		fn((err,total)=>{
			if(err) return next(err);
			// 将数据传入模板函数
			req.page = res.locals.page = {
				number: page,
				perpage: perpage,
				from: page*perpage,
				to: (page+1)*perpage-1,
				total: total, // total 为要获取的数据的总数
				count: Math.ceil(total/perpage)
			}
			next();
		});
	}

}

/* 路径：  /user/:name
   输入 GET /user/tj
   得： req.params.name => "tj"
*/
let Entry = require('../libs/entry');
exports.list = (req,res,next)=>{
	let page = req.page;
	Entry.getRange(page.from,page.to,(err,entries)=>{
		if(err) return next(err);
		res.render('entries',{
			title: 'Entries',
			entries: entries,
		});
	})
}
exports.form=(req,res)=>{
	res.render('post',{title: 'post'});
}
exports.submit=(req,res,next)=>{
	console.log("entry submit message",req.body);
	let data = req.body.entry;
	let entry = new Entry({
		name: res.locals.user.name,
		title: data.title,
		body: data.body
	});
	entry.save(err=>{
		if(err) return next(err);
		res.redirect("/");
	})
}
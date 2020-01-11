/* 这里用了 mongdb 数据库
  但是我的电脑没安装这个数据库
  用 mysql代替
*/


const mysql= require('mysql');
// let mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/photo_app');
// let schema = new mongoose.Schema({
// 	name: String,
// 	path: String
// });
// module.exports = mongoose.model('Photo',schema);
let db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'ljm26918',
  database: 'timetrack'
});

/*
Photo.create({
			name: name,
			path: img.name
		},(err)=>{
           if(err) return next(err);
           res.redirect('/'); // 重定向到首页
    })

*/
exports.create = (item,cb)=>{	
		db.query("INSERT INTO photolist (name,path) VALUES(?,?)",
			[item.name,item.path],
			(err)=>{
				 cb(err);				
			})	
}

/*
Photo.findById(id,(err,photo)=>{
		if(err) return next(err);
		let path = path.join(dir,photo.path);
		res.sendfile(path);
	})

*/
exports.findById = (id,cb)=>{	
		db.query(
			"SELECT * FROM photolist WHERE id=?",[id],
			(err,result)=>{
				console.log(result);
				cb(err,result);
			})				
}

/*
Photo.find({},(err,photos)=>{
		if(err) return next(err);
		res.render('photos',{
		  title: 'Photos',
		  photos: photos
	})*/
exports.find = (obj,cb)=>{
	db.query("SELECT * FROM photolist",(err,rows)=>{
		console.log(rows);
		cb(err,rows);
	})
}
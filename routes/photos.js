let Photo = require('../models/Photo');
const path = require('path');
const fs = require('fs');
let photos=[];
photos.push({
	name: 'LA',
	path:'./images/1.jpg'
});
photos.push({
	name: 'LB',
	path:'./images/2.jpg'
});
photos.push({
	name: 'LC',
	path:'./images/3.jpg'
});
photos.push({
	name: 'LD',
	path:'./images/4.jpg'
});
photos.push({
	name: 'LE',
	path:'./images/5.jpg'
});
photos.push({
	name: 'LF',
	path:'./images/6.jpg'
});

// 这里的地址都是相对于public文件夹的
/*exports.list=(req,res)=>{
	res.render('photos',{
		title: 'Photos',
		photos: photos
	})
}*/
// 从数据库中取出图片
exports.list =(req,res,next)=>{
	Photo.find({},(err,photos)=>{
		console.log(photos);
		if(err) return next(err);
		res.render('photos',{
		  title: 'Photos',
		  photos: photos
	})

	})
}
// 则会寻找view下的photo.ejs或者在view/photos的index文件
// 渲染上传图片页面的模板
exports.form=(req,res)=>{
	res.render('photos/upload',{
		title: 'Photo upload'
	})
}
// 提交图片
exports.submit=(dir)=>(req,res,next)=>{
	let img = req.files.photo.image;
	let name = req.body.photo.name || img.name;
	let imgpath = path.join(dir,img.name);
	console.log('imgpath',imgpath);

// fs.rename不能跨磁盘
/*	fs.rename(img.path,imgpath,(err)=>{
		if(err) return next(err);
		Photo.create({
			name: name,
			path: img.name
		},(err)=>{
           if(err) return next(err);
           res.redirect('/'); // 重定向到首页
		})
	})*/
	// 用下面的代替
	fs.readFile(img.path, function (err, data) {
            if (err) return next(err);
            console.log('File read!');
            // Write the file
            fs.writeFile(imgpath, data, function (err) {
                if (err) return next(err);             
                Photo.create({
			       name: name,
			       path: img.name
		        },(err)=>{
                   if(err) return next(err);
                   res.redirect('/photos'); // 重定向到首页
		      })
            });

            // Delete the file
            fs.unlink(img.path, function (err) {
                if (err) res.redirect('/');
                console.log('File deleted!');
            });

})
}
exports.download = (dir)=>(req,res,next)=>{
	console.log(req.params);
	let id = req.params.id;
	Photo.findById(id,(err,photo)=>{
		if(err) return next(err);
		console.log('download...,photo:',photo[0].path);
		let imgpath = path.join(dir,photo[0].path);
		// res.sendfile(imgpath);
		res.download(imgpath,photo[0].name);
	})
}
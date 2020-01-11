let bcrypt = require('bcryptjs');


// 与书本例子的区别：
// 1. 用户密码加密方式 bcrypt不好安装，改为cryptojs加密
// 2. 数据库用mysql
/* 这里用了 mongdb 数据库
  但是我的电脑没安装这个数据库
  用 mysql代替
*/

const mysql= require('mysql');
let db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'ljm26918',
  database: 'timetrack'
});
class User{
	constructor(obj){
         for(let key in obj){        	
         	this[key]=obj[key];
         }
	}
    // 保存用户的信息
	save(cb){
		// 如果用户的id存在，则更新用户的信息
		if(this.id){
			this.update(cb);
		}else{ // 若是个新用户，则在数据库中加入新的信息
			// 注意这里的属性名要与 表单设置的一样
            this.hasPassword(()=>{
			db.query("INSERT INTO userinfo(name,pass,salt) VALUES(?,?,?)",
				[this.name,this.pass,this.salt],
				(err,result)=>{
					
					 this.id=result.insertId;
					 cb(err);				
				})
			});			
		}
	}
	// 更新数据
	update(cb){		
		db.query("UPDATE userinfo set name=?,pass=?,salt=? WHERE id=?",
				[this.name,this.pass,this.salt,this.id],
				(err)=>{
					 cb(err);				
				})
	}	
			
	// 为用户设定的密码加密
	hasPassword(cb){
		bcrypt.genSalt(12,(err,salt)=>{
			if(err) return cb(err);
			this.salt = salt;
			bcrypt.hash(this.pass,salt,(err,hash)=>{
				if(err) return cb(err);
				this.pass=hash; // this.pass变成加密后的密码
				cb();
			})
		})
	}	
}
// 类函数
User.getByName=(name,cb)=>{
		db.query(
			"SELECT * FROM userinfo WHERE name=?",[name],
			(err,result)=>{
				console.log("mysql userinform...",result); // result的结果是个数组
				cb(err,new User(result[0]));
			})	
}
User.getById=(id,cb)=>{
		db.query(
			"SELECT * FROM userinfo WHERE id=?",[id],
			(err,result)=>{				
				cb(err,new User(result[0]));
			})	
}
User.authenticate = (name,pass,cb)=>{
	User.getByName(name,(err,user)=>{
		if(err) return cb(err);
		if(!user.id) return cb();
		// 用在数据库中存储的该用户的盐值给密码哈希加密，如果得出的哈希值与数据库存储的一样，则密码正确
		bcrypt.hash(pass,user.salt,(err,hash)=>{
			if(err) return cb(err);
			if(hash==user.pass) return cb(null,user);
			cb();
		})
	})
}
module.exports=User;
/*书本的版本*/
/*class User{
	constructor(obj){
         for(let key in obj){
         	this[key]=obj[key];
         }

	}
    // 保存用户的信息
	save(cb){
		// 如果用户的id存在，则更新用户的信息
		if(this.id){
			this.update(cb);
		}else{ // 若是个新用户，则在数据库中加入新的信息
			db.incr('user:ids',()=>{
				if(err) return cb(err);
			    this.id=id;
			    this.hasPassword(err=>{
			    	if(err) return cb(err);
			    	this.update(cb);
			    })
			})
		}
	}
	// 将用户和id绑定，并且存入数据库
	update(cb){
		let user =this;
		let id = this.id;
		db.set("user:id:"+user.name,id,err=>{
			cb(err);
		})
	}
	// 为用户设定的密码加密
	hasPassword(cb){
		bcrypt.genSalt(12,(err,salt)=>{
			if(err) return cb(err);
			this.salt = salt;
			bcrypt.hash(this.pass,salt,(err,bash)=>{
				if(err) return cb(err);
				this.pass=hash; // this.pass变成加密后的密码
				cb();
			})
		})
	}	
}
// 类函数
User.getByName=(name,cb)=>{
	User.getId(name,(err,id)=>{
		if(err) return cb(err);
		User.get(id,cb);
	})	
}
User.getId = (name,cb)=>{
	db.get('user:id:'+name,cb);
}
User.get = (id,cb)=>{
	db.hgetall('user:'+id,(err,user)=>{
		if(err) return cb(err);
		cb(null,new User(user));
	})
}

User.authenticate = (name,pass,cb)=>{
	User.getByName(name,(err,user)=>{
		if(err) return cb(err);
		if(!user.id) return cb();
		bcrypt.hash(pass,user.salt,(err,hash)=>{
			if(err) return cb(err);
			if(hash==user.hash) return cb(null,user);
			cb();
		})
	})
}*/

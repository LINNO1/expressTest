
let mysql = require('mysql');
// 连接数据库
let db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'ljm26918',
  database: 'timetrack'
});



class Entry{
	constructor(obj){
		for(let key in obj){
			this[key]=obj[key];
		}
	}
	save(cb){
		//let entryJSON = JSON.stringify(this);
		//console.log("sql entry:",entryJSON);
		db.query("INSERT INTO entry(name,title,body) VALUES(?,?,?)",
				[this.name,this.title,this.body],
				(err,result)=>{					
					 cb(err);				
		       });
    }
}
Entry.getRange = (from,to,cb)=>{
    db.query("SELECT * FROM entry LIMIT ?,?",
				[from,to],
				(err,result)=>{	
				    if(err) return cb(err);
				    let entries=[];
		            result.forEach(item=>{
			               entries.push(item);
		             });
		           cb(null,entries);			
		       });
}
Entry.count=fn=>{

    db.query("SELECT COUNT(*) total FROM entry",
				(err,result)=>{	
					console.log("count ...",result[0].total);
				    if(err) return fn(err);
				    fn(err,result[0].total);		
		       });

}
module.exports=Entry;

/*let redis = require('redis');
let db = redis.createClient();

module.exports=Entry;

class Entry{
	constructor(obj){
		for(let key in obj){
			this[key]=obj[key];
		}
	}
	save(cb){
		let entryJSON = JSON.stringify(this);
		db.lpush('entries',entryJSON,err=>{
			if(err) return cb(err);
			cb();
		    })
		}	
}
Entry.getRange = (from,to,cb)=>{
	db.lrange('entries',from,to,(err,items)=>{
		if(err) return cb(err);
		let entries=[];
		items.forEach(item=>{
			entries.push(JSON.parse(item));
		});
		cb(null,entries);
	})
}*/
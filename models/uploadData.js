var xml2js = require('xml2js');  //npmjs里的xml转json模块
var formidable = require('formidable');  //npmjs里的基于流逝处理解析报文


//content-type: xx;charset=utf8 取出第一个
var mime =req=>{ 
  let str = req.headers['content-type'] || ''; 
  return str.split(';')[0]; 
}; 
//根据请求头的'content-length'来判断是否有请求体
var hasBody= req=>req.headers['transfer-encoding']||req.headers['content-length'];


function parseJSON(req,res,next){
   try { 
 	    	req.body = JSON.parse(req.body); 
 	  } catch (e) { 
 		   res.writeHead(400); 
 		   res.end('Invalid JSON'); 
 		   return; 
   } 
   next();
}
function parseXML(req,res,next){	
   xml2js.parseString(req.body, function (err, xml) { 
     if (err) { 
          res.writeHead(400); 
          res.end('Invalid XML'); 
          return; 
     } 
          req.body = xml; 
          next();
    }); 
} 


function parsePost(req,res,next){
       req.body?null:req.body={};
       handleFile(req.body,req.body);
       next();

}




/*
后台的post 方式 用formidable的流式解析器 
代替 req.on('data',fn1).on('end',fn2)事件
formidable可处理大型文件上传 
上面 bodyParse 已经处理过了
*/
let parseFile=field=>field.split(/\[|\]/).filter(s=>s);
/*功能： 将 req.body.user[name] 转换成 req.body.user.name*/
function handleFile(reqx,obj){
let reg = /\[(.+)\]/g;

for(let key in obj){
          let match =key.match(reg);

           if(match){
            console.log('111');
              let first = parseFile(key)[0];
              let second = parseFile(key)[1];   
              reqx[first]? null: reqx[first]={};
              reqx[first][second]=obj[key];
           }else{
            console.log('222')
              reqx[key]=obj[key];
           }                   
        }
   }
function parseMultipart(req,res,next){
	
	var form = new formidable.IncomingForm();
/*	form.on('progress', function(bytesReceived, bytesExpected) {
   	var percent = Math.floor(bytesReceived/bytesExpected*100);
   	console.log(percent+'%');
   	res.write(percent+'%');
  });*/

    form.parse(req,function(err,fields,file){
      req.files={};
    	if(err){
           res.writeHead(400); 
           res.end('Invalid Multipart'); 
            return; 
    	}else{
    	 
    		console.log('fields:---------',fields);
    		console.log('file:---------',file);
    	   req.body?null:req.body={};
         req.files?null:req.files={};
        handleFile(req.body,fields);
        handleFile(req.files,file);
        console.log('req.body',req.body);
        console.log('req.files',req.files);
        /*
    let img = req.files.photo.image;
  let name = req.body.photo.name || img.name;
  let path = path.join(dir,img.name);



        */
    	}
    })
    form.on('end',function(){  	
    	next();
    })

}
function handleBodyData(req, res, next) { 
	 console.log('处理请求消息体,req.body=');
	 console.log(req.body);
 	if (hasBody(req)) {  //如果有上传数据         
      console.log(mime(req))
 		 //判断上传数据的类型
      switch(mime(req)){
 			      case 'application/json':
 			       console.log('application/json')
                   parseJSON(req,res,next); 
                   break;
            case 'application/xml':
                   console.log('application/xml')
                   parseXML(req,res,next); 
                   break;          
            case 'multipart/form-data':
                   console.log('multipart/form-data')
                   parseMultipart(req,res,next); 
                   break; 
            case 'application/x-www-form-urlencoded':
                   console.log('application/x-www-form-urlencoded')
                   parsePost(req,res,next); 
                   break;
            default:  console.log('next...');
                
                 next();    
        }
}
 		
} 
module.exports=handleBodyData;
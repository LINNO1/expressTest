let parseField=field=>field.split(/\[|\]/).filter(s=>s);
let getField = (req,parfield,field)=>{
	 console.log('getField=',parfield); // [entry,title]
	 console.log('req.body=',req.body);
	 /*field.forEach(prop=>{
	 	val=val[prop];
	 })*/
	let first = parfield[0];
    let second = parfield[1]; 
    let val = req.body[field]|| req.body[first][second]||{};  
	return val;
}
exports.required =field=>{
	let parfield=parseField(field);
	
	return (req,res,next)=>{
		if(getField(req,parfield,field)){
			next();
		}else{
			res.error(req,parfield.join(" ")+" is required.");
			res.redirect("back");
		}
	}
}
exports.lengthAbove=(field,len)=>{
	let parfield=parseField(field);
	
	return (req,res,next)=>{
		if(getField(req,parfield,field).length>len){
			next();
		}else{
			res.error(req,parfield.join(" ")+" must have more than "+len+" characters.");
			res.redirect("back");
		}
	}
}
<!--
function $(id){
	if(typeof(id) == "object"){
		return id;
	}else{
		if(document.getElementById(id) == null){
			alert("Can't find " + id);
		}else{
			return document.getElementById(id);
		}
	}
}
function $p(id){
	if(parent.document.getElementById(id) == null){
		alert("Can't find parent." + id);
		return "parent." + id;
	}else{
		return parent.document.getElementById(id);
	}
}
function setIdValue(id,id_value){
	$(id).value = id_value;
}
function getIdValue(id){
	return $(id).value;
}
function getIdStyle(id){
	return $(id).style;
}
function getIdChecked(){
	//arguments[0]	id
	//arguments[1]	if this is not null => return boolean;
	if(arguments[1] == null){
		return $(arguments[0]).checked==true?1:0;
	}else{
		return $(arguments[0]).checked;
	}
}

function setIdChecked(id,id_value){
	if(typeof(id_value) == "boolean"){
		$(id).checked = id_value;
	}else{
		var tmpValue = parseInt(id_value);
		$(id).checked = tmpValue!=0?true:false;
	}
}
function setIdDisabled(id,id_value){
	if(typeof(id_value) == "boolean"){
		
		$(id).disabled = id_value;		
	}else{
		
		var tmpValue = parseInt(id_value);
		$(id).disabled = tmpValue!=0?true:false;
	}
}
function setIdVisibility(id,id_value){
	var tmpObj;
	if(document.layers){
		tmpObj = eval(document.layers[id]);
		tmpObj.visibility = id_value==0?"hide":"show";
	}else{
		$(id).style.visibility = id_value==0?"hidden":"visible";
	}
}
function setIdInnerHTML(id,id_html){
	$(id).innerHTML = id_html;
}
function setIdSrc(id,id_src){
	$(id).src = id_src;
}
function setIdTitle(id,id_title){
	$(id).title = id_title;
}
function setIdClass(id,id_class){
	$(id).className = id_class;
}
function setIdDisplay(id,type){
	$(id).style.display = type;
}
String.prototype.trim = function(){
	return this.replace(/(^\s*)|(\s*$)/g,"");
}

function isFF(){
	if(navigator.userAgent.indexOf("Firefox") > 0){
		return true;
	}else{
		return false;
	}
}
function fullNumbers(tmpValue,digits){
	tmpValue += "";
	if(tmpValue.length > digits){
		tmpValue = tmpValue.substring(0,digits);
	}else{
		while(tmpValue.length < digits){
			tmpValue = "0" + "" + tmpValue;
		}
	}
	return tmpValue;
}
function checkUrlRandom(url){
	var mathRnd = Math.round(Math.random()*10000);
	if(url.indexOf("?") > 0 ){
		url = url + "&rnd=" + mathRnd;
	}else{
		url = url + "?rnd=" + mathRnd;
	}
	return url;	
}
function checkEmail(div_name,showInfo){
	var re = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if (!re.test($(div_name).value)){
            alert(showInfo + "格式錯誤！");
            return false;
        }
        return true;
}
function Checklen(id_name,min,max,showInfo){
	var len = $(id_name).value.length;
	if(len < min || len > max){
		if(min == max){
			alert(showInfo + " 長度應為 " + min);
		}else{
			alert(showInfo + " 長度應為 " + min + "~" + max);
		}
		return false;
	}else{
		return true;
	}
}
function CheckCharKeyin(Textobj,bChar,Value1,Value2){	//bChar 1:0-9 a-z ' ','.','-','_','@' 0:0-9, value1~value2
	var errFlag = false;
	var sText = Textobj.value;
	var l = sText.length;
	var bText = 0;
	for(var i = l-1;i >= 0;i--){
		var ch = sText.charCodeAt(i);
		if((ch >= 48) && (ch <= 57)){		//0-9
		  //
		}else if((ch >= 65) && (ch <= 90)){	//A-Z
			if(bChar == 0){
				bText = 1;
			}
		}else if((ch >= 97) && (ch <= 122)){	//A-Z
			if(bChar == 0){
				bText = 1;
			}
		}			else if((ch == 32) || (ch == 46) || (ch == 45) || (ch == 64) || (ch == 95)){
			if(bChar == 0){
				bText = 1;
			}
		}else{
			bText = 1;
		}			
	}	
	if(bText == 1){
		if(bChar == 0){
			alert("Number Only");
			errFlag = true;
		}else{
			alert("Characters must be 0-9, A-Z, ' ', '.', '-', '_', '@'");
			errFlag = true;
		}
		Textobj.focus();
	 	Textobj.select();
	}else{
		if(Value1 != Value2){
			if((sText < Value1) || (sText > Value2) || sText == ""){
				alert("Min:" + Value1 + ",Max:" + Value2);
				errFlag = true;
				Textobj.focus();
	 			Textobj.select();
			}
		}
	}
	return errFlag;
}
function setSelectYear(id,startYear,counters){
	var s1 = new HandleSelect(id,0);
	for(var i = 0;i <= counters;i++){
		s1.addOpt(i,i + 2007,i + 2007);
	}
}

function setSelectMonth(id){
	var s1 = new HandleSelect(id,0);
	for(var i = 0;i < 12;i++){
		s1.addOpt(i,fullNumbers(i + 1,2),i + 1);
	}
}
function setSelectDay(id){
	var s1 = new HandleSelect(id,0);
	for(var i = 0;i < 31;i++){
		s1.addOpt(i,fullNumbers(i + 1,2),i + 1);
	}
}
function setSelectHour(id,type){
	var s1 = new HandleSelect(id,0);
	if(type == 0){	//12H 
		for(var i = 0;i < 12;i++){
			s1.addOpt(i,fullNumbers(i + 1,2),i + 1);
		}
	}else{
		for(var i = 0;i < 24;i++){
			s1.addOpt(i,fullNumbers(i,2),i);
		}
	}
}
function setSelectMin(id){
	var s1 = new HandleSelect(id,0);
	for(var i = 0;i < 60;i++){
		s1.addOpt(i,fullNumbers(i,2),i);
	}
}
function getIdSelectText(id,value){
	//arguments[0] : id
	//arguments[1] : value
	if(arguments[1] != null){
		return $(arguments[0]).options[arguments[1]].text;
	}else{
		return $(arguments[0]).options[getIdValue(arguments[0])].text;
	}
}
function getDecimal(val,no){
	val = Math.round(val * Math.pow(10,no)) / Math.pow(10,no);  
	return val;
}
function getIdTop(id){
	var obj = $(id);
	var curTop = 0;
	if(obj.offsetParent){
        	do{
			curTop += obj.offsetTop;
        	}while(obj = obj.offsetParent);
	}else if(obj.y){
		curTop += obj.y;
	}
	return curTop;
}
function getIdLeft(id){
	var obj = $(id);
	var curLeft = 0;
	if(obj.offsetParent){
		do{
			curLeft += obj.offsetLeft;
		}while(obj = obj.offsetParent);
	}else if(obj.x){
		curLeft += obj.x;
	}
	return curLeft;
}
//=========================================================================================
function HandleSelect(){
	this.obj = $(arguments[0]);
	if(!this.obj){
		alert("Can't find '" + arguments[0] + "'");
	}
	if(arguments[1] != null){
		this.obj.options.length = arguments[1];
	}

	HandleSelect.prototype.setIdOptLen = function(len){
		this.obj.options.length = len;
	}
	HandleSelect.prototype.addOpt = function(){
		//arguments[0] : no
		//arguments[1] : text
		//arguments[2] : value
		//arguments[3] : defaultSelected
		//arguments[4] : selected
		var ds = arguments[3]!=null?arguments[3]:false;
		var sd = arguments[4]!=null?arguments[4]:false;
		this.obj.options[arguments[0]] = new Option(arguments[1],arguments[2],ds,sd);
	}
	HandleSelect.prototype.setValue = function(id_value){
		this.obj.value = id_value;
	}
}
function HandleTable(){
	this.table = $(arguments[0]);
	if(!this.table){
		alert("Can't find '" + arguments[0] + "'");
	}
	this.rows = this.table.rows.length;
	this.tr;
	this.trFlag = 0;
	this.td;
	this.tdFlag = 0;
	this.trCount = this.getTrCount;
	
	HandleTable.prototype.insertRow = function(){
		this.tr = this.table.insertRow(-1);
	}
	HandleTable.prototype.setTrAttr = function(nTag,nValue){
		this.tr.setAttribute(nTag,nValue);
	}
	HandleTable.prototype.setTrStyle = function(nTag,nValue){
		eval("this.tr.style." + nTag + " = \"" + nValue + "\";");
	}
	HandleTable.prototype.setTrEvent = function(nTag,nValue){
		eval("this.tr." + nTag + " = function(){" + nValue+ "}");
	}
	HandleTable.prototype.getTrCount = function(){
		return this.table.rows.length;
	}
	HandleTable.prototype.clearTrFlag = function(){
		this.trFlag = 0;
	}
	HandleTable.prototype.setTrClass = function(className){
		this.tr.className = "\"" +  className + "\"";
	}
	
	
	HandleTable.prototype.insertCell = function(){
		this.td = this.tr.insertCell(-1);
	}
	HandleTable.prototype.setTdAttr = function(nTag,nValue){
		this.td.setAttribute(nTag,nValue);
	}
	HandleTable.prototype.setTdStyle = function(nTag,nValue){
		eval("this.td.style." + nTag + " = \"" + nValue + "\";");
	}
	HandleTable.prototype.setTdEvent = function(nTag,nValue){
		eval("this.td." + nTag + " = function(){" + nValue+ "}");
	}
	HandleTable.prototype.getTdCount = function(trNo){
		return this.table.rows(trNo).cells.length;
	}
	HandleTable.prototype.clearTdFlag = function(){
		this.tdFlag = 0;
	}
	HandleTable.prototype.setTdClass = function(className){
		this.td.className = className;
	}
	HandleTable.prototype.setTdInnerHTML = function(text){
		this.td.innerHTML = text;
	}
}
//-->
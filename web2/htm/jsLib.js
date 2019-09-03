function OpenCloseDiv(id,triangleName)
{
  var objImg;
  objImg=eval('document.' + triangleName);
  var index_0=objImg.src.indexOf("_")+8;
  var Element_0=objImg.src.slice(index_0,index_0+1);     
  if (Element_0=="d")
  {
    objImg.src= "../image/triangle_header_up1.png";
    document.getElementById(id).style.display='none';
  }
  else
  {
    objImg.src= "../image/triangle_header_down1.png";
    document.getElementById(id).style.display='';

  } 	
}

function checkDigitRange(s, num, min, max)
{
  d = getDigit(s,num);
  if ( d > max || d < min )
      	return false;
  return true;
}

function isNumeric(str,min,max)
{  
      if (!isNaN(str) && str >= min && str <= max){
        return true
      }
      return false
}

function valid_IP(s)
{
   var point_count = 0;
   for (var i=0; i<s.length; i++) 
   {
     if ( (s.charAt(i) >= '0' && s.charAt(i) <= '9')) {
			continue;
     }         
     if ( (s.charAt(i) == '.' ) ) {
        point_count ++;
        if (point_count > 3) return 2;
        else
			continue;
  }
  return 1;
}
   return 0;
}

function getDigit(s, num)
{
  i=1;
  if ( num != 1 ) {
  	while (i!=num && s.length!=0) {
		if ( s.charAt(0) == '.' ) {
			i++;
		}
		s = s.substring(1);
  	}
  	if ( i!=num )
  		return -1;
  }
  for (i=0; i< s.length; i++) {
  	if ( s.charAt(i) == '.' ) {
		  s = s.substring(0, i);
		break;
	}
  }
  if ( s.length == 0)
  	return -1;
  d = parseInt(s, 10);
  return d;
}

function checkMask(s, num)
{
  d = getDigit(s,num);
  if( !(d==0 || d==128 || d==192 || d==224 || d==240 || d==248 || d==252 || d==254 || d==255 ))
  	return false;
  return true;
}

function checkSubnet(ip, mask, client)
{
  ip_d = getDigit(ip, 1);
  mask_d = getDigit(mask, 1);
  client_d = getDigit(client, 1);
  if ( (ip_d & mask_d) != (client_d & mask_d ) )
	return false;

  ip_d = getDigit(ip, 2);
  mask_d = getDigit(mask, 2);
  client_d = getDigit(client, 2);
  if ( (ip_d & mask_d) != (client_d & mask_d ) )
	return false;

  ip_d = getDigit(ip, 3);
  mask_d = getDigit(mask, 3);
  client_d = getDigit(client, 3);
  if ( (ip_d & mask_d) != (client_d & mask_d ) )
	return false;

  ip_d = getDigit(ip, 4);
  mask_d = getDigit(mask, 4);
  client_d = getDigit(client, 4);
  if ( (ip_d & mask_d) != (client_d & mask_d ) )
	return false;

  return true;
}

function checkIpAddr(field, msg)
{
   var chek_first = valid_IP(field.value);
   
   if (chek_first == 1) {
      alert(msg + ' value. It should be the decimal number (0-9)!');
      //field.value = field.defaultValue;
      field.focus();
      return false;
   }
   if (chek_first == 2) {
      alert(msg + ' value. It should be (xxx.xxx.xxx.xxx)!');
      //field.value = field.defaultValue;
      field.focus();
      return false;
   }

   if (checkDigitRange(field.value,1,0,0) &&  checkDigitRange(field.value,2,0,0) && checkDigitRange(field.value,3,0,0) && checkDigitRange(field.value,4,0,0)) {
      return(true);
   }
   if ( !checkDigitRange(field.value,1,0,255) ) {
      alert(msg+' range in the 1st number. It should be 0-255!');
      //field.value = field.defaultValue;
      field.focus();
      return false;
   }
   if ( !checkDigitRange(field.value,2,0,255) ) {
      alert(msg + ' range in the 2nd number. It should be 0-255!');
      //field.value = field.defaultValue;
      field.focus();
      return false;
   }
   if ( !checkDigitRange(field.value,3,0,255) ) {
      alert(msg + ' range in the 3rd number. It should be 0-255!');
      //field.value = field.defaultValue;
      field.focus();
      return false;
   }
   if ( !checkDigitRange(field.value,4,1,254) ) {
      alert(msg + ' range in the 4th number. It should be 1-254!');
      //field.value = field.defaultValue;
      field.focus();
      return false;
   }
   return true;
}

function createHttpRequest()
{
    var xmlHttp = false;
    /*@cc_on @*/
    /*@if (@_jscript_version >= 5)
      try {
      xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
      try {
      xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e2) {
      xmlHttp = false;
      }
      }
      @end @*/

    if (!xmlHttp && typeof XMLHttpRequest != 'undefined') {
        xmlHttp = new XMLHttpRequest();
    }
    return xmlHttp;
}

function commonAjax(url,data) {
    if(window.XMLHttpRequest){
        xmlhttp =new XMLHttpRequest() ;
        xmlhttp.withCredentials =true;
    }else{
        xmlhttp =new ActiveXObject('microsoft.XMLHTTP');
    }
    xmlhttp.open('post',url,true);
    xmlhttp.send(data)
}
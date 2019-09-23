var wrapper= document.getElementById('wrapper');
function loadXMLDoc(url,data) {
    var xmlhttp;
    if(window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
        //携带cookie
        xmlhttp.withCredentials=true;
    }else{
        xmlhttp = new ActiveXObject('microsoft.XMLHTTP')
    }
    xmlhttp.open('post',url,true);
    xmlhttp.send(data);

    xmlhttp.onreadystatechange=function () {
        if(xmlhttp.readyState==4&&xmlhttp.status==200){
            var data=JSON.parse(xmlhttp.responseText);
            if(data.status==404){
                var div =document.createElement('div');
                div.innerHTML = "用户名密码不匹配，请重新输入";
                div.className ='error';
                wrapper.appendChild(div);
            }else if(data.status==200){
                console.log(data);
                if(data.identity==0){
                    location.href='./学生欢迎界面.html'
                }else if(data.identity==1){
                    location.href='./老师欢迎界面.html'
                }
                }else if(data.status==300){
                    location.href ='./学生结束界面.html'
            }else if(data.status==339){
                location.href ='./学生成绩界面.html'
            }
        }
    }
}
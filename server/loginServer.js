var http =require('http');
var querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var mongoUrl ="mongodb://admin:123456@127.0.0.1:27017/admin";

/*搭建登录服务器*/
var server = http.createServer(function (req,res) {
    res.statusCode = 200;
   res.setHeader("Content-Type","application/json");
   res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:63342');
   /*允许跨域发送cookie*/
   res.setHeader('Access-Control-Allow-Credentials','true');
   var post ='';
   //{username:'admin'.pwd:132345}
   req.on('data',function (chunk) {
       post +=chunk
   });
   req.on('end',function () {
       post = querystring.parse(post);
       console.log(post);
       MongoClient.connect(mongoUrl,{useNewUrlParser: true,useUnifiedTopology:true},function (err,db) {
           console.log("数据库连接成功");
           if(err){return console.log(err)}
           var dbase =db.db('studentsystem');
           dbase.collection('userinfo').find({username:post.username}).toArray(function (err,results) {
               if(err) throw err;
               console.log(results.length);
               if(results.length == 1){
                  if(results[0].status&&!results[0].score){
                      res.end(JSON.stringify({status:300}))
                  }else if(results[0].score){
                      res.end(JSON.stringify({status:339}))
                  }
                  else{
                      dbase.collection('userinfo').find(post).toArray(function (err,result) {
                          if(err){
                              throw err;
                              res.end(JSON.stringify({status:500}))
                          }
                          if(result.length>=1){
                              var date = new Date();
                              date.setTime(date.getTime()+100*60*1000);
                              res.setHeader('Set-Cookie','data={"username":'+'"'+ post.username +'"'+',"identity":'+post.identity+'};expires='+date.toGMTString());
                              res.end(JSON.stringify({status:200,identity:post.identity}))
                          }else{
                              res.end(JSON.stringify({status:404}))
                          }
                      })
                  }
              }
           });
       })
   })
}).listen(3021);
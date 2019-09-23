var http =require('http');
var querystring =require('querystring');
var mongClient =  require('mongodb').MongoClient;
var mongoUrl ='mongodb://admin:123456@127.0.0.1:27017/admin';

var server =http.createServer(function (req,res) {
    res.statusCode=200;
    res.setHeader('Content-type','application/json');
    res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:63342');
    res.setHeader('Access-Control-Allow-Credentials','true');
    var post ='';
    req.on('data',function (chunk) {
        post +=chunk;
    });
    req.on('end',function () {
        post=querystring.parse(post);
        post.username = JSON.parse(post.username);
        mongClient.connect(mongoUrl,{useNewUrlParser: true,useUnifiedTopology:true},function (err,db) {
            if(err) throw err;
            var dbase=db.db('studentsystem');
            //将学生的成绩输入后台
            dbase.collection('scorelist').insertOne(post,function (err,sussess) {
                if(err) throw err;
                //将学生信息更新成绩，并实现跳转页面
                var whereStr={username:post.username};
                var term ={$set:{score:true}};
                dbase.collection('userinfo').updateOne(whereStr,term,function (err,suss) {
                    if(err) throw err;
                    console.log("sussess");
                });
                var data ={
                    insert :true
                };
                res.end(JSON.stringify(data))
            })
        })
    })
}).listen(3036);
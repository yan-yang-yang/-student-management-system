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
        post.answer=JSON.parse(post.answer);
        console.log(post.username);
        mongClient.connect(mongoUrl,{useNewUrlParser: true,useUnifiedTopology:true},function (err,db) {
            if(err) throw err;
            var dbase=db.db('studentsystem');
            dbase.collection('answerlist').insertOne(post,function (err,sussess) {
                if(err) throw err;
                var whereStr={username:post.username};
                var term ={$set:{status:true}};
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
}).listen(3033);
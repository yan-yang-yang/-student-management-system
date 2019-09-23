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
        mongClient.connect(mongoUrl,{useNewUrlParser: true,useUnifiedTopology:true},function (err,db) {
            if(err) throw err;
            var dbase=db.db('studentsystem');
           dbase.collection('userinfo').find({}).toArray(function (err,result) {
               if(err) throw err;
               result.forEach(function (val,index) {
                   if(val.identity ==1){
                       result.splice(index,1)
                   }
               });
               var data ={
                   info:JSON.stringify(result)
               };
               console.log(data);
               res.end(JSON.stringify(data));
           })
        })
    })
}).listen(3038);
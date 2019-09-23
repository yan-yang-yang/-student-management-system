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
            dbase.collection('answerlist').aggregate([{
                $unwind:{
                    path:'$answer'
                }
            }
            ,{
                $lookup:{
                    from:'questionlist',
                    localField:'answer.index',
                    foreignField:'_id',
                    as:'details'
                }
            },{
                $unwind: {
                    path:'$details'
                }
            }]).toArray(function (err,result) {
                if(err) throw err;
                console.log(result[1].username);
                res.end(JSON.stringify(result));
                console.log(result);
            })

        })
    })
}).listen(3039);
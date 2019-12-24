const http = require('http'),
fs = require('fs'),
urlModel = require('url'),
qs = require('querystring');
let sql = [
    {
        'id':1,
        'name':'哈哈',
        'age':10,
        'checked':false
    }
];
const app = http.createServer((req,res)=>{
    let originAry = [
        'http://localhost:81'
    ];
})
if(originAry.includes(req.headers.origin)){
    //跨域
    res.writeHead(200,{
        'Content-Type':'text/html;charset=utf-8','Access-Control-Allow-Origin':req.headers.origin
    });
};
const {pathname,query} = urlModel.parse(req.url);
let lastName = ['\.js$','\.html$','\.css$','\.less$','\.jpg$'];
 let re = new RegExp(lastName.join('|'));
 if(pathname === '/'){
     let data = fs.readFileSync('www/index.html');
     res.end(data.toString());
 }else if(re.test(pathname)){
     try {
         let data = fs.readFileSync('www'+pathname);
         res.end(data.toString);
     } catch (error) {
         let data = fs.readFileSync('www/404.html');
         res.end(data.toString());
     }
 }else{
     res.setHeader('Content-Type','text/html;charset=utf-8');
     switch(pathname){
         case '/up':
             let {id} = qs.parse(query);
             let upmsg = {
                 code:1,
                 msg:'上移成功'
             }
             if(sql[0].id == id){
                 upmsg.code = 0;
                 upmsg.msg = '已经到头';
             }else{
                 let index = sql.findIndex(item=>item.id == id);
                 let c = sql[index];
                 sql[index] = sql[index-1]
                 sql[index-1] = c;
                 upmsg.data = sql;
             }
             res.end(JSON.stringify(upmsg));
             break;
             case '/getdata':
                 res.end(JSON.stringify({code:1,ary:sql}));
                 break;
                 case '/add':
                     
                     let addobj = {
                         code:1,
                         msg:'添加成功',
                         response:sql
                     }
                     console.log(mathname)
                     let obj = qs.parse(query);
                     if(obj.name === 'undefined'){
                         addobj.code = 2;
                         addobj.msg = '参数错误';
                         res.statusCode = 400;
                     }else{
                         let user = sql.find(item=>item.name === obj.name);
                         if(!user){
                             sql.push({
                                 'id':Date.now(),
                                 'name':obj.name,
                                 'age':obj.age,
                                 'checked':false
                             });
                         }else{
                             addobj.code=0;
                             addobj.msg='此人已占用';
                         }
                     }
                     res.setHeader('Content-Type','text/html;charset=utf-8')
                     res.end(JSON.stringify(addobj));
                 break;
     }
 }
 let port = 80;

app.listen(port);

/*
    当服务器报错的时候触发
*/
app.on('error',(e)=>{
    console.log(e);
    //端口被占用的错误
    if(e.code === 'EADDRINUSE'){
        port ++;
        app.listen(port)
    }
})

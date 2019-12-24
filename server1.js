const http = require('http'),//模块化开发
jquery = require('jquery'),//node_modules里面
fs = require('fs'),
urlModel = require('url'),//能够把url分割为路径
qs = require('querystring');//能够url系列化操作
/*
    write:设置响应头
        第一个参数：状态码
        第二个参数：
        {
            配置响应信息
        }
        readdir 读取文件夹的

        fs.readdir(path,(error,filesAry)=>{

        })
        rename 重命名
    */

    const app = http.createServer((req,res)=>{
        console.log(req)
        let originAry = [
            'http://localhost:81'
        ];
        if(originAry.includes(req.headers.origin)){
            //跨域
            res.writeHead(200,{
                'Content-type':'text/html','Access-Control-Allow-Origin':req.headers.origin
            })
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
        res.end(data.toString());
    } catch (error) {
        let data = fs.readFileSync('www/404.html');
        res.end(data.toString())
    }
}else{
    switch(pathname){
        case '/add':
            const {mkdirname} = qs.parse(query);
            fs.mkdir('www/'+mkdirname+'/',(err)=>{
                if(err.code = 'EEXIST'){
                    //重名了
                    fs.readdir('www',(error,filesAry)=>{
                        //返回的是一个数组，数组中方的是当前文件夹下的所有文件名字
                        let num = 0;
                        let b = filesAry.includes(mkdirname);
                        let name = '';
                        while(b){
                            name = mkdirname.replace(/\(\d+\)/,'');
                            b = filesAry.includes(name + '(' + (++num) + ')');
                            name = name + '('+(num)+')'
                        };
                        fs.mkdir('www/'+name+'/',(err)=>{
                            console.log('第二次创建成功');
                            res.end(JSON.stringify({code:1,msg:'创建文件夹成功'}))
                        })
                    })
                }
                console.log(err);
                return
            })
            res.end(JSON.stringify({code:1,msg:'创建文件夹成功'}))
    }
}


    })
    app.listen(80);
const http = require('http');
const chalk = require('chalk');
const url = require('url');
const EventEmitter = require('events');

class Say extends EventEmitter{

    constructor(){
        super();
        // 存储 app.use 参数 fn
        this.middleware = [];

        this.env = 'development';
        this.proxy = '';
        this.subdomainOffset = '';
    }

    use(fn){
        this.middleware.push(fn);
        return this;
    }

    callback(){
        // 取出 middleware 中第一个 fn
        let fn = this.middleware.shift();
        const handleRequest = (req, res) => {
            const ctx = this.createContext(req, res);
            return this.handleRequest(ctx, fn);
        }
        return handleRequest;
    }

    handleRequest(ctx, fnMiddleware){
        if (!this.listenerCount('error')) this.on('error', this.onerror);
        fnMiddleware(ctx);
        handleResponse(ctx);
    }

    onerror(){
        console.log('onerror')
    }

    // 构建 ctx 对象
    createContext(req, res){
        let context = {};
        context.response = context.res = res;
        context.request = context.req = req;
        context.request.method = req.method;
        context.request.url = req.url;
        context.request.header = req.headers;
        context.response.status = res.statusCode;
        context.response.message = res.statusMessage;
        context.response.header = res.getHeaders();
        context.originUrl = req.url;
        context.query = url.parse(req.url, true).query;
        return context
    }

    listen(port, fn){
        // 监听指定端口号
        const server = http.createServer(this.callback());
        try {
            server.listen(port);
        } catch (error) {
            throw '服务启动失败';
        }
        fn();
    }
}

handleResponse = (ctx)=>{
    ctx.res.statusCode = 404;
    let { body, status } = ctx;

    // 考虑了 body 为 undefined 情况
    if(body == null){
        ctx.message = 'Not Fount';
        ctx.res.end(ctx.message);
        return;
    }
    if(status === 200){
        ctx.res.end(body)
    }
}

module.exports = Say;

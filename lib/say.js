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

    compose(middleware){
        if(!Array.isArray(middleware)) throw 'middleware 必须为数组';
        return function(context, next){
            let index = -1;
            return dispatch(0);
            function dispatch(i){
                index = i;
                let fn = middleware[i];
                if(i === middleware.length) fn = next;
                if(typeof fn !== 'function') return Promise.resolve();
                try {
                    return Promise.resolve(fn(context, dispatch.bind(null, index + 1)))
                } catch (error) {
                    return Promise.reject(fn(context));
                }
            }
        }
    }

    callback(){
        const fnMiddleware = this.compose(this.middleware);
        const handleRequest = (req, res) => {
            const ctx = this.createContext(req, res);
            return this.handleRequest(ctx, fnMiddleware);
        }
        return handleRequest;
    }

    handleRequest(ctx, fnMiddleware){
        ctx.res.statusCode = 404;
        if (!this.listenerCount('error')) this.on('error', this.onerror);
        fnMiddleware(ctx).then(()=>{

        handleResponse(ctx);
        })
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
    let { body } = ctx;

    // 考虑了 body 为 undefined 情况
    if(body == null){
        ctx.message = 'Not Fount';
        ctx.res.end(ctx.message);
        return;
    }
    ctx.res.end(body)
}

module.exports = Say;

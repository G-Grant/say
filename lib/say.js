const http = require('http');
const chalk = require('chalk');

class Say{

    constructor(){
        // 存储 app.use 参数 fn
        this.middleware = [];
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
        // 调用 fnMiddleware，把 ctx 传入，此方法不优雅
        // fnMiddleware.call(undefined, ctx)
        // koa 内部写法，因 fnMiddleware 是一个函数，且接收 ctx 参数，故直接调用传入 ctx
        fnMiddleware(ctx);
        handleResponse(ctx);
    }

    // 构建 ctx 对象
    createContext(req, res){
        let context = {};
        context.response = res;
        context.request = req;
        context.request.method = req.method;
        context.request.url = req.url;
        context.request.header = req.headers;
        context.response.status = res.statusCode;
        context.response.message = res.statusMessage;
        context.response.header = res.getHeaders();
        context.originUrl = req.url;

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
    let { body, originUrl } = ctx;
    let status = ctx.response.status;
    if(status === 200){
        ctx.response.end(body)
    }
}

module.exports = Say;

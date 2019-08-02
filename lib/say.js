const http = require('http');
const chalk = require('chalk');

class Say{

    constructor(){
        this.middleware = [];
    }

    use(fn){
        this.middleware.push(fn);
        return this;
    }

    callback(){
        let fn = this.middleware.shift();
        const handleRequest = (req, res) => {
            const ctx = this.createContext(req, res);
            return this.handleRequest(ctx, fn);
        }
        return handleRequest;
    }

    handleRequest(ctx, fnMiddleware){
        console.log(
            ctx
        )
    }

    createContext(req, res){
        let context = {};
        context.request = {
            method: req.method,
            url: req.url,
            header: req.headers
        }

        context.response = {
            status: res.statusCode,
            message: res.statusMessage,
            header: res.getHeaders()
        }
        context.originUrl = req.url;

        return context
    }

    listen(port, fn){
        const server = http.createServer(this.callback());
        try {
            server.listen(port);
        } catch (error) {
            throw '服务启动失败';
        }
        fn();
    }
}

module.exports = Say;

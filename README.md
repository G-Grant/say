# say

手写一个 koa

## 历程

- 监听端口号
- 处理客户端请求
    - 不好的做法

    ```js
    // 调用 fnMiddleware，把 ctx 传入，此方法不优雅
    handleRequest(ctx, fnMiddleware){
        fnMiddleware.call(undefined, ctx);
        handleResponse(ctx);
    }
    ```
    - 好的做法

    ```js
    // koa 内部写法，因 fnMiddleware 是一个函数，且接收 ctx 参数，故直接调用传入 ctx
    handleRequest(ctx, fnMiddleware){
        fnMiddleware(ctx);
        handleResponse(ctx);
    }
    ```

- 通过 url.parse 方法获取 query 对象

    ```js
    // 当 parseQueryString 为 true，则返回一个 query 对象，如为 false， 则 query 会是一个字符串。默认为 false。
    url.parse(urlString, parseQueryString)
    ```

## 疑惑

1. Node 不做错误事件监听？为什么要开启服务时判断是否有错误事件监听？

    ```js
    if (!this.listenerCount('error')) this.on('error', this.onerror);
    ```

2. 为什么要把 status 在相应之前设置为 404

    ```js
    handleRequest(ctx, fnMiddleware) {
        const res = ctx.res;
        res.statusCode = 404;
        ...
    }
    ```

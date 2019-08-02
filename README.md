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

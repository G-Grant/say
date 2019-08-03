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

3. koa 核心方法 compose

    - middleware 为数组，且数组每一项均为函数
    - compose 返回一个函数，这个函数会依次调用 middleware 中每一项（前提是调用 next 方法）

        ```js
        return function (context, next) {
            // last called middleware #
            let index = -1
            return dispatch(0)

            function dispatch(i) {
                if (i <= index) return Promise.reject(new Error('next() called multiple times'))
                index = i
                let fn = middleware[i]
                if (i === middleware.length) fn = next
                if (!fn) return Promise.resolve()
                try {
                    return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
                } catch (err) {
                    return Promise.reject(err)
                }
            }
        }
        ```


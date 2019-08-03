const Koa = require('koa');
const app = new Koa();
const chalk = require('chalk');
const port = 8989;

app.use(async (ctx, next)=>{
    console.log('开始执行 1')
    next();
    next();
})

app.use(async (ctx, next)=>{
    console.log('开始执行 2')
    next();
})

app.use(async (ctx, next)=>{
    console.log('开始执行 3')
    ctx.body = 'Hello, Koa';
})

app.listen(port, ()=>{
    console.log(chalk.magentaBright(`koa 服务已经监听${port}`));
});

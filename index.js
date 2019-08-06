const Say = require('./lib/say');
const app = new Say();
const port = 7878;
const chalk = require('chalk');

app.use(async (ctx, next)=>{
    console.log(1)
    await next();
    console.log(4)
})

app.use(async (ctx, next)=>{
    console.log(2)
    await next();
    console.log(5)
})

app.use(async (ctx, next)=>{
    console.log(3)
    await next();
    ctx.body = 'Hello, Say';
    console.log(6)
})

app.listen(port, ()=>{
    console.log(chalk.yellowBright(`say 服务已经监听${port}`))
});

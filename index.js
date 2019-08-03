const Say = require('./lib/say');
const app = new Say();
const port = 7878;
const chalk = require('chalk');

app.use(async (ctx, next)=>{
    console.log(1)
})

app.use(async (ctx, next)=>{
    console.log(2)
})

app.use(async (ctx)=>{
    console.log(3)
    ctx.body = 'Hello, Say';
})

app.listen(port, ()=>{
    console.log(chalk.yellowBright(`say 服务已经监听${port}`))
});

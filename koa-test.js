const Koa = require('koa');
const app = new Koa();
const chalk = require('chalk');
const port = 8989;

app.use((ctx)=>{
    ctx.body = 'Hello, Koa';
}).listen(port, ()=>{
    console.log(chalk.magentaBright(`koa 服务已经监听${port}`));
});

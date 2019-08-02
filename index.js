const Say = require('./lib/say');
const app = new Say();
const port = 7878;
const chalk = require('chalk');

app.use((ctx)=>{
    ctx.body = 'Hello, Koa';
}).listen(port, ()=>{
    console.log(chalk.yellowBright(`say 服务已经监听${port}`))
});

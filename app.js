// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');

const fs = require('fs')

// 创建一个Koa对象表示web app本身:
const app = new Koa();

const bodyParser = require('koa-bodyparser')

app.use(bodyParser())


const Router = require('koa-router')

let home = new Router()

// 子路由1
home.get('/', async (ctx) => {
    let html = `
    <h1>这里是主页</h1>
    <ul>
      <li><a href="/page/helloworld">/page/helloworld</a></li>
      <li><a href="/page/404">/page/404</a></li>
      <li><a href="/page/get?a=1&b=2">/page/get</a></li>
      <li><a href="/page/post">/page/post</a></li>
    </ul>
  `
    ctx.body = html
})

// 子路由2
let page = new Router()
page.get('/404', async (ctx) => {
    ctx.body = '404 page!'
}).get('/helloworld', async (ctx) => {
    ctx.body = 'helloworld page!'
}).get('/get', async (ctx) => {
    let url = ctx.url
    // 从上下文的request对象中获取
    let request = ctx.request
    let req_query = request.query
    let req_querystring = request.querystring

    // 从上下文中直接获取
    let ctx_query = ctx.query
    let ctx_querystring = ctx.querystring

    ctx.body = {
        url,
        req_query,
        req_querystring,
        ctx_query,
        ctx_querystring
    }
}).post('/post', async (ctx) => {
    ctx.body = 'post'
    // if (ctx.url === '/page/post' && ctx.method === 'GET') {
    //     // 当GET请求时候返回表单页面
    //     let html = `
    //       <h1>koa2 request post demo</h1>
    //       <form method="POST" action="/page/post">
    //         <p>userName</p>
    //         <input name="userName" /><br/>
    //         <p>nickName</p>
    //         <input name="nickName" /><br/>
    //         <p>email</p>
    //         <input name="email" /><br/>
    //         <button type="submit">submit</button>
    //       </form>
    //     `
    //     ctx.body = html
    // } else if (ctx.url === '/page/post' && ctx.method === 'POST') {
    //     // 当POST请求的时候，中间件koa-bodyparser解析POST表单里的数据，并显示出来
    //     let postData = ctx.request.body
    //     ctx.body = postData
    // } else {
    //     // 其他请求显示404
    //     ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
    // }
})

// 装载所有子路由
let router = new Router()
router.use('/', home.routes(), home.allowedMethods())
router.use('/page', page.routes(), page.allowedMethods())

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())



//监听3000端口
app.listen(3000);
console.log('app start at port http://localhost:3000/');
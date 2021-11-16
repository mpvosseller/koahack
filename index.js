const Koa = require("koa");
const Router = require("@koa/router");
const serverless = require('serverless-http');

// router
const router = new Router();
router.get("/", (ctx, next) => {
  ctx.body = "Hello World";
});
router.get("/err", (ctx, next) => {
  throw new Error("this is some error");
});

// app
const app = new Koa();
app.on("error", (err) => {
  console.log("handling koa app error event:", err);
});

app.use((ctx, next) => {
  console.log(`${ctx.method} ${ctx.url}`);
  return next();
});
app.use(router.routes());
app.use(router.allowedMethods());

module.exports.handler = serverless(app);

//console.log("starting server");
//app.listen(3000);

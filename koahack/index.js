const Koa = require("koa");
const Router = require("@koa/router");
const serverless = require("serverless-http");
const Bugsnag = require("@bugsnag/js");
const BugsnagPluginAwsLambda = require("@bugsnag/plugin-aws-lambda");

// bugsnag
const BUGSNAG_API_KEY = "SET_KEY_HERE";
Bugsnag.start({
  apiKey: BUGSNAG_API_KEY,
  plugins: [BugsnagPluginAwsLambda],
});
const bugsnagHandler = Bugsnag.getPlugin("awsLambda").createHandler();

// koa app
const app = new Koa();
app.on("error", (err) => {
  console.log("handling koa app error event:", err);
});

// koa middleware
app.use((ctx, next) => {
  console.log(`${ctx.method} ${ctx.url}`);
  return next();
});
const router = new Router();
router.get("/", (ctx, next) => {
  ctx.body = "hello koahack";
});
router.get("/err", (ctx, next) => {
  throw new Error("this is some error");
});
router.get("/force-err", (ctx, next) => {
  Bugsnag.notify(new Error("Test koahack error"));
  ctx.body = "force reported a test error";
});
app.use(router.routes());
app.use(router.allowedMethods());

// module.exports.handler = serverless(app);

module.exports.handler = bugsnagHandler(serverless(app));

// const handler = serverless(app);
// module.exports.handler = async (event, context) => {
//   console.log("entered lambda handler, calling serverless handler...")
//   const result = await handler(event, context);
//   console.log("returned from serverless handler, returning result:")
//   console.log(result)
//   return result;
// };

//console.log("starting local server..");
//app.listen(3000);

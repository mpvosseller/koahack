const Koa = require("koa");
const Router = require("@koa/router");
const serverless = require("serverless-http");
const Bugsnag = require("@bugsnag/js");
const BugsnagPluginAwsLambda = require("@bugsnag/plugin-aws-lambda");

// bugsnag
const BUGSNAG_API_KEY = ""; // SET BUGSNAG_API_KEY
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
router.get("/test-notify", (ctx, next) => {
  Bugsnag.notify(new Error("Test koahack error"));
  ctx.body = "manually reported a test error";
});
router.get("/runtime-error", (ctx, next) => {
  throw new Error("this is some error");
});

app.use(router.routes());
app.use(router.allowedMethods());

// serverless-http async integration (lets us see exactly what serverless-http returns)
// const handler = serverless(app);
// module.exports.handler = async (event, context) => {
//   console.log("entered lambda handler, calling serverless handler...")
//   const result = await handler(event, context);
//   console.log("returned from serverless handler, returning result:")
//   console.log(result)
//   return result;
// };

// serverless-http + bugsnag integration
module.exports.handler = bugsnagHandler(serverless(app));

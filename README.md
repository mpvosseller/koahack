## Overview
This sample application demonstrates how the [Bugnag integration instructions for "Koa on AWS Lambda"](https://docs.bugsnag.com/platforms/javascript/koa/aws-lambda/) do not appear to work. The Bugsnag instructions recommend the following:
```typescript
const serverless = require('serverless-http')
const app = require('./app')

const bugsnagHandler = Bugsnag.getPlugin('awsLambda').createHandler()

exports.handler = bugsnagHandler(serverless(app))
```

The problem with this is that the Koa / serverless app (`serverless(app)`) catches each exception and returns an object like this: 

```javascript
{
  statusCode: 500,
  headers: {
    'content-type': 'text/plain; charset=utf-8',
    'content-length': '21'
  },
  isBase64Encoded: false,
  body: 'Internal Server Error'
}
```

Because each exception is caught the `bugsnagHandler` wrapper will never see the error and never reports it.

It seems to me that the instructions for Koa on AWS Lambda need to be updated to explain how to install Bugsnag as Koa middleware and/or as a Koa event handler similar to the [plain Koa integration guide](https://docs.bugsnag.com/platforms/javascript/koa/).

## Setup
- Edit `koahack/index.js` and set your `BUGSNAG_API_KEY`

## Install Dependencies
- `cd ./infra`
- `npm install`
- `cd ../koahack`
- `npm install`

## Build and Deploy to AWS
- `cd ./koahack`
- `npm run deploy`

## Run:
- Verify the lambda is working:
  - `curl -i https://APIGATEWAY_ID.execute-api.us-east-1.amazonaws.com`
- Verify bugsnag integration by manually running `Bugsnag.notify`:
  - `curl -i https://APIGATEWAY_ID.execute-api.us-east-1.amazonaws.com/test-notify`
- Test a runtime exception:
  - `curl -i https://APIGATEWAY_ID.execute-api.us-east-1.amazonaws.com/runtime-error` 

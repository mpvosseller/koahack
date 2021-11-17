## Setup
- Edit koahack/index.js and set BUGSNAG_API_KEY

## Install Dependencies
- `cd ./infra`
- `npm install`
- `cd ../koahack`
- `npm install`

## Build and Deploy to AWS
- `cd ./koahack`
- `npm run deploy`

## Run:
- curl -i https://APIGATEWAY_ID.execute-api.us-east-1.amazonaws.com
- curl -i https://APIGATEWAY_ID.execute-api.us-east-1.amazonaws.com/err
- curl -i https://APIGATEWAY_ID.execute-api.us-east-1.amazonaws.com/force-err

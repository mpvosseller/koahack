import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigatewayv2'
import * as apigatewayIntegrations from '@aws-cdk/aws-apigatewayv2-integrations'
import { Duration } from '@aws-cdk/core';

export class KoaHackStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new lambda.Function(this, 'Function', {      
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('../koahack/build/dist.zip'),
      handler: 'index.handler',
      memorySize: 1024,    
      timeout: Duration.seconds(30),
      environment: {        
        NODE_ENV: 'development',       
      }
    })

    new apigateway.HttpApi(this, 'HttpApi', {
      apiName: 'koahack',
      defaultIntegration: new apigatewayIntegrations.LambdaProxyIntegration({
        handler: fn,
      }),
    })
  }
}

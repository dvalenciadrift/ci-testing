data "aws_iam_role" "lambda_exec_api" {
  name = "PSE-Lambda-Exec-API-Role-${var.atmos_env}"
}

data "aws_s3_bucket" "lambda_bucket" {
  bucket = "pse-lambda-code-${var.environment}"
}

#the above resources are managed here: https://github.com/Driftt/pse-aws-lambda-shared-resources

resource "aws_lambda_function" "lambda_function" {
  function_name = "pse-${var.app_name}-lambda-${var.environment}"

  s3_bucket = data.aws_s3_bucket.lambda_bucket.id
  s3_key    = "${var.app_name}.zip"

  runtime = "nodejs16.x"
  handler = "lambda.handler"
  timeout = 900

  tags = {
    Name = var.app_name,
    Team = "PSE"
  }

  environment {
    variables = {
      ENVIRONMENT = var.environment
    }
  }

  role = data.aws_iam_role.lambda_exec_api.arn
}

resource "aws_cloudwatch_log_group" "lambda_cloudwatch" {
  name = "/aws/lambda/${aws_lambda_function.lambda_function.function_name}"

  tags = {
    Name = var.app_name,
    Team = "PSE"
  }

  retention_in_days = 30
}

resource "aws_api_gateway_rest_api" "lambda_api_gateway" {
  name        = "pse-${var.app_name}-api-gateway-${var.environment}"
  description = "PSE ${var.app_name} custom integration API Gateway"

  tags = {
    Name = var.app_name,
    Team = "PSE"
  }

}

resource "aws_api_gateway_resource" "lambda_api_gateway_resource" {
  rest_api_id = aws_api_gateway_rest_api.lambda_api_gateway.id
  parent_id   = aws_api_gateway_rest_api.lambda_api_gateway.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "lambda_api_gateway_proxy" {
  rest_api_id   = aws_api_gateway_rest_api.lambda_api_gateway.id
  resource_id   = aws_api_gateway_resource.lambda_api_gateway_resource.id
  http_method   = "ANY"
  authorization = "NONE"
  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "lambda_api_gateway_integration" {
  rest_api_id             = aws_api_gateway_rest_api.lambda_api_gateway.id
  resource_id             = aws_api_gateway_resource.lambda_api_gateway_resource.id
  http_method             = aws_api_gateway_method.lambda_api_gateway_proxy.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda_function.invoke_arn

  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
}

resource "aws_api_gateway_deployment" "lambda_api_gateway_deployment" {
  depends_on = [aws_api_gateway_integration.lambda_api_gateway_integration]

  rest_api_id = aws_api_gateway_rest_api.lambda_api_gateway.id
  lifecycle {
    create_before_destroy = true
  }
  #value determined by prod.yml or qa.yml depending on the environment
  stage_name = var.environment
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  # source_arn = "arn:aws:execute-api:${var.myregion}:${var.accountId}:${aws_api_gateway_rest_api.api.id}/*/${aws_api_gateway_method.method.http_method}${aws_api_gateway_resource.resource.path}"
  # The /*/* part allows invocation from any stage, method and resource path
  # within API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.lambda_api_gateway.execution_arn}/*/*"
}


output "lambda_api_gateway_invoke_url" {
  value = aws_api_gateway_deployment.lambda_api_gateway_deployment.invoke_url
}

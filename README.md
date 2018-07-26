# MailChimp Lambda

A Lambda function for creating MailChimp subscriptions.

## Setting up

Set the environment variables in the `.env.sample` file as environment variables in your Lambda function.

Then generate a `.zip` file for your lambda function:

```
$ npm run zip
```

Add a API Gateway in the Lambda UI, and test like this:

```
$ curl -X POST -H "Content-Type: application/json" \
-d '{ "email": "name@email.com" }' \
YOUR_API_GATEWAY_URL
```

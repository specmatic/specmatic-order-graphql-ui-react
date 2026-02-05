![Diagram](./GraphQLStubbing.gif)

# Specmatic UI project for GraphQL demo

## Pre-requisites

- Node v20.x and above
- Docker Desktop

Install the node packages for this project.

```shell
npm install
```

## Running automated UI Component tests with Specmatic GraphQL Stub

```shell
npm test
```

## Bringing up the React application independently with Specmatic GraphQL Stub

### Start up the Specmatic stub

```shell
npm run specmatic:stub
```

### Testing the Specmatic stub

Use the following curl commands to test if the stub is working as expected -

1. Simple query
- On Unix terminals:<br/>
```shell
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { findAvailableProducts(type: gadget, pageSize: 10) { id name inventory type } }"
  }'
```

- On Windows Powershell:<br/>
```shell
curl -X POST http://localhost:8080/graphql `
  -H "Content-Type: application/json" `
  -d '{
    "query": "query { findAvailableProducts(type: gadget, pageSize: 10) { id name inventory type } }"
  }'
```

- On Windows Command Prompt:
```shell
curl -X POST http://localhost:8080/graphql ^
  -H "Content-Type: application/json" ^
  -d "{\"query\": \"query { findAvailableProducts(type: gadget, pageSize: 10) { id name inventory type } }\"}"
```

1. Query with variables
- On Unix terminals:<br/>
```shell
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query FindAvailableProducts($type: ProductType!, $pageSize: Int!) { findAvailableProducts(type: $type, pageSize: $pageSize) { id name inventory type } }",
    "variables": {
      "type": "gadget",
      "pageSize": 10
    }
  }'
```

- On Windows Powershell:<br/>
```shell
curl -X POST http://localhost:8080/graphql `
  -H "Content-Type: application/json" `
  -d '{
    "query": "query FindAvailableProducts($type: ProductType!, $pageSize: Int!) { findAvailableProducts(type: $type, pageSize: $pageSize) { id name inventory type } }",
    "variables": {
      "type": "gadget",
      "pageSize": 10
    }
  }'
```

- On Windows Command Prompt:<br/>
```shell
curl -X POST http://localhost:8080/graphql ^
  -H "Content-Type: application/json" ^
  -d "{\"query\": \"query FindAvailableProducts($type: ProductType!, $pageSize: Int!) { findAvailableProducts(type: $type, pageSize: $pageSize) { id name inventory type } }\", \"variables\": {\"type\": \"gadget\", \"pageSize\": 10}}"
```

### Start the application

```shell
npm start
```

This should automatically start the application and pull it up in your browser.

### Explore the GraphQl spec using GraphiQL

You can now open [GraphiQL](http://localhost:8080/_specmatic/graphiql) in your browser and test out some GraphQL queries.
This instance of GraphiQL is served by Specmatic Enterprise's mock instance running on http://localhost:8080

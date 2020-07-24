# OpenAPI Enforcer BigInt

This package enables a BigInt data type for your OpenAPI spec when using the [OpenAPI Enforcer NPM package](https://www.npmjs.com/package/openapi-enforcer).

## Installation

This module has a peer-dependency for the [OpenAPI Enforcer NPM package](https://www.npmjs.com/package/openapi-enforcer).

```sh
npm install openapi-enforcer openapi-enforcer-biginit
```

## Usage

Require this package before using the `bigint` format. Once the `openapi-enforcer-bigint` has been required then the `bigint` format will be registered.

```js
// register bigint format and require the OpenAPI Enforcer
require('openapi-enforcer-bigint')
const Enforcer = require('openapi-enforcer')

// define a schema for bigint
const [ schema ] = new Enforcer.v3_0.Schema({
    type: 'string',
    format: 'bigint'
})

// produces a random BigInt object
const [ big ] = schema.random()
console.log(big)

// converts to string
const [ string ] = schema.serialize(big)
console.log(string)

// converts to BigInt
const [ n ] = schema.deserialize(string)
console.log(n)

// not a valid BigInt
const err1 = schema.validate(1)
console.log(err1)

// valid
const err2 = schema.validate(1n)
console.log(err2)
```
require('../') // openapi-enforcer-bigint
const Enforcer = require('openapi-enforcer')

const [ schema ] = new Enforcer.v3_0.Schema({
    type: 'string',
    format: 'bigint'
})

const [ big ] = schema.random() // produces a random BigInt object
console.log(big)

const [ string ] = schema.serialize(big) // converts to string
console.log(string)

const [ n ] = schema.deserialize(string) // converts to BigInt
console.log(n)

const err1 = schema.validate(1)  // not a valid BigInt
console.log(err1)

const err2 = schema.validate(1n)  // valid
console.log(err2)


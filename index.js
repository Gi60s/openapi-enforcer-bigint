'use strict'
const Enforcer = require('openapi-enforcer')

/* global BigInt */

const bigIntConfig = {
  constructors: [BigInt],

  deserialize: ({ exception, value }) => {
    try {
      return BigInt(value)
    } catch (err) {
      exception.message(err.toString())
    }
  },

  // is numeric - allows schema maximum, minimum, exclusiveMaximum, etc.
  isNumeric: true,

  // generate a random value
  random: ({ schema }) => {
    const hasMaximum = schema.hasOwnProperty('maximum')
    const hasMinimum = schema.hasOwnProperty('minimum')
    if (!hasMaximum && !hasMinimum) {
      return BigInt(randomBigIntString() + randomBigIntString())
    } else {
      let max
      let min
      if (hasMaximum && !hasMinimum) {
        max = BigInt(schema.maximum)
        min = max - BigInt(Number.MAX_SAFE_INTEGER)
      } else if (!hasMaximum && hasMinimum) {
        min = BigInt(schema.minimum)
        max = min + BigInt(Number.MAX_SAFE_INTEGER)
      } else {
        max = BigInt(schema.maximum)
        min = BigInt(schema.minimum)
      }

      const diff = max - min
      let segmentCount
      let segmentSize
      if (diff > Number.MAX_SAFE_INTEGER) {
        segmentCount = 1n + (diff / BigInt(Number.MAX_SAFE_INTEGER))
        if (segmentCount > Number.MAX_SAFE_INTEGER) segmentCount = BigInt(Number.MAX_SAFE_INTEGER)
        segmentSize = diff / segmentCount
        if (segmentSize > Number.MAX_SAFE_INTEGER) segmentSize = BigInt(Number.MAX_SAFE_INTEGER)
      } else {
        segmentCount = 1n
        segmentSize = diff
      }

      const segmentIndex = BigInt(Math.ceil(Math.random() * Number(segmentCount)))
      return min + (BigInt(segmentIndex) * BigInt(Math.round(Math.random() * Number(segmentSize))))
    }
  },

  // define how to serialize a value
  serialize: ({ value }) => value.toString(),

  // define validation function for deserialized value
  validate: ({ exception, schema, value }) => {
    const hasMaximum = schema.hasOwnProperty('maximum')
    const hasMinimum = schema.hasOwnProperty('minimum')

    if (typeof value !== 'bigint') {
      exception.message('Expected a BigInt. Received: ' + typeof value)
    }

    if (hasMaximum) {
      const hasError = value > schema.maximum || (schema.exclusiveMaximum && value === schema.maximum)
      if (hasError) {
        const atOr = schema.exclusiveMaximum ? '' : 'at or '
        exception.message('Value must be ' + atOr + 'below the maximum of ' + schema.minimum + '. Received: ' + value)
      }
    }

    if (hasMinimum) {
      const hasError = value < schema.minimum || (schema.exclusiveMinimum && value === schema.minimum)
      if (hasError) {
        const atOr = schema.exclusiveMinimum ? '' : 'at or '
        exception.message('Value must be ' + atOr + 'above the minimum of ' + schema.minimum + '. Received: ' + value)
      }
    }
  }
}

Enforcer.v2_0.Schema.defineDataTypeFormat('string', 'bigint', bigIntConfig)
Enforcer.v3_0.Schema.defineDataTypeFormat('string', 'bigint', bigIntConfig)

function randomBigIntString(multiplier = Number.MAX_SAFE_INTEGER) {
  return String(Math.floor(Math.random() * multiplier))
}

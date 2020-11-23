const expect = require('chai').expect
const Enforcer = require('openapi-enforcer')
const path = require('path')

require('../index')

describe('bigint', () => {

  describe('deserialize', () => {
    const [ schema ] = Enforcer.v2_0.Schema({
      type: 'string',
      format: 'bigint'
    })

    it('can deserialize a small integer', () => {
      const [ n ] = schema.deserialize('1234')
      expect(n).to.equal(1234n)
    })

    it('can deserialize a big integer', () => {
      const [ n ] = schema.deserialize('12345678901234567890123456789012345678901234567890')
      expect(n).to.equal(12345678901234567890123456789012345678901234567890n)
    })

    it('cannot deserialize a decimal', () => {
      const [ , e ] = schema.deserialize('1234.5')
      expect(e).to.match(/Cannot convert/)
    })
  })

  describe('random', () => {
    it('can produce a random value', () => {
      const [ schema ] = Enforcer.v2_0.Schema({
        type: 'string',
        format: 'bigint'
      })
      const [ value ] = schema.random()
      expect(typeof value).to.equal('bigint')
    })

    it('can produce a random value within bounds', () => {
      const [ schema ] = Enforcer.v2_0.Schema({
        type: 'string',
        format: 'bigint',
        minimum: '0',
        maximum: '2'
      })
      for (let i = 0; i < 100; i++) {
        const [ value ] = schema.random()
        expect(value >= 0n && value <= 2n).to.be.true
      }
    })

    it('can produce a big random value within bounds', () => {
      const [ schema ] = Enforcer.v2_0.Schema({
        type: 'string',
        format: 'bigint',
        minimum: '-10000000000000000',
        maximum: '10000000000000000'
      })
      for (let i = 0; i < 100; i++) {
        const [ value ] = schema.random()
        expect(value >= -10000000000000000n && value <= 10000000000000000n).to.be.true
      }
    })
  })

  describe('serialize', function () {
    it('can serialize a small number', () => {
      const [ schema ] = Enforcer.v3_0.Schema({
        type: 'string',
        format: 'bigint'
      })
      const [ value ] = schema.serialize(1n)
      expect(value).to.equal('1')
    })

    it('can serialize a large number', () => {
      const [ schema ] = Enforcer.v3_0.Schema({
        type: 'string',
        format: 'bigint'
      })
      const [ value ] = schema.serialize(12345678901234567890123456789012345678901234567890n)
      expect(value).to.equal('12345678901234567890123456789012345678901234567890')
    })
  });

  describe('validate', () => {
    it('requires type to be a BigInt', () => {
      const [ schema ] = Enforcer.v3_0.Schema({
        type: 'string',
        format: 'bigint'
      })

      expect(schema.validate(1n)).to.equal(undefined)
      expect(schema.validate(1)).to.match(/Expected a BigInt/)
    })

    it('can validate value is at or above minimum', () => {
      const [ schema ] = Enforcer.v2_0.Schema({
        type: 'string',
        format: 'bigint',
        minimum: '1'
      })

      expect(schema.validate(1n)).to.equal(undefined)
      expect(schema.validate(0n)).to.match(/Value must be at or above the minimum/)
    })

    it('can validate value is above minimum', () => {
      const [ schema ] = Enforcer.v2_0.Schema({
        type: 'string',
        format: 'bigint',
        minimum: '0',
        exclusiveMinimum: true
      })

      expect(schema.validate(1n)).to.equal(undefined)
      console.log(schema.validate(0n).toString())
      expect(schema.validate(0n)).to.match(/Value must be above the minimum/)
    })
  })

  describe('OpenAPI doc', () => {
    it('can load OpenAPI doc', async () => {
      await Enforcer(path.resolve(__dirname, 'openapi.yml'))
    })
  })

})

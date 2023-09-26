import { RuleTester } from '../../vendor/rule-tester/src/RuleTester'
import rule, { type MessageIds, type Options, RULE_NAME } from './filename-naming-convention'

const valids = [
  {
    code: 'var foo = \'bar\';',
    filename: 'src/components/login.jsx',
    options: [{ '**/*.js': 'CAMEL_CASE', '**/*.jsx': 'CAMEL_CASE' }],
  },
  {
    code: 'var foo = \'bar\';',
    filename: 'src/login.jsx',
    options: [{ '**/*.js': 'CAMEL_CASE', '**/*.jsx': 'CAMEL_CASE' }],
  },
  {
    code: 'var foo = \'bar\';',
    filename: 'login.jsx',
    options: [{ '**/*.js': 'CAMEL_CASE', '**/*.jsx': 'CAMEL_CASE' }],
  },
  {
    code: 'var foo = \'bar\';',
    filename: 'src/utils/calculatePrice.js',
    options: [{ '**/*.js': 'CAMEL_CASE', '**/*.jsx': 'CAMEL_CASE' }],
  },
  {
    code: 'var foo = \'bar\';',
    filename: 'src/calculatePrice.js',
    options: [{ '**/*.js': 'CAMEL_CASE', '**/*.jsx': 'CAMEL_CASE' }],
  },
  {
    code: 'var foo = \'bar\';',
    filename: 'calculatePrice.js',
    options: [{ '**/*.js': 'CAMEL_CASE', '**/*.jsx': 'CAMEL_CASE' }],
  },
  {
    code: 'var foo = \'bar\';',
    filename: 'src/classes/g2tClass.js',
    options: [{ '**/*.js': 'CAMEL_CASE', '**/*.jsx': 'CAMEL_CASE' }],
  },
] as const

const invalids = [
  {
    code: 'var foo = \'bar\';',
    filename: 'src/utils/CalculatePrice.js',
    options: [{ '**/*.js': 'CAMEL_CASE', '**/*.jsx': 'CAMEL_CASE' }],
    errors: [
      {
        message:
          'The filename "CalculatePrice.js" does not match the "CAMEL_CASE" pattern',
        column: 1,
        line: 1,
      },
    ],
  },
  {
    code: 'var foo = \'bar\';',
    filename: 'src/utils/calculate_price.js',
    options: [{ '**/*.js': 'CAMEL_CASE', '**/*.jsx': 'CAMEL_CASE' }],
    errors: [
      {
        message:
          'The filename "calculate_price.js" does not match the "CAMEL_CASE" pattern',
        column: 1,
        line: 1,
      },
    ],
  },
  {
    code: 'var foo = \'bar\';',
    filename: 'src/utils/calculate-price.js',
    options: [{ '**/*.js': 'CAMEL_CASE', '**/*.jsx': 'CAMEL_CASE' }],
    errors: [
      {
        message:
          'The filename "calculate-price.js" does not match the "CAMEL_CASE" pattern',
        column: 1,
        line: 1,
      },
    ],
  },
  {
    code: 'var foo = \'bar\';',
    filename: 'src/utils/CALCULATE_PRICE.js',
    options: [{ '**/*.js': 'CAMEL_CASE', '**/*.jsx': 'CAMEL_CASE' }],
    errors: [
      {
        message:
          'The filename "CALCULATE_PRICE.js" does not match the "CAMEL_CASE" pattern',
        column: 1,
        line: 1,
      },
    ],
  },
  {
    code: 'var foo = \'bar\';',
    filename: 'src/classes/2gtClass.js',
    options: [{ '**/*.js': 'CAMEL_CASE', '**/*.jsx': 'CAMEL_CASE' }],
    errors: [
      {
        message:
          'The filename "2gtClass.js" does not match the "CAMEL_CASE" pattern',
        column: 1,
        line: 1,
      },
    ],
  },
] as const

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
})

ruleTester.run<MessageIds, Options>(RULE_NAME, rule as any, {
  valid: valids,
  // @ts-expect-error message way instead of messageId
  invalid: invalids,
})

import { RuleTester } from '../../vendor/rule-tester/src/RuleTester'
import rule, { type MessageIds, type Options, RULE_NAME } from './folder-naming-convention'

type UnitCase = {
  code: string;
  filename: string;
  options: Options
  errors?: {
    message: string,
    column: number,
    line: number,
  }[],
}

const valids: UnitCase[] = [
  {
    code: 'var foo = \'bar\';',
    filename: 'src/components/DisplayLabel/__tests__/displayLabel.test.js',
    options: [{ '*/__tests__/': 'PASCAL_CASE', 'src/*/': 'CAMEL_CASE' }],
  },
  {
    code: 'var foo = \'bar\';',
    filename: 'src/components/DisplayLabel/__tests__/displayLabel.test.js',
    options: [{ '*/__tests__/': 'PASCAL_CASE', 'src/*/': ['CAMEL_CASE', 'PASCAL_CASE'] }],
  },
  {
    code: 'var foo = \'bar\';',
    filename: 'src/Components/DisplayLabel/__tests__/displayLabel.test.js',
    options: [{ '*/__tests__/': 'PASCAL_CASE', 'src/*/': ['CAMEL_CASE', 'PASCAL_CASE'] }],
  },
]

const invalids: UnitCase[] = [
  {
    code: 'var foo = \'bar\';',
    filename: 'src/Components/DisplayLabel/__tests__/displayLabel.test.js',
    options: [{ '*/__tests__/': 'PASCAL_CASE', 'src/*/': 'CAMEL_CASE' }],
    errors: [
      {
        message:
          'The folder "Components" does not match the "CAMEL_CASE" pattern',
        column: 1,
        line: 1,
      },
    ],
  },
  {
    code: 'var foo = \'bar\';',
    filename: 'src/components/displayLabel/__tests__/displayLabel.test.js',
    options: [{ '*/__tests__/': 'PASCAL_CASE', 'src/*/': 'CAMEL_CASE' }],
    errors: [
      {
        message:
          'The folder "displayLabel" does not match the "PASCAL_CASE" pattern',
        column: 1,
        line: 1,
      },
    ],
  },
]

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
})

ruleTester.run<MessageIds, Options>(RULE_NAME, rule as any, {
  valid: valids,
  // @ts-expect-error message way instead of messageId
  invalid: invalids,
})

import { RuleTester } from '../../vendor/rule-tester/src/RuleTester'
import rule, { type MessageIds, type Options, RULE_NAME } from './folder-match-with-fex'

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
    filename: '/__tests__/foo.test.js',
    options: [{ '*.js': '**/__tests__/' }],
  },
  {
    code: 'var foo = \'bar\';',
    filename: '__tests__/foo.test.js',
    options: [{ '*.js': '**/__tests__/' }],
  },
  {
    code: 'var foo = \'bar\';',
    filename: 'bar/__tests__/foo.test.js',
    options: [{ '*.js': '**/__tests__/' }],
  },
  {
    code: 'var foo = \'bar\';',
    filename: '/bar/__tests__/foo.test.js',
    options: [{ '*.js': '**/__tests__/' }],
  },
]

const invalids: UnitCase[] = [
  {
    code: 'var foo = \'bar\';',
    filename: '/bar/__test__/foo.test.js',
    options: [{ '*.js': '**/__tests__/' }],
    errors: [
      {
        message:
          'The folder of the file "/bar/__test__/foo.test.js" does not match the "**/__tests__/" pattern',
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

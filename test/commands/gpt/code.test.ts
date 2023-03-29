import {expect, test} from '@oclif/test'

const codeInput = 'write hello world'
const codeOutput = 'print("Hello'

describe('Code', () => {
  test
    .stdout()
    .command(['gpt:code', codeInput, '-l', 'python'])
    .it('runs code completion command', ctx => {
      expect(ctx.stdout).to.contain(codeOutput)
    })

  test
    .stdout()
    .command(['gpt:code', codeInput, '-l', 'python', '--verbose'])
    .it('runs code completion command with verbose flag', ctx => {
      expect(ctx.stdout).to.contain(codeOutput)
    })

  test
    .stdout()
    .command(['gpt:code', codeInput, '-k', 'BAD_KEY'])
    .it('runs code completion command with bad API key', ctx => {
      expect(ctx.stdout).to.contain('401')
    })

  test
    .stdout()
    .command(['gpt:code', 'Give me an empty code block encapsulated by backticks', '-l', 'md'])
    .exit(51)
    .it('runs code completion command with intentional empty response and answer in under 10 words')

  test
    .stdout()
    .command(['gpt:code', codeInput, '-l', 'python', '--noStop'])
    .it('runs code completion command with noStop flag', ctx => {
      expect(ctx.stdout).to.contain(codeOutput)
    })
})

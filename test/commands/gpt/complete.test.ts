import {expect, test} from '@oclif/test'

const completionInput = 'Provide median housing price in Santa Monica in the past 5 years.'
const completionOutput = 'median'
const completionOutput2 = 'Santa Monica'
const completionOutput3 = '5 years'

describe('Complete', () => {
  test
    .stdout()
    .command(['gpt:complete', completionInput])
    .it('runs text completion command', ctx => {
      expect(ctx.stdout).to.contain(completionOutput)
      expect(ctx.stdout).to.contain(completionOutput2)
      expect(ctx.stdout).to.contain(completionOutput3)
    })

  test
    .stdout()
    .command(['gpt:complete', completionInput, '--verbose'])
    .it('runs text completion command with verbose flag', ctx => {
      expect(ctx.stdout).to.contain(completionOutput)
      expect(ctx.stdout).to.contain(completionOutput2)
      expect(ctx.stdout).to.contain(completionOutput3)
    })
})

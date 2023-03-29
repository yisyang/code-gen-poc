import {expect, test} from '@oclif/test'

const chatInput = 'What is the capital of France?'
const chatOutput = 'Paris'
const chatOutputChinese = '巴黎'

describe('Chat', () => {
  test
    .stdout()
    .command(['gpt:chat', chatInput])
    .it('runs chat completion command', ctx => {
      expect(ctx.stdout).to.contain(chatOutput)
    })

  test
    .stdout()
    .command(['gpt:chat', chatInput, '--verbose'])
    .it('runs chat completion command with verbose flag', ctx => {
      expect(ctx.stdout).to.contain(chatOutput)
    })

  test
    .stdout()
    .command(['gpt:chat', chatInput, '--mode', 'chinese'])
    .it('runs chat completion command with mode flag', ctx => {
      expect(ctx.stdout).to.contain(chatOutputChinese)
    })
})

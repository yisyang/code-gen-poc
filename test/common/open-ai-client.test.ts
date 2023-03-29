import {expect, test} from '@oclif/test'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import OpenAiClient from '../../src/common/clients/open-ai-client'

before(async () => {
  chai.use(chaiAsPromised)
})

describe('OpenAiClient', () => {
  const openAiClient = new OpenAiClient()

  test.it('creates chat completion', async () => {
    const prompt = 'What is the capital of France?'
    const result = await openAiClient.chat(prompt)
    expect(result.data).to.have.property('id')
    expect(result.data).to.have.property('object', 'chat.completion')
    expect(result.data.choices?.[0]?.message?.content ?? false).to.contain('Paris')
  })

  test.it('throws an error for code method', async () => {
    await expect(openAiClient.code()).to.be.rejectedWith('Not ready')
  })

  test.it('creates code by chat completion', async () => {
    const prompt = 'Generate a simple Python function that adds two numbers.'
    const language = 'Python'
    const result = await openAiClient.codeByChat(prompt, language, false, 512)
    expect(result.data).to.have.property('id')
    expect(result.data).to.have.property('object', 'chat.completion')
    expect(result.data.choices?.[0]?.message?.content ?? false).to.be.a('string')
  })

  test.it('creates text completion', async () => {
    const prompt = 'What is the capital of France?'
    const result = await openAiClient.complete(prompt, 128)
    expect(result.data).to.have.property('id')
    expect(result.data).to.have.property('object', 'text_completion')
    expect(result.data.choices[0].text).to.be.a('string')
  })

  test.it('creates image completion', async () => {
    const prompt = 'Draw a simple house with a tree.'
    const result = await openAiClient.image(prompt)
    expect(result.data).to.have.property('created')
    expect(result.data.data[0].url).to.be.a('string')
  })
})

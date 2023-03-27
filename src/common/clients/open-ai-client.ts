import {ChatCompletionRequestMessage, Configuration, ConfigurationParameters, OpenAIApi} from 'openai'

export default class OpenAiClient {
  private openai: OpenAIApi

  constructor(config?: ConfigurationParameters) {
    config = config || {}
    if (config.apiKey == undefined) {
      config.apiKey = process.env.OPENAI_API_KEY
    }
    this.openai = new OpenAIApi(new Configuration(config))
  }

  async chat(prompt: string, prevMessages?: Array<ChatCompletionRequestMessage>, nextMessages?: Array<ChatCompletionRequestMessage>) {
    return this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        ...prevMessages ?? [],
        {"role": "user", "content": prompt},
        ...nextMessages ?? []
      ],
      temperature: 0.7,
      max_tokens: 3800,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })
  }

  async code() {
    throw new Error("Not ready")
    // return this.openai.createCompletion({
    //     model: "code-cushman-001",
    // });
  }

  async codeByChat(prompt: string, language: string, noStop: boolean) {
    const stop = noStop ? undefined : [
      '``` ',
      '```\\n',
    ]

    return this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You should answer user requests for code generation in ${language}.`},
        { role: "system", content: 'You should include meaningful code comments in the code itself.'},
        { role: "system", content: `You should begin your code with \`\`\`${language}`},
        { role: "user",  content: prompt},
        { role: "assistant", content: `Sure, here is your code in ${language}:\\n`},
      ],
      temperature: 0.7,
      max_tokens: 3800,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: stop
    })
  }

  async complete(prompt: string) {
    return this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 3800,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
  }
}

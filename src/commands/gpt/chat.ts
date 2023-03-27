import { Args, Command, Flags } from '@oclif/core'
import OpenAiClient from '../../common/clients/open-ai-client'
import {ChatCompletionRequestMessage} from 'openai'

export default class Chat extends Command {
  static description = 'Complete chat text'

  static examples = [
    `yarn dev <%= command.id %>
gpt chat Say hello world (./src/commands/gpt/chat.ts)
`,
  ]

  static flags = {
    verbose: Flags.boolean({char: 'v', description: 'Turn on verbose output'}),
    mode: Flags.string({char: 'm', description: 'Mode for selecting pre-defined prompts', default: 'english'}),
  }

  static args = {
    input: Args.string({description: 'Input text to run chat completion on', required: true}),
  }

  async run(): Promise<void> {
    const oac = new OpenAiClient()
    const { args, flags } = await this.parse(Chat)

    // Set prompt based on language
    let prevPrompts:Array<ChatCompletionRequestMessage> = []
    let nextPrompts:Array<ChatCompletionRequestMessage> = []
    if (flags.mode !== 'english') {
      prevPrompts = [
        { role: "system", content: `You will answer user requests for code generation in ${flags.language}.`},
        { role: "system", content: `You will include meaningful code comments in English in the code itself.`},
      ]
      nextPrompts = [
        { role: "assistant", content: `Sure, here is your code in ${flags.language}:`},
      ]
    }

    this.log(`Input: ${args.input}`)
    let res
    try {
      res = await oac.chat(args.input, prevPrompts, nextPrompts)
    } catch (e) {
      console.log(e)
      return
    }

    this.log('Res:')
    if (flags.verbose) {
      console.log(res.data)
      for (let choice of res.data.choices) {
        console.log(choice.message)
      }
    }
    if (res.data.choices[0].message) {
      this.log(res.data.choices[0].message.content)
    }
  }
}

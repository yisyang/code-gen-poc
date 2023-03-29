import { Args, Command, Flags } from '@oclif/core'
import { ChatCompletionRequestMessage } from 'openai'
import OpenAiClient from '../../common/clients/open-ai-client'
import FileLogger from '../../common/clients/file-logger'

export default class Chat extends Command {
  static description = 'Complete chat text'

  static examples = [
    `yarn start <%= command.id %> "Mirror, mirror..."
(./src/commands/gpt/chat.ts)
`,
  ]

  static flags = {
    key: Flags.string({char: 'k', description: 'OpenAI key, if not in OPENAI_API_KEY.'}),
    mode: Flags.string({char: 'm', description: 'Mode for selecting pre-defined prompts', default: 'english'}),
    verbose: Flags.boolean({char: 'v', description: 'Turn on verbose output'}),
  }

  static args = {
    input: Args.string({description: 'Input text to run chat completion on', required: true}),
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Chat)
    const oac = new OpenAiClient({ apiKey: flags.key })
    const logger = new FileLogger()

    // Set prompt based on language
    let prevPrompts:Array<ChatCompletionRequestMessage> = []
    let nextPrompts:Array<ChatCompletionRequestMessage> = []
    if (flags.mode === 'chinese') {
      prevPrompts = [
        { role: "system", content: `You will answer user requests in Chinese language, using Chinese Simplified characters (zh-CN).`},
      ]
    } else if (flags.mode === 'list') {
      prevPrompts = [
        { role: "system", content: `You will answer user requests by returning a list each time.`},
      ]
    }

    if (flags.verbose) {
      logger.debug(`Input: ${args.input}`)
    }

    let res
    try {
      res = await oac.chat(args.input, prevPrompts, nextPrompts)
    } catch (e: unknown) {
      logger.error({
        input: args.input,
        mode: flags.mode
      }, e)
      return
    }

    if (flags.verbose) {
      logger.debug('Res:')
      logger.debug(res.data)
      for (let choice of res.data.choices) {
        logger.debug(choice.message)
      }
    }
    const content = res.data.choices?.[0]?.message?.content ?? ''
    this.log(content)

    // Log session
    logger.info({
      type: 'CHAT',
      input: args.input,
      mode: flags.mode,
      text: content
    })
  }
}

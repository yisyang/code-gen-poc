import { Args, Command, Flags } from '@oclif/core'
import OpenAiClient from '../../common/clients/open-ai-client'
import FileLogger from '../../common/clients/file-logger'

export default class Complete extends Command {
  static description = 'Complete text'

  static examples = [
    `yarn start <%= command.id %> "Provide median housing price in Santa Monica in the past 5 years."
(./src/commands/gpt/complete.ts)
`,
  ]

  static flags = {
    key: Flags.string({char: 'k', description: 'OpenAI key, if not in OPENAI_API_KEY.'}),
    verbose: Flags.boolean({char: 'v', description: 'Turn on verbose output'}),
  }

  static args = {
    input: Args.string({description: 'Input text to run completion on', required: true}),
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Complete)
    const oac = new OpenAiClient({ apiKey: flags.key })
    const logger = new FileLogger()

    if (flags.verbose) {
      logger.debug(`Input: ${args.input}`)
    }

    let res
    try {
      res = await oac.complete(args.input)
    } catch (e: unknown) {
      logger.error({
        input: args.input
      }, e)
      return
    }

    if (flags.verbose) {
      logger.debug('Res:')
      logger.debug(res.data)
    }

    const text = res.data.choices?.[0]?.text ?? ''
    this.log(text)

    // Log session
    logger.info({
      type: 'COMPLETE',
      input: args.input,
      text: text
    })
  }
}

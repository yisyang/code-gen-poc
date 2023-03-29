import { Args, Command, Flags } from '@oclif/core'
import OpenAiClient from '../../common/clients/open-ai-client'
import FileLogger from '../../common/clients/file-logger'

export default class Complete extends Command {
  static description = 'Generate image'

  static examples = [
    `yarn start <%= command.id %> "a cute puppy"
(./src/commands/image/index.ts)
`,
  ]

  static flags = {
    key: Flags.string({char: 'k', description: 'OpenAI key, if not in OPENAI_API_KEY.'}),
    verbose: Flags.boolean({char: 'v', description: 'Turn on verbose output'}),
  }

  static args = {
    input: Args.string({description: 'Input text to generate image on', required: true}),
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
      res = await oac.image(args.input)
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

    const url = res.data?.data?.[0]?.url ?? ''
    this.log(url)

    // Log session
    logger.info({
      type: 'IMAGE',
      input: args.input,
      url: url
    })
  }
}

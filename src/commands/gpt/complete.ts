import { Args, Command, Flags } from '@oclif/core'
import OpenAiClient from '../../common/clients/open-ai-client'

export default class Complete extends Command {
  static description = 'Complete text'

  static examples = [
    `yarn dev <%= command.id %>
gpt complete Say hello world (./src/commands/gpt/complete.ts)
`,
  ]

  static flags = {
    verbose: Flags.boolean({char: 'v', description: 'Turn on verbose output'}),
  }

  static args = {
    input: Args.string({description: 'Input text to run completion on', required: true}),
  }

  async run(): Promise<void> {
    const oac = new OpenAiClient()
    const { args, flags } = await this.parse(Complete)

    this.log(`Input: ${args.input}`)
    let res
    try {
      res = await oac.complete(args.input)
    } catch (e) {
      console.log(e)
      return
    }

    this.log('Res:')
    if (flags.verbose) {
      console.log(res.data)
    }
    if (res.data.choices[0].text) {
      this.log(res.data.choices[0].text)
    }
  }
}

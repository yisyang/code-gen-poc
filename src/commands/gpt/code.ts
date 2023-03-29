import { Args, Command, Flags } from '@oclif/core'
import OpenAiClient from '../../common/clients/open-ai-client'
import FileLogger from '../../common/clients/file-logger'

export default class Code extends Command {
  static description = 'Complete chat text and return code'

  static examples = [
    `yarn start <%= command.id %> "write hello world" -l python
(./src/commands/gpt/code.ts)
`,
  ]

  static flags = {
    key: Flags.string({char: 'k', description: 'OpenAI key, if not in OPENAI_API_KEY.'}),
    language: Flags.string({char: 'l', description: 'Programming language to use', default: 'python'}),
    noStop: Flags.boolean({char: 'n', description: 'Turn off stop word on ```, useful when gpt returns instructions with separate code blocks.'}),
    verbose: Flags.boolean({char: 'v', description: 'Turn on verbose output'}),
  }

  static args = {
    input: Args.string({description: 'Input text to run chat completion on', required: true}),
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Code)
    const oac = new OpenAiClient({ apiKey: flags.key })
    const logger = new FileLogger()

    if (flags.verbose) {
      logger.debug(`Input: ${args.input}`)
    }

    let res
    try {
      res = await oac.codeByChat(args.input, flags.language, flags.noStop)
    } catch (e: unknown) {
      logger.error({
        input: args.input,
        lang: flags.language
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

    // Extracted code in requested language
    let code = res.data.choices[0].message?.content ?? ''

    // Strip initial `s
    if (code.length > 3 && code.substring(0, 3) === '```') {
      code = code.replace(/^```[a-z]*\s*/gm, '')

      // Check if there's `s on the other side
      const index = code.indexOf('```')
      if (index !== -1) {
        code = code.substring(0, index)
      }
    }

    // Nothing is here
    if (code.length === 0) {
      if (res.data.choices[0].message?.content?.length ?? 0 < 20) {
        // Bad answer
        logger.error({
          input: args.input,
          lang: flags.language,
          error: "Empty answer"
        })
        this.error("Empty answer", {exit: 51})
        throw new Error("Something is wrong, and we might have gotten an empty answer?")
      } else {
        // Stop word error
        logger.error({
          input: args.input,
          lang: flags.language,
          error: "Stop word error"
        })
        this.error("Stop word error", {exit: 52})
        throw new Error("Stop word error, answer still contained ``` to start.")
      }
    }

    this.log(code)

    // Log session
    logger.info({
      type: 'CODE',
      input: args.input,
      lang: flags.language,
      code: code
    })
  }
}

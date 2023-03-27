import { Args, Command, Flags } from '@oclif/core'
import OpenAiClient from '../../common/clients/open-ai-client'
import {FileLogger} from '../../common/clients/file-logger'
import axios from 'axios'

export default class Code extends Command {
  static description = 'Complete chat text'

  static examples = [
    `yarn dev <%= command.id %>
gpt chat Say hello world (./src/commands/gpt/chat.ts)
`,
  ]

  static flags = {
    language: Flags.string({char: 'l', description: 'Programming language to use', default: 'python'}),
    noStop: Flags.boolean({char: 'n', description: 'Turn off stop word on ```, useful when gpt returns instructions with separate code blocks.'}),
    verbose: Flags.boolean({char: 'v', description: 'Turn on verbose output'}),
  }

  static args = {
    input: Args.string({description: 'Input text to run chat completion on', required: true}),
  }

  async run(): Promise<void> {
    const oac = new OpenAiClient()
    const accessLogger = new FileLogger('logs/access.log')
    const errorLogger = new FileLogger('logs/error.log')
    const { args, flags } = await this.parse(Code)

    this.log(`Input: ${args.input}`)
    let res
    try {
      res = await oac.codeByChat(args.input, flags.language, flags.noStop)
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e.response) {
          console.log(e.response.status)
          console.log(e.response.data.error)
          errorLogger.log({
            input: args.input,
            lang: flags.language,
            status: e.response.status,
            error: e.response.data.error
          })
        }
      } else {
        console.log(e)
      }
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
      // Extracted code in requested language
      let code = res.data.choices[0].message.content;

      // Strip initial `s
      if (code.substring(0, 3) === '```') {
        code = code.replace(/^```[a-z]*\s*/gm, '')

        // Check if there's `s on the other side
        const index = code.indexOf('```')
        if (index !== -1) {
          code = code.substring(0, index)
        }
      }

      // Nothing is here
      if (code.length === 0) {
        if (res.data.choices[0].message.content.length < 20) {
          // Bad answer
          errorLogger.log({
            input: args.input,
            lang: flags.language,
            error: "Empty answer"
          })
          throw new Error("Something is wrong, and we might have gotten an empty answer?")
        } else {
          // Stop word error
          errorLogger.log({
            input: args.input,
            lang: flags.language,
            error: "Stop word error"
          })
          throw new Error("Stop word error, answer still contained ``` to start.")
        }
      }

      this.log(code)

      // Log session
      accessLogger.log({
        input: args.input,
        lang: flags.language,
        resp: code
      })
    }
  }
}

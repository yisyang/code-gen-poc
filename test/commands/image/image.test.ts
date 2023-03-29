import {expect, test} from '@oclif/test'

const imageInput = 'a cute puppy'
const imageUrlPattern = new RegExp(/https:\/\/.*\.(?:jpg|png).*/)

describe('Image', () => {
  test
    .stdout()
    .command(['image', imageInput])
    .it('runs image generation command', ctx => {
      expect(ctx.stdout).to.match(imageUrlPattern)
    })

  test
    .stdout()
    .command(['image', imageInput, '--verbose'])
    .it('runs image generation command with verbose flag', ctx => {
      expect(ctx.stdout).to.match(imageUrlPattern)
    })
})

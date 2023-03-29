code-gen-poc
=================

Framework: OCLIF https://github.com/oclif/oclif

# Getting Started

## Quickstart

Installation

```bash
nvm use
corepack enable
yarn install
```

Running (Dev)

```bash
export OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>

yarn start gpt chat "Can you think of some fun logic games that can use GPT for content generation?"

yarn start gpt chat "What would be a good analogy in the steps of writing code to the steps of painting: sketch, lines, flats, colors, shadows, highlights? Consider folder structure, tests, interfaces, etc."

yarn start gpt code -l bash "I'd like to start a new NestJS project using best practices, please provide commands to get me started."

yarn start gpt code -l typescript 'Hello world as OOP'

yarn start image 'A cute puppy'
```

Building & Running (Prod)

```bash
yarn build
yarn start:prod gpt code -l typescript 'Hello world as OOP'
```

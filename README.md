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

yarn start gpt code "I'd like to start a new NestJS project with best practices, please provide commands to get me started." -l bash

yarn start gpt chat "I'd like to create an"

yarn start gpt code -l typescript 'Hello world as OOP'
```

Building & Running (Prod)

```bash
yarn build
yarn start:prod gpt code -l typescript 'Hello world as OOP'
```

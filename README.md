-gen-poc
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

yarn start gpt code -l typescript 'Hello world as OOP'
```

Building & Running (Prod)

```bash
yarn build
yarn start:prod gpt code -l typescript 'Hello world as OOP'
```

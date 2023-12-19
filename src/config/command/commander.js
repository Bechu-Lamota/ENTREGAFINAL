const { Command } = require('commander')
const dotenv = require('dotenv')
const config = require('../config')

const program = new Command()

program
  .option('--mode <mode>', 'modo de trabajo', 'dev')

program.parse()
const options = program.opts()

dotenv.config({
  path: `.env.${options.mode}`
})

//console.log({ options })
//console.log(process.env)

const settings = config()
console.log({ settings })

module.exports = settings
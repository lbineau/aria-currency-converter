const Discord = require('discord.js')
const config = require('./config.json')
const math = require('mathjs')
require('dotenv').config()

const client = new Discord.Client()

const prefix = '!'

math.createUnit({
  PF: '1',
  PC: '10 PF',
  PA: '100 PF',
  PO: '1000 PF'
})

function calculateRoundNumbers (amount, from, to) {
  const ORDER = ['PO', 'PA', 'PC', 'PF']
  const PF = math.evaluate(`${amount} ${from} to PF`)
  const split = PF.splitUnit(ORDER)
  let shouldStop = false;
  const splitToReturn = split.filter((item, index) => {
    if (shouldStop) return false;
    if (index >= ORDER.indexOf(to)) {
      if (item.toNumeric() != 0) shouldStop = true
      return true
    }
    return false
  })
  return splitToReturn
}

client.on('message', function (message) {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  const commandBody = message.content.slice(prefix.length)
  if (commandBody === 'help') {
    message.reply(`
    __**Unités**__
    - PF = Pièce de fer
    - PC = Pièce de cuivre
    - PA = Pièce d'argent
    - PO = Pièce d'or
    __**Exemples de commandes**__
    !1POPA => Convertir 1 pièce d'or en pièce d'argent
    !1000PFPA => Convertir 1000 pièce de fer en pièce d'argent
    `)
    return
  }
  // const args = commandBody.split(' ');
  const regex = /(^\d+)(PO|PA|PC|PF)(PO|PA|PC|PF)/gm
  const args = regex.exec(commandBody)
  // const command = args.shift().toLowerCase();
  const [match, amount, from, to] = args
  const toPF = math.evaluate(`${amount} ${from} to PF`)
  const toPC = math.evaluate(`${amount} ${from} to PC`)
  const toPA = math.evaluate(`${amount} ${from} to PA`)
  const toPO = math.evaluate(`${amount} ${from} to PO`)
  const convertion = math.evaluate(`${amount} ${from} to ${to}`)

  if (math.isInteger(convertion.toNumeric())) {
    message.reply(`Convertion: ${convertion}`)
  } else {
    message.reply(`Convertion: ${calculateRoundNumbers(amount, from, to)}`)
  }
})

client.login(process.env.BOT_TOKEN)

const Discord = require('discord.js')
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

function formatResponseMessage (result, amount, from) {
  return `\`\`\`${amount} ${from}: ${result}\`\`\``
}

function calculateRoundNumbers (amount, from, to) {
  const ORDER = ['PO', 'PA', 'PC', 'PF']
  const PF = math.evaluate(`${amount} ${from} to PF`)
  const ORDER_TO_SPLIT = ORDER.filter((item, index) => {
    return (index >= ORDER.indexOf(to) && index <= ORDER.indexOf(from))
  })
  const split = PF.splitUnit(ORDER_TO_SPLIT)
  return split
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
  const regex = /(^\d+)(PO|PA|PC|PF)(PO|PA|PC|PF)/gm
  const args = regex.exec(commandBody)

  if (!args) return

  const [match, amount, from, to] = args
  const convertion = math.evaluate(`${amount} ${from} to ${to}`)

  if (math.isInteger(convertion.toNumeric())) {
    message.reply(formatResponseMessage(convertion, amount, from))
  } else {
    message.reply(formatResponseMessage(calculateRoundNumbers(amount, from, to), amount, from))
  }
})

client.login(process.env.BOT_TOKEN)

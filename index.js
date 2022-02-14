require('dotenv').config()
const { Telegraf, Markup } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(async (ctx) => {
  console.log('ctx.update.message...', ctx.update.message)
  const chat = ctx.chat
  if (chat.type === 'private') {
    const username = ctx.from.username
    let message = `<b>Welcome to ${process.env.BOT_NAME} ${username}</b>! I am your bot. I am here to help manage your groups and token holders. Choose below to get started.`
    return await ctx.replyWithHTML(
      message,
      Markup.inlineKeyboard([
        Markup.button.callback(`Setup Token Holders Group`, 'setup')
      ])
    )
  }
  const startPayload = ctx.startPayload

  if (startPayload === 'c') {
    const message = `Thank you for adding me to the group. Please make sure to promote me as an administrator.`
    await ctx.reply(message)
    await ctx.telegram.sendMessage(
      ctx.from.id,
      message,
      Markup.inlineKeyboard([
        Markup.button.callback('Config Token Holders Group', 'config')
      ])
    )
    // should record group info
  }
})

bot.action('setup', setupGroup)
bot.action('add', addBotToGroup)
bot.action('config', configGroup)
bot.action('showGroup', showGroupInfo)
bot.action('showChat', showChatInfo)
bot.action('addTokenConfig', addTokenConfig)

async function setupGroup(ctx) {
  await ctx.reply(
    `Please add me to the group as admin. Once added I'll help you to setup token holders chat room.`,
    Markup.inlineKeyboard([
      Markup.button.url(
        `Add ${process.env.BOT_NAME} to Group`,
        `https://t.me/${process.env.BOT_USER_NAME}?startgroup=c`
      )
    ])
  )
}

async function addBotToGroup(ctx) {
  // how to get notification when the bot was added to a group
  await ctx.reply(
    `Thank you for adding me to the group. Please make sure to promote me as an administrator.`,
    Markup.inlineKeyboard([
      Markup.button.callback('Config Token Holders Group', 'config')
    ])
  )
}

async function configGroup(ctx) {
  // how to get all of the groups that use the bot
  await ctx.reply(
    `Please add me to the group as admin. Once added I'll help you to setup token holders chat room or airdrop.`,
    Markup.inlineKeyboard([
      [Markup.button.callback('DemoBot', 'showGroup')],
      [Markup.button.callback(`Add ${process.env.BOT_NAME} to Group`, 'add')]
    ])
  )
}

async function showGroupInfo(ctx) {
  // get a specific group info
  const message = `Please choose from options below

Group Id:
Group Name:
`
  await ctx.reply(message, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      Markup.button.callback('Token Permissioned Chat', 'showChat')
    ])
  })
}

async function showChatInfo(ctx) {
  await ctx.reply(
    `Here is Token Permissioned Chat configuration for __DemoBot__
Invite others using [Invitation Link](https://t.me/${process.env.BOT_USER_NAME}?start=xxx)`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        Markup.button.callback(
          'Add Token Permissioned Config',
          'addTokenConfig'
        )
      ])
    }
  )
}

async function addTokenConfig(ctx) {
  await ctx.reply(
    `Tell me your ERC-20 token details in the format below:
<Token Contract Address> <Minimum number of tokens>
i.e 0xABCDED 5`,
    { parse_mode: 'Markdown' }
  )
}

// register global error handler to prevent the bot from stopping after an exception
bot.catch((err, ctx) => {
  console.error(`Ooops, encountered an error for ${ctx.updateType}`, err)
})

bot.launch()

import { ActivityType, Client, GatewayIntentBits } from 'discord.js'
import { doAction, getStatus } from './lib/conoha'
import { env } from './lib/env'

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`)
  setInterval(() => {
    getStatus()
      .then((status) => {
        if (status == 'ACTIVE') {
          client.user!.setStatus('online')
          client.user!.setActivity('サーバーを起動中', { type: ActivityType.Playing })
        }
        if (status == 'SHUTOFF') {
          client.user!.setStatus('idle')
          client.user!.setActivity(`サーバーは停止中`, { type: ActivityType.Playing })
        }
      })
      .catch((e) => {
        client.user!.setStatus('dnd')
        client.user!.setActivity('エラーが発生しました', { type: ActivityType.Playing })
      })
  }, 5000)
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'start') {
    const message = await interaction.reply('サーバーを起動しています...')
    try {
      await doAction('start')
    } catch (e: any) {
      message.edit(`❌サーバーの起動に失敗しました\n${e.message}`)
      return
    }
    message.edit('サーバーを起動しています\n参加できるようになるまで数分かかる場合があります')
    client.user!.setStatus('online')
    client.user!.setActivity('サーバーを起動中...', { type: ActivityType.Playing })

  } else if (interaction.commandName === 'stop') {
    const message = await interaction.reply('サーバーを停止しています...')
    try {
      await doAction('stop')
    } catch (e: any) {
      message.edit(`❌サーバーの停止に失敗しました\n${e.message}`)
      return
    }
    message.edit('✅サーバーを停止しました')
    client.user!.setStatus('idle')
    client.user!.setActivity('サーバーは停止中', { type: ActivityType.Playing })
  } else if (interaction.commandName === 'reboot') {
    const message = await interaction.reply('サーバーを再起動しています...')
    try {
      await doAction('reboot')
    } catch (e: any) {
      message.edit(`❌サーバーの再起動に失敗しました\n${e.message}`)
      return
    }
    message.edit('✅サーバーを再起動しました')
    client.user!.setStatus('online')
    client.user!.setActivity('✅サーバーを起動しました', { type: ActivityType.Playing })
  } else if (interaction.commandName === 'status') {
    const status = await getStatus()
    let statusText = ''
    if (status == 'ACTIVE') statusText = '起動中🟢'
    else if (status == 'SHUTOFF') statusText = '停止中🔴'
    await interaction.reply('サーバーの状態は' + statusText + 'です')
  }
})

client.login(env.DISCORD_TOKEN)

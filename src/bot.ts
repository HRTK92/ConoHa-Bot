import { ActivityType, Client, GatewayIntentBits } from 'discord.js'
import { doAction, getStatus } from './lib/conoha'
import { env } from './lib/env'

const SHUTDOWN_TIME = 15 * 60 * 1000
let timeWithoutPlayers: number = 0

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})



client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`)
  setInterval(function () {
    getStatus().then((status) => {
      if (status == 'ACTIVE') {
        client.user!.setStatus('online')
        fetch(
          `https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${env.STEAM_WEB_API_KEY}&filter=addr\\${env.SERVER_IP}`
        ).then((res) => {
          res.json().then((json) => {
            if (Object.keys(json.response).length === 0) {
              return client.user!.setActivity('サーバーを起動中...', { type: ActivityType.Playing })
            } else {
              const onlinePlayers = json.response.servers[0].players
              const maxPlayers = json.response.servers[0].max_players
              client.user!.setActivity(`${onlinePlayers}/${maxPlayers}人がサーバー`, {
                type: ActivityType.Playing,
              })
              if (onlinePlayers === 0) {
                timeWithoutPlayers += 5000
              } else {
                timeWithoutPlayers = 0
              }
              if (timeWithoutPlayers >= SHUTDOWN_TIME) {
                doAction('stop')
                console.log('サーバーを停止しました')
                timeWithoutPlayers = 0
              }
            }
          })
        })
      }
      if (status == 'SHUTOFF') {
        client.user!.setStatus('idle')
        client.user!.setActivity(`サーバーは停止中`, { type: ActivityType.Playing })
      }
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
    message.edit(
      '✅サーバーを起動しました\n参加できるようになるまで数分かかる場合があります\nボットのステータスを確認してください'
    )
  } else if (interaction.commandName === 'stop') {
    const message = await interaction.reply('サーバーを停止しています...')
    try {
      await doAction('stop')
    } catch (e: any) {
      message.edit(`❌サーバーの停止に失敗しました\n${e.message}`)
      return
    }
    message.edit('✅サーバーを停止しました')
  } else if (interaction.commandName === 'reboot') {
    const message = await interaction.reply('サーバーを再起動しています...')
    try {
      await doAction('reboot')
    } catch (e: any) {
      message.edit(`❌サーバーの再起動に失敗しました\n${e.message}`)
      return
    }
    message.edit('✅サーバーを再起動しました')
  } else if (interaction.commandName === 'status') {
    const status = await getStatus()
    let statusText = ''
    if (status == 'ACTIVE') statusText = '起動中🟢'
    else if (status == 'SHUTOFF') statusText = '停止中🔴'
    await interaction.reply('サーバーの状態は' + statusText + 'です')
  } else if (interaction.commandName === 'players') {
    const res = await fetch(
      `https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${env.STEAM_WEB_API_KEY}&filter=addr\\${env.SERVER_IP}`
    )
    const json = await res.json()
    if (Object.keys(json.response).length === 0) {
      await interaction.reply('サーバーが起動していないか、SteamのAPIがダウンしています')
      return
    }
    const onlinePlayers = json.response.servers[0].players
    const maxPlayers = json.response.servers[0].max_players
    await interaction.reply(`現在${onlinePlayers}/${maxPlayers}人がプレイ中です`)
  }
})

client.login(env.DISCORD_TOKEN)

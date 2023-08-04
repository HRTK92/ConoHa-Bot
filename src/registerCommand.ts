import { REST, Routes } from 'discord.js'
import { env } from './lib/env'

const commands = [
  {
    name: 'start',
    description: 'サーバーを起動する',
  },
  {
    name: 'stop',
    description: 'サーバーを停止する',
  },
  {
    name: 'reboot',
    description: 'サーバーを再起動する',
  },
  {
    name: 'status',
    description: 'サーバーの状態を確認する',
  },
  {
    name: 'players',
    description: 'オンラインプレイヤーを確認する',
  }
]

const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN)

async function refreshCommands() {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body: commands })

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}

refreshCommands()

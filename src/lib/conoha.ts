import { env } from './env'

const URL_END_POINT_IDENTITY = 'https://identity.tyo2.conoha.io/v2.0/'
const URL_END_POINT_COMPUTE = 'https://compute.tyo2.conoha.io/v2/' + env.TENANT_ID

export async function getToken() {
  const res = await fetch(URL_END_POINT_IDENTITY + 'tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth: {
        passwordCredentials: {
          username: env.CONOHA_USERNAME,
          password: env.CONOHA_PASSWORD,
        },
        tenantId: env.TENANT_ID,
      },
    }),
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(json)
  }
  return json.access.token.id
}

export const doAction = async (action: 'start' | 'stop' | 'reboot') => {
  const token = await getToken().catch((e) => {
    throw new Error(e)
  })
  if (!token) throw new Error('Token not found')
  const status = await getStatus()
  if (action == 'start' && status == 'ACTIVE') throw new Error('すでに起動しています')
  if (action == 'stop' && status == 'SHUTOFF') throw new Error('すでに停止しています')
  if (action == 'reboot' && status == 'SHUTOFF') throw new Error('停止しているため再起動できません')
  let body = {}
  if (action == 'start') {
    body = {
      'os-start': null,
    }
  } else if (action == 'stop') {
    body = {
      'os-stop': null,
    }
  } else if (action == 'reboot') {
    body = {
      reboot: {
        type: 'SOFT',
      },
    }
  }
  const res = await fetch(URL_END_POINT_COMPUTE + '/servers/' + env.SERVER_ID + '/action', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': token,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const json = await res.text()
    throw new Error(json)
  }
}

export const getStatus = async () => {
  const token = await getToken()
  if (!token) throw new Error('Token not found')
  const res = await fetch(URL_END_POINT_COMPUTE + '/servers/' + env.SERVER_ID, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': token,
    },
  })
  if (!res.ok) {
    const json = await res.text()
    throw new Error(json)
  }
  const json = await res.json()
  return json.server.status
}

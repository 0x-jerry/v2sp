import { isString } from '@0x-jerry/utils'
import { URL } from 'node:url'

export interface V2SPOption {
  protocol: 'vmess' | 'vless'
  uuid: string
  host: string
  port: number
  name: string

  transport?: {
    type?: 'raw' | 'xhttp' | 'ws'

    security?: 'none' | 'tls' | 'reality'

    path?: string

    host?: string

    /**
     * xhttp mode
     *
     * https://github.com/XTLS/Xray-core/pull/3994
     */
    mode?: 'auto' | 'packet-up' | 'stream-up'

    /**
     * xhttp extra
     *
     * https://github.com/XTLS/Xray-core/pull/4000
     */
    extra?: Record<string, unknown>
  }
}

/**
 *
 * @param opt Only support a part of xray options
 * @returns
 */
export function encode(opt: V2SPOption): string {
  const { protocol, host, port, name, uuid, transport = {} } = opt

  const url = new URL(`${protocol}://${host}:${port}`)

  url.username = uuid
  url.hash = name

  Object.entries(transport).forEach(([key, value]) => {
    const v = isString(value) ? value : JSON.stringify(value)
    url.searchParams.set(key, v)
  })

  return url.toString()
}

export function decode(sharedString: string): V2SPOption {
  const url = new URL(sharedString)

  const $ = (key: string) => {
    const val = url.searchParams.get(key)
    if (!val) {
      return undefined
    }

    return decodeURIComponent(val)
  }

  const config: V2SPOption = {
    name: url.hash.slice(1),
    protocol: url.protocol.slice(0, -1) as V2SPOption['protocol'],
    host: url.hostname,
    port: Number.parseInt(url.port),
    uuid: url.username,
  }

  const keys: Array<keyof NonNullable<V2SPOption['transport']>> = [
    'type',
    'host',
    'path',
    'mode',
    'security',
    'extra',
  ]

  const entries = keys
    .map((key) => {
      let val = $(key)

      if (key === 'extra' && val) {
        val = JSON.parse(val)
      }

      return [key, val]
    })
    .filter(([_key, value]) => value != null)

  if (entries.length) {
    config.transport = Object.fromEntries(entries)
  }

  return config
}

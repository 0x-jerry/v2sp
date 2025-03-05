import { decode, encode, type V2SPOption } from '../src'

interface TestPair {
  config: V2SPOption
  sharedStr: string
}

describe('v2sp', () => {
  const tests: TestPair[] = [
    {
      config: {
        protocol: 'vmess',
        uuid: '99c80931-f3f1-4f84-bffd-6eed6030f53d',
        host: 'qv2ray.net',
        port: 31415,
        name: 'VMessTCPNaked',
      },
      sharedStr: 'vmess://99c80931-f3f1-4f84-bffd-6eed6030f53d@qv2ray.net:31415#VMessTCPNaked',
    },
    {
      config: {
        protocol: 'vmess',
        uuid: '44efe52b-e143-46b5-a9e7-aadbfd77eb9c',
        host: 'qv2ray.net',
        port: 6939,
        name: 'VMessWebSocketTLS',
        transport: {
          type: 'ws',
          host: 'qv2ray.net',
          path: '/somewhere',
        },
      },
      sharedStr:
        'vmess://44efe52b-e143-46b5-a9e7-aadbfd77eb9c@qv2ray.net:6939?type=ws&host=qv2ray.net&path=%2Fsomewhere#VMessWebSocketTLS',
    },
  ]

  it('#encode', () => {
    for (const test of tests) {
      expect(encode(test.config), test.config.name).toBe(test.sharedStr)
    }
  })

  it('#decode', () => {
    for (const test of tests) {
      expect(decode(test.sharedStr), test.config.name).toEqual(test.config)
    }
  })
})

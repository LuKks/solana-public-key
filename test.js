const test = require('brittle')
const bs58 = maybeDefaultModule(require('bs58'))
const PublicKey = require('./index.js')

test('basic', async function (t) {
  const input = '5i6782taZDN2nLGjo8QSYxJJoGkhqH7qJ6kyswsfiktY'
  const buffer = Buffer.from(bs58.decode(input))
  const bytes = new Uint8Array(buffer)

  const publicKey = new PublicKey(input)

  t.is(publicKey.toBase58(), input)
  t.is(publicKey.toString(), input)
  t.is(publicKey.toJSON(), input)

  t.alike(publicKey.toBuffer(), buffer)
  t.alike(publicKey.toBytes(), bytes)

  t.ok(publicKey.equals(input))
  t.ok(publicKey.equals(buffer))
  t.ok(publicKey.equals(bytes))

  t.ok(publicKey.isOnCurve())
  t.ok(PublicKey.isOnCurve(buffer))
  t.ok(PublicKey.isOnCurve(bytes))
})

test('is not on curve', async function (t) {
  const publicKey = new PublicKey('GGztQqQ6pCPaJQnNpXBgELr5cs3WwDakRbh1iEMzjgSJ')

  t.absent(publicKey.isOnCurve())
  t.absent(PublicKey.isOnCurve(publicKey.toBuffer()))
  t.absent(PublicKey.isOnCurve(publicKey.toBytes()))
})

test('default public key', async function (t) {
  t.is(PublicKey.default.toString(), '11111111111111111111111111111111')
})

test('derive program address', async function (t) {
  const PUMP_PROGRAM = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P')
  const mint = new PublicKey('LqZfiEqd9tKLE9mZdE9fcPXGMYwHuiqJhbM1Bsmpump')

  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from('bonding-curve'), mint.toBuffer()],
    PUMP_PROGRAM
  )

  t.is(pda.toString(), 'E2BAb2TJsZeXGnRV3MDRF8LNEVT5p2C7NWg2ChHoBj5P')
  t.is(bump, 254)
})

test('is or not on curve', async function (t) {
  const PUMP_PROGRAM = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P')
  const mint = new PublicKey('LqZfiEqd9tKLE9mZdE9fcPXGMYwHuiqJhbM1Bsmpump')

  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from('bonding-curve'), mint.toBuffer()],
    PUMP_PROGRAM
  )

  t.is(pda.toString(), 'E2BAb2TJsZeXGnRV3MDRF8LNEVT5p2C7NWg2ChHoBj5P')
  t.is(bump, 254)
})

function maybeDefaultModule (mod) {
  return mod.default ? mod.default : mod
}

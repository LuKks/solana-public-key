const crypto = require('crypto')
const bs58 = maybeDefaultModule(require('bs58'))
const ed25519 = require('@noble/ed25519')
const BN = require('bn.js')

const PROGRAM_DERIVED_ADDRESS = Buffer.from('ProgramDerivedAddress')

const INSPECT = Symbol.for('nodejs.util.inspect.custom')

module.exports = class PublicKey {
  constructor (input) {
    if (typeof input === 'string') {
      this.bytes = Buffer.from(bs58.decode(input))
    } else if (Buffer.isBuffer(input) || input instanceof Uint8Array || Array.isArray(input)) {
      this.bytes = Buffer.from(input)
    } else if (input instanceof PublicKey) {
      this.bytes = input.bytes
    } else if (typeof input === 'object' && input && input.toBuffer) {
      this.bytes = input.toBuffer()
    } else {
      throw new Error('Invalid input')
    }

    if (this.bytes.length !== 32) {
      throw new Error('Invalid length')
    }

    // Compat
    this._bn = new BN(this.toBuffer())
  }

  [INSPECT] () {
    return this.constructor.name + '(' + this.toBase58() + ')'
  }

  toString () {
    return this.toBase58()
  }

  toJSON () {
    return this.toBase58()
  }

  toBuffer () {
    if (this.bytes.length === 32) {
      return Buffer.from(this.bytes)
    }

    const zeroPad = Buffer.alloc(32)

    Buffer.from(this.bytes).copy(zeroPad, 32 - this.bytes.length)

    return zeroPad
  }

  toBytes () {
    const buffer = Buffer.from(this.bytes)

    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
  }

  toBase58 () {
    return bs58.encode(this.bytes)
  }

  equals (other) {
    const b = other instanceof PublicKey ? other : new PublicKey(other)

    return this.bytes.equals(b.bytes)
  }

  isOnCurve () {
    return PublicKey.isOnCurve(this.bytes)
  }

  static default = new PublicKey('11111111111111111111111111111111')

  static createProgramAddressSync (seeds, programId) {
    const buffer = Buffer.concat([
      ...seeds,
      new PublicKey(programId).toBuffer(),
      PROGRAM_DERIVED_ADDRESS
    ])

    const hash = crypto.createHash('sha256').update(buffer).digest()

    if (PublicKey.isOnCurve(hash)) {
      throw new Error('Invalid seeds, address must not be on curve')
    }

    return new PublicKey(hash)
  }

  static findProgramAddressSync (seeds, programId) {
    for (let bump = 255; bump >= 0; bump--) {
      try {
        const seedsWithBump = seeds.concat(Buffer.from([bump]))
        const pda = PublicKey.createProgramAddressSync(seedsWithBump, programId)

        return [pda, bump]
      } catch {
        // Try next bump
      }
    }

    throw new Error('Unable to find a valid program address')
  }

  static isOnCurve (buffer) {
    try {
      ed25519.ExtendedPoint.fromHex(buffer)

      return true
    } catch {
      return false
    }
  }
}

function maybeDefaultModule (mod) {
  return mod.default ? mod.default : mod
}

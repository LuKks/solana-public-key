# solana-public-key

Create Solana public keys and program-derived addresses

```
npm i solana-public-key
```

## Usage

```js
const PublicKey = require('solana-public-key')

const publicKey = new PublicKey(input)
// ...
```

## API (static)

#### `PublicKey.default`

The default system program public key: `11111111111111111111111111111111`.

#### `pda = PublicKey.createProgramAddressSync(seeds, programId)`

Derives a program address from seeds and a program ID.

#### `[pda, bump] = PublicKey.findProgramAddressSync(seeds, programId)`

Finds a valid program address and its bump seed.

#### `isOnCurve = PublicKey.isOnCurve(buffer)`

Check if the given public key address can have a secret key.

## API

#### `publicKey = new PublicKey(input)`

Creates a PublicKey instance from an input.

Input can be a String (base58), Buffer, Uint8Array, or PublicKey.

#### `pk = publicKey.toBase58()`
#### `pk = publicKey.toString()`
#### `pk = publicKey.toJSON()`

Encodes the public key into a base58 string.

#### `buffer = publicKey.toBuffer()`

Returns the public key as a Buffer.

#### `buffer = publicKey.toBytes()`

Returns the public key as a Uint8Array.

#### `isEqual = publicKey.equals(other)`

Compares two PublicKey instances.

The other public key can be any input.

#### `isOnCurve = publicKey.isOnCurve(other)`

Check if the public key can have a secret key.

## License

MIT

# @cryptico/aes

This is a typescript implementation of the AES block cipher. Key lengths of 128, 192 and 256 bits are supported.
The well-functioning of the encryption/decryption routines has been verified for different key lengths with the test vectors given in [FIPS-197, Appendix C](https://csrc.nist.gov/csrc/media/publications/fips/197/final/documents/fips-197.pdf).

## Installation

```bash
    # with yarn:
    yarn add @cryptico/aes
    # with npm:
    npm i --save @cryptico/aes
```

## Usage

### Import

```typescript
import {AES} from '@cryptico/aes';
```
or
```javascript
const AES = require('@cryptico/aes').AES;
```

### Basic Usage

The following code example enciphers the plaintext block `00 11 22 .. EE FF` with the 256 bit key `00 01 02 .. 1E 1F`.
```typescript
import {AES} from '@cryptico/aes';
const key = [
    0x00, 0x01, 0x02, 0x03,
    0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
    0x10, 0x11, 0x12, 0x13,
    0x14, 0x15, 0x16, 0x17,
    0x18, 0x19, 0x1a, 0x1b,
    0x1c, 0x1d, 0x1e, 0x1f
];

const block = [
    0x00, 0x11, 0x22, 0x33,
    0x44, 0x55, 0x66, 0x77,
    0x88, 0x99, 0xaa, 0xbb,
    0xcc, 0xdd, 0xee, 0xff
];

const aes = AES(key);

const encrypted = aes.encrypt(block);

const decrypted = aes.encrypt(encrypted);
```

> Reimplementation of [C version of AES algorithm](https://github.com/dhuertas/AES) on TypeScript.

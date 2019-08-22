# @cryptico/aes (fork of [JSAES](http://point-at-infinity.org/jsaes/))

This is a typescript implementation of the AES block cipher. Key lengths of 128, 192 and 256 bits are supported.
The well-functioning of the encryption/decryption routines has been verified for different key lengths with the test vectors given in `FIPS-197, Appendix C`.

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
const aes = AES();

const block = new Array(16);
for (let i = 0; i < 16; i++) {
  block[i] = 0x11 * i;
}

const key = new Array(32);
for (let i = 0; i < 32; i++) {
  key[i] = i;
}

aes.expandKey(key);
aes.encrypt(block, key);
```

## Copyright

> jsaes version 0.1  -  Copyright 2006 B. Poettering
>  
> This program is free software; you can redistribute it and/or
> modify it under the terms of the GNU General Public License as
> published by the Free Software Foundation; either version 2 of the
> License, or (at your option) any later version.
> 
> This program is distributed in the hope that it will be useful,
> but WITHOUT ANY WARRANTY; without even the implied warranty of
> MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
> General Public License for more details.
> 
> You should have received a copy of the GNU General Public License
> along with this program; if not, write to the Free Software
> Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
> 02111-1307 USA

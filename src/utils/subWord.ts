import {AES_SBOX} from '../aes.constants';

export function subWord (w: number[]) {
  for (let i = 0; i < 4; i++) {
    w[i] = AES_SBOX[16 * ((w[i] & 0xf0) >> 4) + (w[i] & 0x0f)];
  }
}

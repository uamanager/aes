import {AES_INVERSE_SBOX, AES_NB, AES_R, AES_SBOX} from './aes.constants';
import {coefAdd} from './utils/coefAdd';
import {coefMult} from './utils/coefMult';
import {gmult} from './utils/gmult';
import {rotWord} from './utils/rotWord';
import {subWord} from './utils/subWord';


export class AES {
  private readonly NK;
  private readonly NR;
  private readonly KEY: number[];

  constructor (key: number[]) {
    if (!key) {
      throw new Error('AES requires key!');
    }
    const keyLength = key.length;

    switch (keyLength) {
      case 16:
        this.NK = 4;
        this.NR = 10;
        break;
      case 24:
        this.NK = 6;
        this.NR = 12;
        break;
      case 32:
        this.NK = 8;
        this.NR = 14;
        break;
      default:
        throw new Error('AES supports only 16, 24 and 32 bytes keys!');
    }

    this.KEY = new Array(AES_NB * (this.NR + 1) * 4);

    this.expandKey(key);
  }

  public encrypt (block: number[]): number[] {
    let state = this.createState(block);

    this.addRoundKey(state, 0);

    for (let r = 1; r < this.NR; r++) {
      this.subBytes(state);
      this.shiftRows(state);
      this.mixColumns(state);
      this.addRoundKey(state, r);
    }

    this.subBytes(state);
    this.shiftRows(state);
    this.addRoundKey(state, this.NR);

    return this.stateToResult(state);
  }

  public decrypt (block: number[]): number[] {
    let state = this.createState(block);

    this.addRoundKey(state, this.NR);

    for (let r = this.NR - 1; r >= 1; r--) {
      this.shiftRows(state, true);
      this.subBytes(state, true);
      this.addRoundKey(state, r);
      this.mixColumns(state, true);
    }

    this.shiftRows(state, true);
    this.subBytes(state, true);
    this.addRoundKey(state, 0);

    return this.stateToResult(state);
  }

  private createState (block: number[]): number[] {
    let state = new Array(4 * AES_NB);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < AES_NB; j++) {
        state[AES_NB * i + j] = block[i + 4 * j];
      }
    }

    return state;
  }

  private stateToResult (state: number[]): number[] {
    let result: number[] = new Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < AES_NB; j++) {
        result[i + 4 * j] = state[AES_NB * i + j];
      }
    }
    return result;
  }

  private expandKey (key: number[]) {
    let tmp = new Array(4);
    const length = AES_NB * (this.NR + 1);

    for (let i = 0; i < this.NK; i++) {
      this.KEY[4 * i] = key[4 * i];
      this.KEY[4 * i + 1] = key[4 * i + 1];
      this.KEY[4 * i + 2] = key[4 * i + 2];
      this.KEY[4 * i + 3] = key[4 * i + 3];
    }

    for (let i = this.NK; i < length; i++) {
      tmp[0] = this.KEY[4 * (i - 1)];
      tmp[1] = this.KEY[4 * (i - 1) + 1];
      tmp[2] = this.KEY[4 * (i - 1) + 2];
      tmp[3] = this.KEY[4 * (i - 1) + 3];

      if (i % this.NK === 0) {
        rotWord(tmp);
        subWord(tmp);
        coefAdd(tmp, AES.roundConstant(i / this.NK), tmp);
      } else if (this.NK > 6 && i % this.NK === 4) {
        subWord(tmp);
      }

      this.KEY[4 * i] = this.KEY[4 * (i - this.NK)] ^ tmp[0];
      this.KEY[4 * i + 1] = this.KEY[4 * (i - this.NK) + 1] ^ tmp[1];
      this.KEY[4 * i + 2] = this.KEY[4 * (i - this.NK) + 2] ^ tmp[2];
      this.KEY[4 * i + 3] = this.KEY[4 * (i - this.NK) + 3] ^ tmp[3];
    }
  }

  private static roundConstant (i: number) {
    if (i == 1) {
      AES_R[0] = 0x01;
    } else if (i > 1) {
      AES_R[0] = 0x02;
      i--;
      while (i - 1 > 0) {
        AES_R[0] = gmult(AES_R[0], 0x02);
        i--;
      }
    }

    return AES_R;
  }

  private addRoundKey (state: number[], round: number) {
    for (let c = 0; c < AES_NB; c++) {
      state[c] ^= this.KEY[4 * AES_NB * round + 4 * c];
      state[AES_NB + c] ^= this.KEY[4 * AES_NB * round + 4 * c + 1];
      state[AES_NB * 2 + c] ^= this.KEY[4 * AES_NB * round + 4 * c + 2];
      state[AES_NB * 3 + c] ^= this.KEY[4 * AES_NB * round + 4 * c + 3];
    }
  }

  private mixColumns (state: number[], inverse: boolean = false) {
    const a: number[] = inverse ? [0x0e, 0x09, 0x0d, 0x0b] : [0x02, 0x01, 0x01, 0x03];
    const col: number[] = new Array(4);
    let result: number[] = new Array(4);

    for (let j = 0; j < AES_NB; j++) {
      for (let i = 0; i < 4; i++) {
        col[i] = state[AES_NB * i + j];
      }
      coefMult(a, col, result);
      for (let i = 0; i < 4; i++) {
        state[AES_NB * i + j] = result[i];
      }
    }
  }

  private shiftRows (state: number[], inverse: boolean = false) {
    for (let i = 1; i < 4; i++) {
      let s = 0;
      while (s < i) {
        const tmp = inverse ? state[AES_NB * i + AES_NB - 1] : state[AES_NB * i + 0];

        if (inverse) {
          for (let k = AES_NB - 1; k > 0; k--) {
            state[AES_NB * i + k] = state[AES_NB * i + k - 1];
          }

          state[AES_NB * i] = tmp;
        } else {
          for (let k = 1; k < AES_NB; k++) {
            state[AES_NB * i + k - 1] = state[AES_NB * i + k];
          }

          state[AES_NB * i + AES_NB - 1] = tmp;
        }
        s++;
      }
    }
  }

  private subBytes (state: number[], inverse: boolean = false) {
    const SBOX = inverse ? AES_INVERSE_SBOX : AES_SBOX;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < AES_NB; j++) {
        const row = (state[AES_NB * i + j] & 0xf0) >> 4;
        const col = state[AES_NB * i + j] & 0x0f;
        state[AES_NB * i + j] = SBOX[16 * row + col];
      }
    }
  }
}

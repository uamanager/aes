import {AES_SBOX, AES_SHIFT_ROW_TABS} from './aes.constants';

export class AES {
	private SBOX: number[] = new Array(256);
	private SHIFT_ROW_TABS: number[] = new Array(16);
	private XTIME: number[] = new Array(256);

	constructor () {
		for (let i = 0; i < 256; i++) {
			this.SBOX[AES_SBOX[i]] = i;
		}

		for (let i = 0; i < 16; i++) {
			this.SHIFT_ROW_TABS[AES_SHIFT_ROW_TABS[i]] = i;
		}

		for (let i = 0; i < 128; i++) {
			this.XTIME[i] = i << 1;
			this.XTIME[128 + i] = (
				i << 1
			) ^ 0x1b;
		}
	}

	public expandKey (key) {
		const kl = key.length;
		let ks, Rcon = 1;

		switch (kl) {
			case 16:
				ks = 16 * (
					10 + 1
				);
				break;
			case 24:
				ks = 16 * (
					12 + 1
				);
				break;
			case 32:
				ks = 16 * (
					14 + 1
				);
				break;
		}

		for (let i = kl; i < ks; i += 4) {
			let temp = key.slice(i - 4, i);
			if (i % kl == 0) {
				temp = [
					this.SBOX[temp[1]] ^ Rcon,
					this.SBOX[temp[2]],
					this.SBOX[temp[3]],
					this.SBOX[temp[0]]
				];
				if ((
					Rcon <<= 1
				) >= 256) {
					Rcon ^= 0x11b;
				}
			} else if ((
				kl > 24
			) && (
				i % kl == 16
			)) {
				temp = [
					this.SBOX[temp[0]],
					this.SBOX[temp[1]],
					this.SBOX[temp[2]],
					this.SBOX[temp[3]]
				];
			}
			for (let j = 0; j < 4; j++) {
				key[i + j] = key[i + j - kl] ^ temp[j];
			}
		}
	}

	public encrypt (block: number[], key) { //TODO: define types
		let i;
		const l = key.length;

		this.addRoundKey(block, key.slice(0, 16));

		for (i = 16; i < l - 16; i += 16) {
			this.subBytes(block, AES_SBOX);
			this.shiftRows(block, AES_SHIFT_ROW_TABS);
			this.mixColumns(block);
			this.addRoundKey(block, key.slice(i, i + 16));
		}

		this.subBytes(block, AES_SBOX);
		this.shiftRows(block, AES_SHIFT_ROW_TABS);
		this.addRoundKey(block, key.slice(i, l));
	}

	public decrypt (block: number[], key) { //TODO: define types
		const l = key.length;
		this.addRoundKey(block, key.slice(l - 16, l));
		this.shiftRows(block, this.SHIFT_ROW_TABS);
		this.subBytes(block, this.SBOX);
		for (let i = l - 32; i >= 16; i -= 16) {
			this.addRoundKey(block, key.slice(i, i + 16));
			this.mixColumnsInv(block);
			this.shiftRows(block, this.SHIFT_ROW_TABS);
			this.subBytes(block, this.SBOX);
		}
		this.addRoundKey(block, key.slice(0, 16));
	}

	private subBytes (state: number[], sbox: typeof AES_SBOX) { //TODO: define types
		for (let i = 0; i < 16; i++) {
			state[i] = sbox[state[i]];
		}
	}

	private addRoundKey (state: number[], roundKey: any) { //TODO: define types (state is block and roundkey is aeskey string or array)
		for (let i = 0; i < 16; i++) {
			state[i] ^= roundKey[i];
		}
	}

	private shiftRows (state: number[], shiftTab: typeof AES_SHIFT_ROW_TABS) { //TODO: define types
		const h = [...state];
		for (let i = 0; i < 16; i++) {
			state[i] = h[shiftTab[i]];
		}
	}

	private mixColumns (state: number[]) {
		for (let i = 0; i < 16; i += 4) {
			const s0 = state[i],
				s1 = state[i + 1],
				s2 = state[i + 2],
				s3 = state[i + 3];
			const h = s0 ^ s1 ^ s2 ^ s3;

			state[i] ^= h ^ this.XTIME[s0 ^ s1];
			state[i + 1] ^= h ^ this.XTIME[s1 ^ s2];
			state[i + 2] ^= h ^ this.XTIME[s2 ^ s3];
			state[i + 3] ^= h ^ this.XTIME[s3 ^ s0];
		}
	}

	private mixColumnsInv (state: number[]) {
		for (let i = 0; i < 16; i += 4) {
			const s0 = state[i],
				s1 = state[i + 1],
				s2 = state[i + 2],
				s3 = state[i + 3];
			const h = s0 ^ s1 ^ s2 ^ s3;
			const xh = this.XTIME[h];
			const h1 = this.XTIME[this.XTIME[xh ^ s0 ^ s2]] ^ h;
			const h2 = this.XTIME[this.XTIME[xh ^ s1 ^ s3]] ^ h;

			state[i] ^= h1 ^ this.XTIME[s0 ^ s1];
			state[i + 1] ^= h2 ^ this.XTIME[s1 ^ s2];
			state[i + 2] ^= h1 ^ this.XTIME[s2 ^ s3];
			state[i + 3] ^= h2 ^ this.XTIME[s3 ^ s0];
		}
	}
}

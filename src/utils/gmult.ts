export function gmult (a: number, b: number) {
  let p = 0, hbs = 0;

  for (let i = 0; i < 8; i++) {
    if (b & 1) {
      p ^= a;
    }

    hbs = a & 0x80;
    a <<= 1;
    if (hbs) {
      a ^= 0x1b;
    }
    b >>= 1;
  }

  return p;
}

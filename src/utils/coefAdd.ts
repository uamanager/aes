export function coefAdd (a: number[], b: number[], d: number[]) {
  d[0] = a[0] ^ b[0];
  d[1] = a[1] ^ b[1];
  d[2] = a[2] ^ b[2];
  d[3] = a[3] ^ b[3];
}

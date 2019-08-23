export function rotWord (w: number[]) {
  let tmp = w[0];
  for (let i = 0; i < 3; i++) {
    w[i] = w[i + 1];
  }
  w[3] = tmp;
}

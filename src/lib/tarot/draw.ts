/**
 * 덱 섞기와 뽑기. 암호학적 난수(crypto.getRandomValues) + 거부 표본추출로 치우침 없는 Fisher–Yates.
 */
export interface Drawn {
  index: number;
  reversed: boolean;
}

export type RandomSource = (bound: number) => number;

/** 0 ≤ n < bound 정수, 균등 분포 */
export const cryptoRandomInt: RandomSource = (bound) => {
  if (!Number.isInteger(bound) || bound <= 0 || bound > 2 ** 32) throw new RangeError("bound");
  const limit = Math.floor(2 ** 32 / bound) * bound; // 이 값 이상은 버려서 모듈로 치우침 제거
  const buf = new Uint32Array(1);
  for (;;) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return buf[0] % bound;
  }
};

export function shuffle(deckSize: number, random: RandomSource = cryptoRandomInt): number[] {
  const order = Array.from({ length: deckSize }, (_, i) => i);
  for (let i = deckSize - 1; i > 0; i--) {
    const j = random(i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function draw(deckSize: number, count: number, allowReversed: boolean, random: RandomSource = cryptoRandomInt): Drawn[] {
  if (count > deckSize) throw new RangeError("count");
  return shuffle(deckSize, random)
    .slice(0, count)
    .map((index) => ({ index, reversed: allowReversed && random(2) === 1 }));
}

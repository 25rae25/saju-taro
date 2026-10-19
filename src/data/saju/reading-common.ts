/**
 * 풀이 화면의 공통 문구 — 안내문, 대운·세운 머리 문장. 직접 작성.
 */

export const READING_DISCLAIMER =
  "명식의 글자 조합에 따라 규칙으로 고른 참고 문장이에요. 정해진 미래를 말하지 않으며, 건강·재정·법률처럼 중요한 결정은 해당 분야 전문가와 상의해 주세요.";

export const LUCK_COMMON = {
  /** 첫 대운 시작 전 */
  daeunBefore: (label: number, ko: string, start: string) =>
    `아직 첫 대운(${label}세 ${ko}) 전이에요. 첫 대운은 ${start}에 시작해요.`,
  /** 지금 대운 */
  daeunCurrent: (label: number, ko: string, hanja: string, from: string, to: string) =>
    `지금은 ${label}세 대운 ${ko}(${hanja})의 시기로, ${from}부터 ${to}까지예요.`,
  /** 올해 세운 */
  seunCurrent: (year: number, ko: string, hanja: string, ipchun: string) =>
    `${year}년 ${ko}(${hanja})년 세운이에요. 해의 간지는 입춘에 바뀌므로 ${ipchun} 입춘부터 다음 입춘 전까지예요.`,
} as const;

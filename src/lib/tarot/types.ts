export type Arcana = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles";

export interface CardSide {
  /** 3~5개 한국어 키워드 */
  keywords: string[];
  /** 2~3문장 한국어 풀이 (직접 작성, 웨이트 원전 근거) */
  meaning: string;
}

export interface TarotCard {
  /** "major-00" … "major-21", "wands-01" … "wands-14" (11 페이지, 12 나이트, 13 퀸, 14 킹) */
  id: string;
  arcana: Arcana;
  suit: Suit | null;
  /** 메이저 0–21 (웨이트–스미스 순서: 8 힘, 11 정의), 마이너 1–14 */
  number: number;
  nameEn: string;
  nameKo: string;
  upright: CardSide;
  reversed: CardSide;
  /** 웨이트 『The Pictorial Key to the Tarot』(1911, 퍼블릭 도메인)의 점술 의미 원문 */
  waite: { upright: string; reversed: string; source: string };
}

export interface SpreadPosition {
  key: string;
  label: string;
  description: string;
}

export interface Spread {
  id: string;
  name: string;
  description: string;
  positions: SpreadPosition[];
}

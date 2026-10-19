/**
 * 격국(格局) 판정 — 자평진전(子平眞詮)식 내격.
 *
 * 판정 순서 (규칙 표와 근거는 docs/DATA.md "격국" 절):
 * 1. 월령이 일간과 같은 기운이면 건록격(祿 자리)·양인격(양간의 刃 자리)·월겁격(정기가 겁재)이다. 투출은 따지지 않는다.
 * 2. 정기가 투출하면 정기, 아니면 투출한 지장간(중기 > 여기), 투출이 없으면 정기로 정한다.
 *    - 子午卯酉의 여기는 판정에 쓰지 않는다. 午의 중기 己는 쓴다.
 *    - 寅申巳亥에서 투출한 비견·겁재는 격이 되지 않는다. 辰戌丑未(잡기)에서는 월겁으로 쓴다.
 *    - 고른 중기를 함께 투출한 여기가 극하면 중기는 물러나고 정기(본격)로 돌아간다 (申월의 壬·戊).
 *    - 辰戌丑未월의 戊·己 일간처럼 정기가 비겁이면 정기를 건너뛰고, 투출이 없으면 월겁격이다.
 * 외격과 삼합 변격(회지)은 판정하지 않는다. 월지가 낀 삼합이 성립하면 참고로만 알린다.
 */
import { BRANCHES, ELEMENTS, STEMS, tenGod, type Element, type TenGod } from "./constants";

// ── 출처 ────────────────────────────────────────────────

export interface GyeokSource {
  work: string;
  chapter: string;
  /** 원문 (대조본의 글자 그대로). 생략한 곳은 … */
  quote: string;
  /** 대조본과 글자를 맞춰 봤는지 */
  checked: boolean;
  /** 교감·이본 메모 */
  note?: string;
}

/**
 * 沈孝瞻 『子平眞詮』(청 건륭 연간, 퍼블릭 도메인).
 * 대조본: 東里書齋 『秘本子平真詮』 번체 전문(중주본 中州本 교감). 자세한 내용은 docs/DATA.md.
 */
export const GYEOK_SOURCES = {
  monthly: {
    work: "子平眞詮",
    chapter: "論用神",
    quote: "八字用神，專求月令，以日干配月令地支，而生尅不同，格局分焉。",
    checked: true,
  },
  rokGeop: {
    work: "子平眞詮",
    chapter: "論用神",
    quote: "如木生寅卯，日與月同，本身不可爲用，必看四柱有無財官煞食透干會支，另取用神。然終以月令爲主，然後尋用，是建祿月劫之格，非用而即用神也。",
    checked: true,
  },
  rokGeopKinds: {
    work: "子平眞詮",
    chapter: "論用神",
    quote: "陽刃喜官煞以制伏，忌官煞之俱無；月劫喜透官以制伏，利用財而透食以化劫。",
    checked: true,
  },
  yangin: {
    work: "子平眞詮",
    chapter: "論陽刃",
    quote: "陽刃者，劫我正財之神，乃正財之七煞也。祿前一位，惟五陽有之，故爲陽刃。",
    checked: true,
    note: "「五」는 저본에 「六」으로 되어 있던 것을 중주본에 따라 고친 글자다(대조본 교감).",
  },
  rokGeopSame: {
    work: "子平眞詮",
    chapter: "論建祿月劫",
    quote: "建祿者，月建而逢祿堂也，祿即是劫。…故建祿與月劫，可同一格，不必另分，皆以透干合支，別取財官煞食爲用。",
    checked: true,
  },
  transparent: {
    work: "子平眞詮",
    chapter: "論用神變化",
    quote: "用神既主月令矣，然月令所藏不一，而用神遂有變化。如十二支中，除子午卯酉外，餘皆有藏，不必四墓也。即以寅論，甲爲本主…假使寅月爲提，不透甲而透丙，則如府官不臨郡，而同知得以作主。",
    checked: true,
    note: "간체 전사본(ykzhong.substack.com)은 「矣」를 「也」, 「四墓」를 「四库」, 「如府官」을 「知府」로 적었다.",
  },
  mainKept: {
    work: "子平眞詮",
    chapter: "論用神變化",
    quote: "如辛生寅月，透丙化官，而又透甲，格成正財，正官乃其兼格也；乙生申月，透壬化印，而又透戊，則財能生官，印逢財而退位…格成正官，而印爲兼格；…丙生申月，逢壬化煞，而又透戊，則食神能制煞生財，仍爲財格。",
    checked: true,
  },
  wolgeopKept: {
    work: "子平眞詮",
    chapter: "論用神變化",
    quote: "乙生寅月，透戊爲財，會午會戌，則月劫化爲食傷。",
    checked: true,
  },
  hoeji: {
    work: "子平眞詮",
    chapter: "論用神變化",
    quote: "若丁生亥月，本爲正官，支全卯未，則化爲印。",
    checked: true,
  },
  japgi: {
    work: "子平眞詮",
    chapter: "論雜氣如何取用",
    quote: "四墓者，沖氣也，何以謂之雜氣？以其所藏者多，用神不一，故謂之雜氣也。…透干會支，取其清者用之，雜而不雜也。何謂透干？如甲生辰月，透戊則用偏財，透癸則用正印，透乙則用月劫是也。…一透則一用，兼透則兼用。",
    checked: true,
  },
  ohGi: {
    work: "子平眞詮",
    chapter: "論陽刃 · 論用神純雜",
    quote: "其於丙生午月，內藏己土，可以尅水 (論陽刃) / 癸生午月，丁己並透，財與煞相生 (論用神純雜)",
    checked: true,
  },
} as const satisfies Record<string, GyeokSource>;

export type GyeokSourceId = keyof typeof GYEOK_SOURCES;

// ── 규칙 데이터 ──────────────────────────────────────────

/** 일간별 건록(祿) 지지 — 12운성 '건록' 자리(화토동법). 갑인 을묘 병사 정오 무사 기오 경신 신유 임해 계자 */
export const ROK_BRANCH: readonly number[] = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];

/** 양간의 양인(刃) 지지 — 녹 다음 자리(12운성 '제왕'). 음간은 없음(惟五陽有之). 갑묘 병오 무오 경유 임자 */
export const YANGIN_BRANCH: readonly (number | null)[] = [3, null, 6, null, 6, null, 9, null, 0, null];

/** 왕지(子午卯酉) — 여기를 판정에 쓰지 않는다 (論用神變化 "除子午卯酉外，餘皆有藏"). 午의 중기 己는 쓴다. */
export const WANGJI: readonly number[] = [0, 3, 6, 9];

/** 사고(辰戌丑未) — 잡기(雜氣). 투출한 비견·겁재도 월겁으로 쓴다 (論雜氣如何取用 "透乙則用月劫") */
export const GOJI: readonly number[] = [1, 4, 7, 10];

export interface Samhap {
  name: string;
  /** [생지, 왕지, 고지] 지지 인덱스 */
  branches: readonly [number, number, number];
  element: Element;
}

/** 삼합 — 회지(會支) 참고용 */
export const SAMHAP: readonly Samhap[] = [
  { name: "신자진 수국(水局)", branches: [8, 0, 4], element: "수" },
  { name: "해묘미 목국(木局)", branches: [11, 3, 7], element: "목" },
  { name: "인오술 화국(火局)", branches: [2, 6, 10], element: "화" },
  { name: "사유축 금국(金局)", branches: [5, 9, 1], element: "금" },
];

export type GyeokName =
  | "정관격" | "편관격" | "정재격" | "편재격" | "정인격" | "편인격" | "식신격" | "상관격"
  | "건록격" | "양인격" | "월겁격";

export const GYEOK_INFO: Record<GyeokName, { hanja: string; alias: string | null }> = {
  정관격: { hanja: "正官格", alias: null },
  편관격: { hanja: "偏官格", alias: "칠살격(七殺格)" },
  정재격: { hanja: "正財格", alias: "자평진전은 정재·편재를 재격(財格)으로 묶음" },
  편재격: { hanja: "偏財格", alias: "자평진전은 정재·편재를 재격(財格)으로 묶음" },
  정인격: { hanja: "正印格", alias: "자평진전은 정인·편인을 인수격(印綬格)으로 묶음" },
  편인격: { hanja: "偏印格", alias: "자평진전은 정인·편인을 인수격(印綬格)으로 묶음" },
  식신격: { hanja: "食神格", alias: null },
  상관격: { hanja: "傷官格", alias: null },
  건록격: { hanja: "建祿格", alias: "자평진전은 건록과 월겁을 한 무리로 봄" },
  양인격: { hanja: "陽刃格", alias: null },
  월겁격: { hanja: "月劫格", alias: "자평진전은 건록과 월겁을 한 무리로 봄" },
};

const EIGHT_GYEOK: Partial<Record<TenGod, GyeokName>> = {
  정관: "정관격", 편관: "편관격", 정재: "정재격", 편재: "편재격",
  정인: "정인격", 편인: "편인격", 식신: "식신격", 상관: "상관격",
};

export type GyeokRuleId = "geonrok" | "yangin" | "wolgeop" | "jeonggiReveal" | "hiddenReveal" | "mainKept" | "jeonggiDefault" | "gojiWolgeop";

export interface GyeokRule {
  id: GyeokRuleId;
  /** 판정 순서 (작을수록 먼저) */
  order: number;
  when: string;
  then: string;
  sources: readonly GyeokSourceId[];
}

/**
 * 판정 규칙 — judgeGyeokguk는 이 순서대로 처음 맞는 규칙을 쓴다.
 * 4~8에서 子午卯酉의 여기는 판정에 쓰지 않는다(午의 중기 己는 씀) — sources: transparent, ohGi.
 */
export const GYEOK_RULES: readonly GyeokRule[] = [
  { id: "geonrok", order: 1, when: "월지가 일간의 건록(祿) 자리", then: "건록격", sources: ["rokGeop", "rokGeopSame"] },
  { id: "yangin", order: 2, when: "일간이 양간이고 월지가 양인(刃, 녹 다음) 자리", then: "양인격", sources: ["rokGeopKinds", "yangin"] },
  { id: "wolgeop", order: 3, when: "월지가 寅申巳亥·子午卯酉이고 정기가 일간의 겁재 (음간의 겁재월: 乙寅·丁巳·辛申·癸亥)", then: "월겁격", sources: ["rokGeop", "rokGeopSame", "wolgeopKept"] },
  { id: "jeonggiReveal", order: 4, when: "월지 정기(비겁 아님)가 연간·월간·시간에 투출", then: "정기의 십신 격", sources: ["monthly", "mainKept"] },
  { id: "hiddenReveal", order: 5, when: "정기가 투출하지 않았거나 비겁이고, 여기·중기가 투출 (중기 > 여기). 寅申巳亥의 비견·겁재 투출은 빼고, 辰戌丑未의 비견·겁재 투출은 월겁으로 씀", then: "투출한 지장간의 십신 격 (비겁이면 월겁격)", sources: ["transparent", "japgi", "ohGi"] },
  { id: "mainKept", order: 6, when: "5에서 고른 중기를, 함께 투출한 여기가 극함 (申월의 壬을 戊가 극함)", then: "정기의 십신 격 (본격 유지)", sources: ["mainKept"] },
  { id: "jeonggiDefault", order: 7, when: "정기가 비겁이 아니고, 판정에 쓰는 지장간 중 투출한 것이 없음", then: "정기의 십신 격", sources: ["monthly"] },
  { id: "gojiWolgeop", order: 8, when: "辰戌丑未월의 戊·己 일간(정기가 비겁)이고 여기·중기 투출이 없음", then: "월겁격", sources: ["rokGeop"] },
];

// ── 판정 ────────────────────────────────────────────────

export type StemPosition = "year" | "month" | "hour";
export const STEM_POSITION_LABEL: Record<StemPosition, string> = { year: "연간", month: "월간", hour: "시간" };

export type HiddenRole = "여기" | "중기" | "정기";

export interface GyeokHidden {
  stem: number;
  role: HiddenRole;
  days: number;
  tenGod: TenGod;
  /** 이 천간이 나타난 천간 자리 (일간 제외) */
  revealedAt: StemPosition[];
  /** 격을 정하는 데 쓰였나 */
  chosen: boolean;
  /** 투출했는데 쓰지 않은 이유 등 */
  note: string | null;
}

export interface SamhapNote extends Samhap {
  /** 국(局) 오행의 일간 기준 십신 무리 */
  tenGodGroup: string;
}

export interface Gyeokguk {
  name: GyeokName;
  hanja: string;
  alias: string | null;
  rule: GyeokRuleId;
  monthBranch: number;
  /** 월지 지장간 [여기, (중기), 정기] */
  hidden: GyeokHidden[];
  /** 판정 근거 문장 (순서대로) */
  reasons: string[];
  /** 월지가 낀 삼합이 성립하면 (판정에는 반영하지 않음) */
  samhap: SamhapNote | null;
  /** 시간을 모를 때, 시지에 따라 격이 달라지면 시지별 격 */
  byHourBranch: { hourBranches: number[]; name: GyeokName }[] | null;
}

export interface GyeokInput {
  dayStem: number;
  monthBranch: number;
  /** 연간·월간·시간 (시간 모름이면 hour: null) */
  stems: { year: number; month: number; hour: number | null };
  /** 원국 지지 (삼합 확인용, 시간 모름이면 3개) */
  branches: number[];
}

const stemLabel = (s: number) => `${STEMS[s].ko}(${STEMS[s].hanja})`;
const branchLabel = (b: number) => `${BRANCHES[b].ko}(${BRANCHES[b].hanja})`;
const isBigeop = (g: TenGod) => g === "비견" || g === "겁재";

/** 받침이 있으면 앞 조사, 없으면 뒤 조사 ("은는" → 갑은, 무는) */
function josa(ko: string, pair: "은는" | "이가" | "을를") {
  const c = ko.charCodeAt(ko.length - 1) - 0xac00;
  return c >= 0 && c < 11172 && c % 28 !== 0 ? pair[0] : pair[1];
}
const stemJ = (s: number, pair: "은는" | "이가" | "을를") => stemLabel(s) + josa(STEMS[s].ko, pair);
const branchJ = (b: number, pair: "은는" | "이가" | "을를") => branchLabel(b) + josa(BRANCHES[b].ko, pair);

function roleOf(i: number, length: number): HiddenRole {
  if (i === length - 1) return "정기";
  return i === 0 ? "여기" : "중기";
}

/** 일간 오행에서 본 거리(0 같음, 1 내가 생함, 2 내가 극함, 3 나를 극함, 4 나를 생함) → 십신 무리 */
const TEN_GOD_GROUP = ["비겁", "식상", "재성", "관성", "인성"] as const;

function elementGroup(dayStem: number, e: Element): string {
  return TEN_GOD_GROUP[(ELEMENTS.indexOf(e) - Math.floor(dayStem / 2) + 5) % 5];
}

/** 오행 a가 오행 b를 극하나 (천간 인덱스) */
const controls = (a: number, b: number) => (Math.floor(a / 2) + 2) % 5 === Math.floor(b / 2);

function judgeCore(input: GyeokInput): Omit<Gyeokguk, "samhap" | "byHourBranch"> {
  const { dayStem, monthBranch, stems } = input;
  const positions: [StemPosition, number | null][] = [["year", stems.year], ["month", stems.month], ["hour", stems.hour]];
  const raw = BRANCHES[monthBranch].hidden;
  const hidden: GyeokHidden[] = raw.map(([stem, days], i) => ({
    stem,
    role: roleOf(i, raw.length),
    days,
    tenGod: tenGod(dayStem, stem),
    revealedAt: positions.filter(([, s]) => s === stem).map(([p]) => p),
    chosen: false,
    note: null,
  }));
  const main = hidden[hidden.length - 1];
  const desc = (h: GyeokHidden) => `${h.role} ${stemLabel(h.stem)}·${h.tenGod}`;
  const reveal = (h: GyeokHidden) =>
    h.revealedAt.length ? `${h.revealedAt.map((p) => STEM_POSITION_LABEL[p]).join("·")}에 투출` : "투출 없음";

  const reasons: string[] = [
    `월지 ${branchLabel(monthBranch)}의 지장간: ${hidden.map((h) => `${h.role} ${stemLabel(h.stem)}`).join(" · ")}. 투출은 연간·월간·시간에 같은 천간이 있을 때만 칩니다(일간 제외).`,
  ];
  const finish = (rule: GyeokRuleId, name: GyeokName, chosen: GyeokHidden | null) => {
    if (chosen) chosen.chosen = true;
    for (const h of hidden) {
      if (h === chosen || h.revealedAt.length === 0 || h.note) continue;
      h.note = chosen ? `투출했지만 ${chosen.role}를 먼저 씀` : "건록·양인·월겁격은 투출로 바뀌지 않음";
    }
    return { name, hanja: GYEOK_INFO[name].hanja, alias: GYEOK_INFO[name].alias, rule, monthBranch, hidden, reasons };
  };

  // 1) 건록·양인·월겁 — 월령이 일간과 같은 기운
  const rokGeopTail = "월령이 일간과 같은 기운이라 월령 자체를 격의 쓰임으로 삼지 못하며, 다른 지장간이 투출해도 격은 바뀌지 않습니다(建祿與月劫，可同一格…別取財官煞食爲用).";
  if (ROK_BRANCH[dayStem] === monthBranch) {
    reasons.push(`월지 ${branchJ(monthBranch, "은는")} 일간 ${stemLabel(dayStem)}의 건록(祿) 자리입니다 → 건록격. ${rokGeopTail}`);
    return finish("geonrok", "건록격", null);
  }
  if (YANGIN_BRANCH[dayStem] === monthBranch) {
    reasons.push(`월지 ${branchJ(monthBranch, "은는")} 양간 ${stemLabel(dayStem)}의 양인(刃, 녹 다음) 자리입니다 → 양인격. ${rokGeopTail}`);
    return finish("yangin", "양인격", null);
  }
  const isGoji = GOJI.includes(monthBranch);
  // 寅申巳亥·子午卯酉에서 정기가 비겁인데 건록·양인이 아닌 경우는 음간의 겁재월(乙寅·丁巳·辛申·癸亥)뿐이다.
  if (!isGoji && isBigeop(main.tenGod)) {
    reasons.push(`월지 정기 ${stemJ(main.stem, "이가")} 일간 ${stemLabel(dayStem)}의 ${main.tenGod}입니다(음간의 겁재월) → 월겁격. ${rokGeopTail}`);
    return finish("wolgeop", "월겁격", null);
  }

  // 2) 판정에 쓰는 지장간: 子午卯酉의 여기는 쓰지 않는다
  if (WANGJI.includes(monthBranch)) {
    for (const h of hidden) if (h.role === "여기" && h.revealedAt.length) h.note = "자오묘유월의 여기는 판정에 쓰지 않음";
    reasons.push(
      "자·오·묘·유월은 여기를 판정에 쓰지 않습니다(除子午卯酉外，餘皆有藏)." +
        (raw.length === 3 ? " 다만 오(午)의 중기 기(己)는 원문이 쓰므로 판정에 넣습니다(丙生午月，內藏己土 / 癸生午月，丁己並透)." : ""),
    );
  }
  const usable = (h: GyeokHidden) => h.revealedAt.length > 0 && !(WANGJI.includes(monthBranch) && h.role === "여기");
  // 寅申巳亥의 비견·겁재 투출은 격이 되지 않고, 辰戌丑未(잡기)에서는 월겁으로 쓴다
  const gyeokOf = (h: GyeokHidden): GyeokName | null => (isBigeop(h.tenGod) ? (isGoji ? "월겁격" : null) : EIGHT_GYEOK[h.tenGod]!);

  // 3) 정기 투출
  const mainUsable = !isBigeop(main.tenGod);
  for (const h of hidden) if (h !== main && usable(h) && !gyeokOf(h)) h.note = "비견·겁재는 격이 되지 않음";
  if (mainUsable && main.revealedAt.length) {
    const name = EIGHT_GYEOK[main.tenGod]!;
    reasons.push(`${desc(main)} — ${reveal(main)} → ${name}.`);
    const others = hidden.filter((h) => h !== main && usable(h) && gyeokOf(h));
    if (others.length) {
      reasons.push(`${others.map(desc).join(", ")}도 투출했지만 지장간 서열(정기 > 중기 > 여기)에 따라 정기를 씁니다(辛生寅月，透丙化官，而又透甲，格成正財).`);
    }
    return finish("jeonggiReveal", name, main);
  }
  if (!mainUsable) {
    if (main.revealedAt.length) main.note = "정기가 비겁이라 격이 되지 않음";
    reasons.push(`정기 ${stemJ(main.stem, "은는")} 일간 ${stemLabel(dayStem)}의 ${main.tenGod}입니다. 월령이 일간과 같은 기운이라 정기를 격으로 쓰지 못하므로 여기·중기의 투출을 봅니다.`);
  } else {
    reasons.push(`${desc(main)} — 투출 없음. 정기가 투출하지 않으면 투출한 지장간이 격을 맡습니다(不透甲而透丙…同知得以作主).`);
  }

  // 4) 여기·중기 투출 — 서열: 중기 > 여기 (배열은 여기, 중기, 정기 순)
  const candidates = hidden.filter((h) => h !== main && usable(h) && gyeokOf(h)).reverse();
  if (candidates.length) {
    const pick = candidates[0];
    const name = gyeokOf(pick)!;
    reasons.push(
      `${desc(pick)} — ${reveal(pick)} → ${name}.` +
        (isBigeop(pick.tenGod) ? " 진·술·축·미월(잡기)은 투출한 비견·겁재를 월겁으로 씁니다(甲生辰月…透乙則用月劫)." : ""),
    );
    // 고른 중기를 함께 투출한 여기가 극하면 중기는 물러나고 본격(정기)을 쓴다
    const breaker = mainUsable && pick.role === "중기" ? hidden.find((h) => h.role === "여기" && h.revealedAt.length && controls(h.stem, pick.stem)) : undefined;
    if (breaker) {
      const kept = EIGHT_GYEOK[main.tenGod]!;
      reasons.push(
        `그러나 ${desc(breaker)}도 투출해 중기 ${stemJ(pick.stem, "을를")} 극하므로, 중기는 물러나고 본격인 ${desc(main)}${josa(main.tenGod, "을를")} 씁니다 → ${kept}(乙生申月，透壬化印，而又透戊…格成正官 / 丙生申月，逢壬化煞，而又透戊…仍爲財格).`,
      );
      pick.note = `여기 ${stemLabel(breaker.stem)}에 극당해 물러남`;
      breaker.note = `중기 ${stemJ(pick.stem, "을를")} 극함`;
      return finish("mainKept", kept, main);
    }
    if (candidates.length > 1) reasons.push(`${candidates.slice(1).map(desc).join(", ")}도 투출했지만 지장간 서열(중기 > 여기)에 따라 ${pick.role}를 씁니다.`);
    return finish("hiddenReveal", name, pick);
  }
  if (!mainUsable) {
    reasons.push("투출한 여기·중기가 없어 월겁격으로 봅니다(월령이 일간과 같은 기운 — 건록·월겁과 같은 무리).");
    return finish("gojiWolgeop", "월겁격", null);
  }
  const name = EIGHT_GYEOK[main.tenGod]!;
  reasons.push(`판정에 쓰는 여기·중기도 투출하지 않았으므로 정기를 씁니다 → ${name}.`);
  return finish("jeonggiDefault", name, main);
}

function samhapOf(dayStem: number, monthBranch: number, branches: number[]): SamhapNote | null {
  const s = SAMHAP.find((x) => x.branches.includes(monthBranch) && x.branches.every((b) => branches.includes(b)));
  return s ? { ...s, tenGodGroup: elementGroup(dayStem, s.element) } : null;
}

/** 시간 = 일간에서 정함 (갑기일 갑자시 …). index.ts dayAndHour와 같은 식 */
const hourStemOf = (dayStem: number, hourBranch: number) => ((dayStem % 5) * 2 + hourBranch) % 10;

export function judgeGyeokguk(input: GyeokInput): Gyeokguk {
  const core = judgeCore(input);
  const samhap = samhapOf(input.dayStem, input.monthBranch, input.branches);
  if (samhap) {
    core.reasons.push(
      `지지에 ${samhap.branches.map((b) => BRANCHES[b].ko).join("·")}${josa(BRANCHES[samhap.branches[2]].ko, "이가")} 모두 있어 ${samhap.name} 삼합이 성립합니다. 국의 오행 ${samhap.element}${josa(samhap.element, "은는")} 일간 기준 ${samhap.tenGodGroup}입니다. 자평진전은 이런 회지(會支)로 격이 바뀔 수 있다고 보지만, 이 앱은 판정에 반영하지 않습니다.`,
    );
  }

  let byHourBranch: Gyeokguk["byHourBranch"] = null;
  if (input.stems.hour === null) {
    const groups = new Map<GyeokName, number[]>();
    for (let b = 0; b < 12; b++) {
      const { name } = judgeCore({ ...input, stems: { ...input.stems, hour: hourStemOf(input.dayStem, b) } });
      groups.set(name, [...(groups.get(name) ?? []), b]);
    }
    if (groups.size > 1) {
      byHourBranch = [...groups].map(([name, hourBranches]) => ({ name, hourBranches }));
      core.reasons.push("출생 시각을 모르면 시간(時干) 투출 여부를 알 수 없어, 시지에 따라 격이 달라질 수 있습니다.");
    }
  }
  return { ...core, samhap, byHourBranch };
}

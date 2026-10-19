/**
 * 출생지 경도 (시청 소재지 기준, 소수 셋째 자리 ≈ 0.4초 오차).
 * 경도 보정 = (경도 − 135°) × 4분. 서울(126.978°)은 약 −32분.
 */
export interface Place {
  id: string;
  name: string;
  longitude: number;
}

export const PLACES: readonly Place[] = [
  { id: "seoul", name: "서울", longitude: 126.978 },
  { id: "busan", name: "부산", longitude: 129.076 },
  { id: "daegu", name: "대구", longitude: 128.601 },
  { id: "incheon", name: "인천", longitude: 126.705 },
  { id: "gwangju", name: "광주", longitude: 126.853 },
  { id: "daejeon", name: "대전", longitude: 127.385 },
  { id: "ulsan", name: "울산", longitude: 129.311 },
  { id: "sejong", name: "세종", longitude: 127.289 },
  { id: "suwon", name: "수원", longitude: 127.029 },
  { id: "chuncheon", name: "춘천", longitude: 127.730 },
  { id: "wonju", name: "원주", longitude: 127.920 },
  { id: "gangneung", name: "강릉", longitude: 128.876 },
  { id: "cheongju", name: "청주", longitude: 127.489 },
  { id: "cheonan", name: "천안", longitude: 127.114 },
  { id: "jeonju", name: "전주", longitude: 127.148 },
  { id: "mokpo", name: "목포", longitude: 126.392 },
  { id: "yeosu", name: "여수", longitude: 127.662 },
  { id: "andong", name: "안동", longitude: 128.729 },
  { id: "pohang", name: "포항", longitude: 129.343 },
  { id: "changwon", name: "창원", longitude: 128.681 },
  { id: "jeju", name: "제주", longitude: 126.531 },
  { id: "pyongyang", name: "평양", longitude: 125.762 },
];

export const DEFAULT_PLACE_ID = "seoul";

export function placeById(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}

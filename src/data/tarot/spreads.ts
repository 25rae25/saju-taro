import type { Spread } from "@/lib/tarot/types";

export const SPREADS: readonly Spread[] = [
  {
    id: "one",
    name: "한 장 — 오늘의 카드",
    description: "지금 가장 필요한 메시지 하나를 봅니다.",
    positions: [{ key: "message", label: "오늘의 메시지", description: "지금 상황에서 눈여겨볼 흐름" }],
  },
  {
    id: "three",
    name: "세 장 — 과거·현재·미래",
    description: "흐름이 어디서 와서 어디로 가는지 시간 순서로 봅니다.",
    positions: [
      { key: "past", label: "과거", description: "지금 상황을 만든 배경" },
      { key: "present", label: "현재", description: "지금 작용하는 핵심 흐름" },
      { key: "future", label: "미래", description: "이대로 갈 때 이어질 방향" },
    ],
  },
];

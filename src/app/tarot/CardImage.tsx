"use client";

import Image from "next/image";
import { useState } from "react";
import type { TarotCard } from "@/lib/tarot/types";

/** 웨이트–스미스 1909 원판 스캔. 파일이 없으면 이름 카드로 대신한다. */
export default function CardImage({ card, reversed = false, className = "" }: { card: TarotCard; reversed?: boolean; className?: string }) {
  const [missing, setMissing] = useState(false);
  const rotate = reversed ? "rotate-180" : "";
  if (missing) {
    return (
      <div className={`flex aspect-[7/12] flex-col items-center justify-center rounded-lg border border-line bg-tarot-soft p-3 text-center ${rotate} ${className}`}>
        <span className="font-serif text-lg text-tarot">{card.nameKo}</span>
        <span className="mt-1 text-xs text-muted">{card.nameEn}</span>
      </div>
    );
  }
  return (
    <Image
      src={`/cards/${card.id}.jpg`}
      alt={`${card.nameKo} (${card.nameEn})${reversed ? " 역방향" : ""}`}
      width={350}
      height={600}
      sizes="(max-width: 640px) 45vw, 220px"
      onError={() => setMissing(true)}
      className={`h-auto w-full rounded-lg border border-line shadow-sm ${rotate} ${className}`}
    />
  );
}

import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { computeSaju, SajuInputError } from "@/lib/saju";
import { DEFAULT_FORM, formValuesFrom, inputFrom } from "@/lib/saju/params";
import SajuForm from "./SajuForm";
import SajuResultView from "./SajuResultView";

export const metadata: Metadata = { title: "사주 명식 — 사주·타로" };

type SearchParams = PageProps<"/saju">["searchParams"];

/** 검색 파라미터 → 폼 값 + 계산 결과 (렌더링 밖에서 계산) */
async function loadSaju(searchParams: SearchParams) {
  const values = formValuesFrom(await searchParams);
  const parsed = inputFrom(values);
  await connection(); // 세운·현재 대운 표시에 요청 시각이 필요
  const now = Date.now();
  if (!parsed) return { values, now };
  if ("error" in parsed) return { values, now, error: parsed.error };
  try {
    return { values, now, result: computeSaju(parsed.input, new Date(now)) };
  } catch (e) {
    if (e instanceof SajuInputError) return { values, now, error: e.message };
    throw e;
  }
}

async function SajuView({ searchParams }: { searchParams: SearchParams }) {
  const { values, now, result, error } = await loadSaju(searchParams);
  return (
    <>
      <SajuForm initial={values} />
      {error && <p className="mt-6 rounded-lg bg-accent-soft p-4 text-sm text-accent">{error}</p>}
      {result && <SajuResultView r={result} now={now} />}
    </>
  );
}

export default function SajuPage({ searchParams }: PageProps<"/saju">) {
  return (
    <div>
      <h1 className="mb-1 font-serif text-2xl font-semibold">사주 명식</h1>
      <p className="mb-6 text-sm text-muted">
        연주는 입춘, 월주는 절입 순간 기준입니다. 일주·시주는 출생지 경도로 보정한 태양시로 계산합니다.
      </p>
      <Suspense fallback={<SajuForm initial={DEFAULT_FORM} />}>
        <SajuView searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

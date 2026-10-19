"use client";

import Form from "next/form";
import { useState } from "react";
import { PLACES } from "@/lib/saju/places";
import type { SajuFormValues } from "@/lib/saju/params";

const field = "w-full rounded-md border border-line bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none";
const label = "mb-1 block text-xs font-medium text-muted";

export default function SajuForm({ initial }: { initial: SajuFormValues }) {
  const [cal, setCal] = useState(initial.cal);
  const [unknown, setUnknown] = useState(initial.unknown);
  const [place, setPlace] = useState(initial.place);

  return (
    <Form action="/saju" className="grid grid-cols-6 gap-4 rounded-xl border border-line bg-surface p-5">
      <fieldset className="col-span-6">
        <legend className={label}>달력</legend>
        <div className="flex gap-2">
          {(["solar", "lunar"] as const).map((c) => (
            <label key={c} className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm ${cal === c ? "border-accent bg-accent-soft text-accent" : "border-line"}`}>
              <input type="radio" name="cal" value={c} checked={cal === c} onChange={() => setCal(c)} className="sr-only" />
              {c === "solar" ? "양력" : "음력"}
            </label>
          ))}
          {cal === "lunar" && (
            <label className="ml-2 flex items-center gap-1.5 text-sm">
              <input type="checkbox" name="leap" value="1" defaultChecked={initial.leap} /> 윤달
            </label>
          )}
        </div>
      </fieldset>

      <div className="col-span-2">
        <label className={label} htmlFor="y">연</label>
        <input id="y" name="y" type="number" inputMode="numeric" min={1900} max={2100} required defaultValue={initial.y} placeholder="1990" className={field} />
      </div>
      <div className="col-span-2">
        <label className={label} htmlFor="m">월</label>
        <input id="m" name="m" type="number" inputMode="numeric" min={1} max={12} required defaultValue={initial.m} placeholder="5" className={field} />
      </div>
      <div className="col-span-2">
        <label className={label} htmlFor="d">일</label>
        <input id="d" name="d" type="number" inputMode="numeric" min={1} max={31} required defaultValue={initial.d} placeholder="15" className={field} />
      </div>

      <div className="col-span-6 sm:col-span-3">
        <label className={label} htmlFor="time">출생 시각 (당시 시계 기준)</label>
        <div className="flex items-center gap-3">
          <input id="time" name="time" type="time" disabled={unknown} required={!unknown} defaultValue={initial.time} className={`${field} disabled:opacity-40`} />
          <label className="flex shrink-0 items-center gap-1.5 text-sm">
            <input type="checkbox" name="unknown" value="1" checked={unknown} onChange={(e) => setUnknown(e.target.checked)} /> 시간 모름
          </label>
        </div>
      </div>

      <fieldset className="col-span-6 sm:col-span-3">
        <legend className={label}>성별 (대운 방향)</legend>
        <div className="flex gap-4 py-2 text-sm">
          <label className="flex items-center gap-1.5"><input type="radio" name="g" value="M" defaultChecked={initial.g === "M"} /> 남</label>
          <label className="flex items-center gap-1.5"><input type="radio" name="g" value="F" defaultChecked={initial.g === "F"} /> 여</label>
        </div>
      </fieldset>

      <div className="col-span-6 sm:col-span-3">
        <label className={label} htmlFor="place">출생지 (경도 보정용)</label>
        <div className="flex gap-2">
          <select id="place" name="place" value={place} onChange={(e) => setPlace(e.target.value)} className={field}>
            {PLACES.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.longitude.toFixed(2)}°E)</option>
            ))}
            <option value="custom">직접 입력…</option>
          </select>
          {place === "custom" && (
            <input name="lon" type="number" step="0.001" min={120} max={135} required defaultValue={initial.lon} placeholder="126.98" aria-label="경도" className={`${field} w-28`} />
          )}
        </div>
      </div>

      <div className="col-span-6 sm:col-span-3">
        <label className={label} htmlFor="corr">시간 보정 (일주·시주)</label>
        <select id="corr" name="corr" defaultValue={initial.corr} className={field}>
          <option value="longitude">경도 보정 — 지방평균시 (기본)</option>
          <option value="apparent">진태양시 — 경도 + 균시차</option>
          <option value="standard">보정 없음 — 당시 표준시</option>
        </select>
      </div>

      <div className="col-span-6">
        <label className={label} htmlFor="zi">자시 기준 (23~24시 출생의 일주)</label>
        <select id="zi" name="zi" defaultValue={initial.zi} className={field}>
          <option value="23">23시에 날이 바뀜 (기본)</option>
          <option value="00">0시에 날이 바뀜 — 야자시·조자시 구분</option>
        </select>
      </div>

      <div className="col-span-6">
        <button type="submit" className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 sm:w-auto">
          명식 보기
        </button>
      </div>
    </Form>
  );
}

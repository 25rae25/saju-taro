"use client";

import Form from "next/form";
import { useState } from "react";
import { PLACES } from "@/lib/saju/places";
import type { SajuFormValues } from "@/lib/saju/params";

const field = "w-full rounded-md border border-line bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none";
const label = "mb-1 block text-xs font-medium text-muted";
const hint = "mt-1.5 text-xs leading-5 text-muted";

/** 표준시 기준 자오선(동경 135°)과 출생지 경도의 차이(분). 서울 126.98° → −32 */
const minutesFrom135 = (lon: number) => Math.round((lon - 135) * 4);

function Help({ children }: { children: React.ReactNode }) {
  return (
    <details className="mt-1 text-xs leading-5 text-muted">
      <summary className="cursor-pointer text-accent">무슨 뜻인가요?</summary>
      <div className="mt-2 grid gap-2 rounded-md bg-background p-3">{children}</div>
    </details>
  );
}

export default function SajuForm({ initial }: { initial: SajuFormValues }) {
  const [cal, setCal] = useState(initial.cal);
  const [unknown, setUnknown] = useState(initial.unknown);
  const [place, setPlace] = useState(initial.place);
  const [lonInput, setLonInput] = useState(initial.lon);
  const [corr, setCorr] = useState(initial.corr);
  const [zi, setZi] = useState(initial.zi);

  const chosen = PLACES.find((p) => p.id === place);
  const lon = chosen ? chosen.longitude : Number(lonInput);
  const shift = lonInput.trim() !== "" || chosen ? minutesFrom135(lon) : null;
  const where = chosen ? chosen.name : "입력한 경도";
  const known = shift !== null && Number.isFinite(shift);
  const longitudeHint = known
    ? `태어난 곳의 해 위치에 맞춰, 시계 시각에서 ${Math.abs(shift)}분을 ${shift < 0 ? "빼서" : "더해"} 계산합니다 (${where} 기준).`
    : "태어난 곳의 해 위치에 맞춰, 출생지 경도만큼 시계 시각을 조정해 계산합니다.";
  const apparentHint = known
    ? `시계 시각에서 ${Math.abs(shift)}분을 ${shift < 0 ? "빼고" : "더하고"}(경도 보정, ${where} 기준), 계절에 따라 해가 빠르거나 늦는 만큼(최대 약 ±16분)도 반영합니다.`
    : "출생지 경도만큼 조정하고(경도 보정), 계절에 따라 해가 빠르거나 늦는 만큼(최대 약 ±16분)도 반영합니다.";

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
        <p className={hint}>출생증명서 등에 적힌 시각 그대로 넣으세요. 서머타임(1948~51·1955~60·1987~88년)은 자동으로 뺍니다.</p>
      </div>

      <fieldset className="col-span-6 sm:col-span-3">
        <legend className={label}>성별 (대운 방향)</legend>
        <div className="flex gap-4 py-2 text-sm">
          <label className="flex items-center gap-1.5"><input type="radio" name="g" value="M" defaultChecked={initial.g === "M"} /> 남</label>
          <label className="flex items-center gap-1.5"><input type="radio" name="g" value="F" defaultChecked={initial.g === "F"} /> 여</label>
        </div>
      </fieldset>

      <div className="col-span-6">
        <label className={label} htmlFor="place">출생지 (경도 보정용)</label>
        <div className="flex gap-2">
          <select id="place" name="place" value={place} onChange={(e) => setPlace(e.target.value)} className={field}>
            {PLACES.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.longitude.toFixed(2)}°E)</option>
            ))}
            <option value="custom">직접 입력…</option>
          </select>
          {place === "custom" && (
            <input name="lon" type="number" step="0.001" min={120} max={135} required value={lonInput} onChange={(e) => setLonInput(e.target.value)} placeholder="126.98" aria-label="경도" className={`${field} w-28`} />
          )}
        </div>
      </div>

      <div className="col-span-6">
        <label className={label} htmlFor="corr">시간 보정 (일주·시주)</label>
        <select id="corr" name="corr" value={corr} onChange={(e) => setCorr(e.target.value as typeof corr)} className={field}>
          <option value="longitude">경도 보정 — 지방평균시 (기본)</option>
          <option value="apparent">진태양시 — 경도 + 균시차</option>
          <option value="standard">보정 없음 — 당시 표준시</option>
        </select>
        <p className={hint}>
          {corr === "longitude" && longitudeHint}
          {corr === "apparent" && apparentHint}
          {corr === "standard" && "시계 시각을 그대로 씁니다. 서머타임 기간이면 1시간만 뺍니다."}
        </p>
        <Help>
          <p>
            사주의 시(時)는 하루를 2시간씩 12개로 나눈 것이고, 해의 위치를 기준으로 합니다. 그런데 한국 시계(표준시)는 동경 135° 지역의 해에 맞춰져 있어서, 서울에서는 해가 시계보다 약 32분 늦게 움직입니다.
            그래서 시계로 오후 1시 10분에 태어났어도 해 기준으로는 12시 38분이라, 미시(未時)가 아니라 오시(午時)가 됩니다.
          </p>
          <p><b className="text-foreground">경도 보정 (기본)</b> — 출생지 경도만큼 시각을 조정합니다. 국내에서 가장 널리 쓰는 방식입니다.</p>
          <p><b className="text-foreground">진태양시</b> — 지구가 타원 궤도를 돌아서, 해가 정남에 오는 시각이 계절마다 최대 16분쯤 빨라지거나 늦어집니다(균시차). 이것까지 반영한 가장 엄밀한 방식이지만 쓰는 곳은 적습니다.</p>
          <p><b className="text-foreground">보정 없음</b> — 시계 시각을 그대로 씁니다. 일부 만세력·앱이 이 방식을 씁니다.</p>
          <p>연주·월주는 절기가 바뀌는 정확한 순간으로 정하므로 보정과 관계없습니다. 방식에 따라 일주·시주가 달라지면 결과 화면에서 따로 알려 드립니다.</p>
        </Help>
      </div>

      <div className="col-span-6">
        <label className={label} htmlFor="zi">자시 기준 (밤 11시~자정 출생의 일주)</label>
        <select id="zi" name="zi" value={zi} onChange={(e) => setZi(e.target.value as typeof zi)} className={field}>
          <option value="23">23시에 날이 바뀜 (기본)</option>
          <option value="00">0시에 날이 바뀜 — 야자시·조자시 구분</option>
        </select>
        <p className={hint}>
          {zi === "23" ? "밤 11시부터 다음 날로 봅니다." : "밤 11시~자정은 그날(야자시), 자정~새벽 1시는 다음 날(조자시)로 봅니다."}
          {" "}밤 11시~자정(보정한 시각 기준)에 태어난 경우가 아니면 결과는 같습니다.
        </p>
        <Help>
          <p>자시(子時)는 밤 11시부터 새벽 1시까지의 2시간입니다. 이 중 밤 11시~자정에 태어나면 날짜(일주)를 그날로 볼지 다음 날로 볼지 유파마다 다릅니다.</p>
          <p><b className="text-foreground">23시에 날이 바뀜 (기본)</b> — 하루가 자시로 시작한다고 보고, 밤 11시부터 새 날로 칩니다. 전통적인 방식입니다.</p>
          <p><b className="text-foreground">0시에 날이 바뀜</b> — 밤 11시~자정은 &lsquo;야자시(夜子時)&rsquo;로 그날, 자정~새벽 1시는 &lsquo;조자시(朝子時)&rsquo;로 다음 날로 봅니다.</p>
          <p>어느 쪽이든 시주는 같은 자시이고, 일주만 달라집니다.</p>
        </Help>
      </div>

      <div className="col-span-6">
        <button type="submit" className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 sm:w-auto">
          명식 보기
        </button>
      </div>
    </Form>
  );
}

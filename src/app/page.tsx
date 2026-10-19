import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Link href="/saju" className="group rounded-xl border border-line bg-surface p-6 hover:border-accent">
        <div className="font-serif text-4xl text-accent">四柱</div>
        <h2 className="mt-3 text-xl font-semibold">사주 명식</h2>
        <p className="mt-2 text-sm text-muted">
          양력·음력 생년월일시로 연·월·일·시주를 계산합니다. 연주는 입춘, 월주는 절입 순간 기준이며 오행·십신·12운성·대운·세운을 함께 보여 줍니다.
        </p>
      </Link>
      <Link href="/tarot" className="group rounded-xl border border-line bg-surface p-6 hover:border-tarot">
        <div className="font-serif text-4xl text-tarot">TAROT</div>
        <h2 className="mt-3 text-xl font-semibold">타로</h2>
        <p className="mt-2 text-sm text-muted">
          78장 덱을 섞어 한 장 또는 세 장(과거·현재·미래)을 뽑습니다. 카드마다 정·역방향 한국어 풀이와 웨이트 원전이 있습니다.
        </p>
      </Link>
    </div>
  );
}

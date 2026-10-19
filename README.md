# 사주·타로

사주 명식과 타로를 한곳에서 보는 웹앱(Next.js 16).

- **사주**: 양력·음력 생년월일시를 넣으면 다음을 계산한다.
  - 연주(입춘 기준)·월주(절입 기준)·일주·시주
  - 오행 분포, 십신, 지장간, 12운성, 대운, 세운
- **타로**: 웨이트–스미스 1909 덱 78장을 섞어 한 장 또는 세 장(과거·현재·미래)을 뽑는다. 정·역방향 한국어 풀이와 웨이트 원전 문장을 함께 보여 준다.

데이터 출처·계산 규칙·라이선스·검증 방법은 **[docs/DATA.md](docs/DATA.md)**에 정리했다.

## 실행

```bash
npm install
npm run dev -- -p 3100   # http://localhost:3100
npm test                 # 만세력·타로 검증 테스트
```

## 데이터 다시 만들기

```bash
npm run gen:terms   # 24절기 1899–2101 → src/data/solar-terms.json (교차 검증 포함)
npm run gen:tz      # 한국 표준시 변천 → src/data/seoul-tz.json
scripts/prepare-card-images.sh <원본 폴더>   # Commons 원판 스캔 → public/cards/*.jpg
```

## 구조

| 경로 | 내용 |
|---|---|
| `src/lib/saju/` | 만세력 계산 엔진 (`computeSaju`) |
| `src/lib/tarot/` | 카드 타입, 섞기·뽑기 |
| `src/data/` | 절기·표준시 테이블, 타로 78장·스프레드 |
| `tests/` | KASI 기준값 비교, 경계 사례, lunar-javascript 교차 검증 |
| `src/app/` | 화면: `/saju`, `/tarot`, `/tarot/cards`, `/sources` |

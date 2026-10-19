#!/bin/sh
# 웨이트–스미스 1909 원판 스캔(Wikimedia Commons "Rider-Waite tarot deck (Roses & Lilies)", 퍼블릭 도메인)을
# 앱용 크기로 줄여 public/cards/<id>.jpg 로 저장한다. macOS sips 사용.
# 사용: scripts/prepare-card-images.sh <원본 폴더: <id>.jpeg 파일들>
set -eu
SRC="$1"
OUT="$(dirname "$0")/../public/cards"
mkdir -p "$OUT"
for f in "$SRC"/*.jpeg; do
  id="$(basename "$f" .jpeg)"
  sips --resampleHeight 720 -s format jpeg -s formatOptions 62 "$f" --out "$OUT/$id.jpg" >/dev/null
done
ls "$OUT" | wc -l

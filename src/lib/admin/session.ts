/**
 * 관리자 세션 — 서명된 쿠키 한 개. DB 없이 HMAC-SHA256으로 위조를 막는다.
 *
 * 환경 변수 (.env.local, 저장소에 올리지 않음):
 *   ADMIN_USER      관리자 아이디
 *   ADMIN_PASSWORD  관리자 비밀번호
 *   ADMIN_SECRET    쿠키 서명 키 (32자 이상 무작위 문자열)
 * 셋 중 하나라도 없으면 관리자 로그인은 꺼진다.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "st_admin";
export const SESSION_SECONDS = 7 * 24 * 3600;

interface AdminEnv {
  user: string;
  password: string;
  secret: string;
}

export function adminEnv(env: Record<string, string | undefined> = process.env): AdminEnv | null {
  const user = env.ADMIN_USER, password = env.ADMIN_PASSWORD, secret = env.ADMIN_SECRET;
  if (!user || !password || !secret || secret.length < 32) return null;
  return { user, password, secret };
}

const b64url = (b: Buffer) => b.toString("base64url");

function hmac(secret: string, data: string): Buffer {
  return createHmac("sha256", secret).update(data).digest();
}

/** 길이가 달라도 시간이 새지 않게 HMAC으로 고정 길이로 바꿔 비교 */
function safeEqual(a: string, b: string, key: string): boolean {
  return timingSafeEqual(hmac(key, a), hmac(key, b));
}

export function checkCredentials(user: string, password: string, env = adminEnv()): boolean {
  if (!env) return false;
  // 둘 다 항상 비교해서 어느 쪽이 틀렸는지 시간으로 드러나지 않게 한다
  const okUser = safeEqual(user, env.user, env.secret);
  const okPass = safeEqual(password, env.password, env.secret);
  return okUser && okPass;
}

export function createSessionToken(nowMs: number, env = adminEnv()): string {
  if (!env) throw new Error("관리자 환경 변수가 설정되지 않았습니다");
  const payload = b64url(Buffer.from(JSON.stringify({ sub: "admin", exp: Math.floor(nowMs / 1000) + SESSION_SECONDS })));
  return `${payload}.${b64url(hmac(env.secret, payload))}`;
}

export function verifySessionToken(token: string | undefined, nowMs: number, env = adminEnv()): boolean {
  if (!env || !token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = hmac(env.secret, payload);
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;
  try {
    const { sub, exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return sub === "admin" && typeof exp === "number" && exp * 1000 > nowMs;
  } catch {
    return false;
  }
}

/** 로그인 후 돌아갈 경로 — 같은 사이트 안의 절대 경로만 허용 (오픈 리다이렉트 방지) */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return "/admin";
  if (next.startsWith("/admin/login")) return "/admin";
  return next;
}

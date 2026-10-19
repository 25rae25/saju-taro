/**
 * 관리자 세션 쿠키 — 서명·만료·위조, 자격 증명, 리다이렉트 경로 검증.
 */
import { describe, expect, test } from "vitest";
import { adminEnv, checkCredentials, createSessionToken, safeNextPath, SESSION_SECONDS, verifySessionToken } from "@/lib/admin/session";

const env = adminEnv({ ADMIN_USER: "admin", ADMIN_PASSWORD: "pw-1234", ADMIN_SECRET: "x".repeat(40) })!;
const other = adminEnv({ ADMIN_USER: "admin", ADMIN_PASSWORD: "pw-1234", ADMIN_SECRET: "y".repeat(40) })!;
const NOW = Date.parse("2026-10-19T00:00:00Z");

describe("환경 변수", () => {
  test("셋 다 있어야 켜짐, 서명 키는 32자 이상", () => {
    expect(env).not.toBeNull();
    expect(adminEnv({ ADMIN_USER: "a", ADMIN_PASSWORD: "b" })).toBeNull();
    expect(adminEnv({ ADMIN_USER: "a", ADMIN_PASSWORD: "b", ADMIN_SECRET: "short" })).toBeNull();
  });
  test("설정이 없으면 로그인·세션 모두 거부", () => {
    expect(checkCredentials("admin", "pw-1234", null)).toBe(false);
    expect(verifySessionToken(createSessionToken(NOW, env), NOW, null)).toBe(false);
  });
});

describe("자격 증명", () => {
  test("맞는 아이디·비밀번호만 통과", () => {
    expect(checkCredentials("admin", "pw-1234", env)).toBe(true);
    expect(checkCredentials("admin", "pw-123", env)).toBe(false);
    expect(checkCredentials("Admin", "pw-1234", env)).toBe(false);
    expect(checkCredentials("", "", env)).toBe(false);
  });
});

describe("세션 토큰", () => {
  const token = createSessionToken(NOW, env);
  test("발급 직후 유효, 7일 뒤 만료", () => {
    expect(verifySessionToken(token, NOW, env)).toBe(true);
    expect(verifySessionToken(token, NOW + (SESSION_SECONDS - 60) * 1000, env)).toBe(true);
    expect(verifySessionToken(token, NOW + (SESSION_SECONDS + 1) * 1000, env)).toBe(false);
  });
  test("다른 키로 서명했거나 내용을 바꾸면 거부", () => {
    expect(verifySessionToken(token, NOW, other)).toBe(false);
    const [payload, sig] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ sub: "admin", exp: 9_999_999_999 })).toString("base64url");
    expect(verifySessionToken(`${forged}.${sig}`, NOW, env)).toBe(false);
    expect(verifySessionToken(`${payload}.`, NOW, env)).toBe(false);
    expect(verifySessionToken(payload, NOW, env)).toBe(false);
    expect(verifySessionToken("garbage", NOW, env)).toBe(false);
    expect(verifySessionToken(undefined, NOW, env)).toBe(false);
  });
});

describe("로그인 후 이동 경로", () => {
  test.each([
    ["/sources", "/sources"],
    ["/admin", "/admin"],
    ["/sources?x=1", "/sources?x=1"],
    ["", "/admin"],
    ["https://evil.example", "/admin"],
    ["//evil.example", "/admin"],
    ["/\\evil.example", "/admin"],
    ["/admin/login", "/admin"],
  ])("%s → %s", (input, expected) => expect(safeNextPath(input)).toBe(expected));
});

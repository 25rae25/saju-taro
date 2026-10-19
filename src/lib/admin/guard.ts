import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "./session";

/** 서버 컴포넌트에서 관리자 세션을 다시 확인 (proxy는 1차 확인일 뿐이다) */
export async function requireAdmin(returnTo: string): Promise<void> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  await connection(); // 만료 확인에 요청 시각이 필요
  if (!verifySessionToken(token, Date.now())) {
    redirect(`/admin/login?next=${encodeURIComponent(returnTo)}`);
  }
}

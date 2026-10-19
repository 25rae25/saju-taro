"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, SESSION_SECONDS, adminEnv, checkCredentials, createSessionToken, safeNextPath } from "@/lib/admin/session";

export interface LoginState {
  error?: string;
}

export async function login(_prev: LoginState | undefined, formData: FormData): Promise<LoginState> {
  if (!adminEnv()) return { error: "관리자 계정이 설정되지 않았습니다 (.env.local의 ADMIN_USER·ADMIN_PASSWORD·ADMIN_SECRET)." };

  const user = String(formData.get("user") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(user, password)) {
    await new Promise((r) => setTimeout(r, 800)); // 무차별 대입 속도 늦추기
    return { error: "아이디 또는 비밀번호가 맞지 않습니다." };
  }

  (await cookies()).set(ADMIN_COOKIE, createSessionToken(Date.now()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  redirect(safeNextPath(String(formData.get("next") ?? "")));
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/");
}

import { cookies } from "next/headers";

const SESSION_COOKIE = "documenter_session";

export function encodeSession(user) {
  return Buffer.from(JSON.stringify(user)).toString("base64");
}

export function decodeSession(token) {
  try {
    return JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

export function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSession(token);
}

export { SESSION_COOKIE };

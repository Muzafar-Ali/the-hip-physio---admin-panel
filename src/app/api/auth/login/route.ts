// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const result = await fetch("https://the-hip-physio-api.onrender.com/api/user/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!result.ok) {
    return new NextResponse(await result.text(), { status: result.status });
  }

  // Suppose backend responds { token: "..." }
  console.log('result', await result.json())
  const { token } = await result.json();

  // Set cookie for your frontend domain (vercel.app)
  const res = NextResponse.json({ success: true });
  res.cookies.set("aToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

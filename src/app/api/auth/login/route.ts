import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Read once
  const body = await req.json();

  // Pass forward
  const r = await fetch("https://the-hip-physio-api.onrender.com/api/user/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const errorText = await r.text();   // text() once only
    return new NextResponse(errorText, { status: r.status });
  }

  // parse once
  const data = await r.json();
  const token = data.token;
  console.log('Data', data);
  
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

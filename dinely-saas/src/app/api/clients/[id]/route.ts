import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ message: "Client detail API is not configured yet." }, { status: 501 });
}

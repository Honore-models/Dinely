import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ message: "Menu item API is not configured yet." }, { status: 501 });
}

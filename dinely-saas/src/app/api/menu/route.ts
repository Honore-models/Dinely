import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ data: [] });
}

export function POST() {
  return NextResponse.json({ message: "Menu API is not configured yet." }, { status: 501 });
}

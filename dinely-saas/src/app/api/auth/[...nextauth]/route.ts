import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ message: "Authentication is not configured yet." }, { status: 501 });
}

export function POST() {
  return NextResponse.json({ message: "Authentication is not configured yet." }, { status: 501 });
}

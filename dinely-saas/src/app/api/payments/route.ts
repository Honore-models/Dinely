import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json({ message: "Payments API is not configured yet." }, { status: 501 });
}

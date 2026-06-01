import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json({ message: "Upload API is not configured yet." }, { status: 501 });
}

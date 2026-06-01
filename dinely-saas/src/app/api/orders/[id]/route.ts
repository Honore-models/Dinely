import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ message: "Order detail API is not configured yet." }, { status: 501 });
}

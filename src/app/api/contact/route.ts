// src/app/api/contact/route.ts
// Optional server-side contact endpoint (can also use client-side Firestore directly)
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Contact form submissions are handled client-side via Firebase.
    // This route exists as a fallback / for server-side processing if needed.
    // The ContactSection component writes directly to Firestore.
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

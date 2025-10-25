import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { name, email, password, role, captchaToken } = await req.json();

    // Verify captcha
    if (!captchaToken) {
      return NextResponse.json(
        { message: "Captcha is required" },
        { status: 400 }
      );
    }

    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
      }
    );

    const captchaData = await verifyRes.json();
    if (!captchaData.success) {
      return NextResponse.json(
        { message: "Captcha verification failed" },
        { status: 400 }
      );
    }

    // Validate fields
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    return NextResponse.json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  }
}

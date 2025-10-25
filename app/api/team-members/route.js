import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: list all team members
export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      include: { team: true, user: true },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

// POST: add new team member
export async function POST(req) {
  try {
    const { teamId, userId } = await req.json();

    if (!teamId || !userId) {
      return NextResponse.json(
        { error: "Team ID and User ID are required" },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.create({
      data: { teamId, userId },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}

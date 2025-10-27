import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

// ✅ Get all teams with members
export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
// ✅ Add new member to a team
export async function POST(req) {
  try {
    const { name, memberIds } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    // ✅ Create the team first
    const team = await prisma.team.create({
      data: { name },
    });

    // ✅ Add members if provided
    if (Array.isArray(memberIds) && memberIds.length > 0) {
      await prisma.teamMember.createMany({
        data: memberIds.map((userId) => ({
          teamId: team.id,
          userId,
        })),
      });
    }

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}

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
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}
// ✅ Add new member to a team
export async function POST(req) {
    try {
      const { teamId, userId } = await req.json();
  
      if (!teamId || !userId) {
        return NextResponse.json(
          { error: "teamId and userId are required" },
          { status: 400 }
        );
      }
  
      // Check if already exists
      const exists = await prisma.teamMember.findFirst({
        where: { teamId, userId },
      });
      if (exists) {
        return NextResponse.json(
          { error: "User is already a member of this team" },
          { status: 400 }
        );
      }
  
      const newMember = await prisma.teamMember.create({
        data: { teamId, userId },
        include: { user: true }, // ✅ include user so UI can display name immediately
      });
  
      return NextResponse.json(newMember, { status: 201 });
    } catch (error) {
      console.error("Error adding member:", error);
      return NextResponse.json(
        { error: "Failed to add member" },
        { status: 500 }
      );
    }
  }

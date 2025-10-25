import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Get single team by ID
export async function GET(_, { params }) {
  try {
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        members: { include: { user: true } },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

// ✅ Update team (name + members)
export async function PATCH(req, { params }) {
  try {
    const body = await req.json();
    const { name } = body;
    const memberIds = body.memberIds || body.members; // 👈 handle both keys

    if (!name) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    // Update team and reset members
    const updatedTeam = await prisma.team.update({
      where: { id: params.id },
      data: {
        name,
        members: {
          deleteMany: {}, // remove old members
          create: memberIds?.map((userId) => ({ userId })) || [],
        },
      },
      include: {
        members: { include: { user: true } },
      },
    });

    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}
// ✅ Remove member from team
export async function DELETE(_, { params }) {
    try {
      await prisma.teamMember.delete({ where: { id: params.id } });
      return NextResponse.json({ message: "Member removed successfully" });
    } catch (error) {
      console.error("Error deleting member:", error);
      return NextResponse.json(
        { error: "Failed to delete member" },
        { status: 500 }
      );
    }
  }
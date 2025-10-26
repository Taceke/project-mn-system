import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

// GET single team member
export async function GET(_, { params }) {
  try {
    const member = await prisma.teamMember.findUnique({
      where: { id: params.id },
      include: { team: true, user: true },
    });
    if (!member)
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    return NextResponse.json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json(
      { error: "Failed to fetch member" },
      { status: 500 }
    );
  }
}

// DELETE team member
export async function DELETE(_, { params }) {
  try {
    await prisma.teamMember.delete({
      where: { id: params.id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    );
  }
}

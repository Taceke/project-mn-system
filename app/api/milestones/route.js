import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all milestones
export async function GET() {
  try {
    const milestones = await prisma.milestone.findMany({
      include: { project: true }, // get project info too
    });
    return NextResponse.json(milestones);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch milestones" },
      { status: 500 }
    );
  }
}

// POST create a milestone
export async function POST(req) {
  try {
    const body = await req.json();
    const milestone = await prisma.milestone.create({
      data: {
        name: body.name,
        dueDate: new Date(body.dueDate),
        projectId: body.projectId,
      },
    });
    return NextResponse.json(milestone);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create milestone" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET milestone by id
export async function GET(req, { params }) {
  try {
    const milestone = await prisma.milestone.findUnique({
      where: { id: params.id },
      include: { project: true },
    });
    if (!milestone) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(milestone);
  } catch (error) {
    console.error("GET milestone error:", error);
    return NextResponse.json(
      { error: "Failed to fetch milestone" },
      { status: 500 }
    );
  }
}

// PUT update milestone
export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const updated = await prisma.milestone.update({
      where: { id: params.id },
      data: {
        name: body.name,
        dueDate: new Date(body.dueDate),
        isCompleted: body.isCompleted,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT milestone error:", error);
    return NextResponse.json(
      { error: "Failed to update milestone" },
      { status: 500 }
    );
  }
}

// DELETE milestone
export async function DELETE(req, { params }) {
  try {
    await prisma.milestone.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE milestone error:", error);
    return NextResponse.json(
      { error: "Failed to delete milestone" },
      { status: 500 }
    );
  }
}

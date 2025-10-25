import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Get resource by ID
export async function GET(_, { params }) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
      include: { project: true, user: true },
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Error fetching resource:", error);
    return NextResponse.json({ error: "Failed to fetch resource" }, { status: 500 });
  }
}

// ✅ Update resource
export async function PATCH(req, { params }) {
  try {
    const { projectId, userId, allocationPercent } = await req.json();

    const updated = await prisma.resource.update({
      where: { id: params.id },
      data: { projectId, userId, allocationPercent },
      include: { project: true, user: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating resource:", error);
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
  }
}

// ✅ Delete resource
export async function DELETE(_, { params }) {
  try {
    await prisma.resource.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}

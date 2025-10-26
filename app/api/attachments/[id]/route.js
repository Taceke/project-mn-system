import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

// ✅ PUT (edit attachment metadata)
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { projectId, taskId, uploadedById } = await req.json();

    const updated = await prisma.attachment.update({
      where: { id },
      data: {
        projectId: projectId || null,
        taskId: taskId || null,
        uploadedById: uploadedById || null,
      },
      include: {
        uploadedBy: true,
        project: true,
        task: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating attachment:", error);
    return NextResponse.json({ error: "Failed to update attachment" }, { status: 500 });
  }
}

// ✅ DELETE
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await prisma.attachment.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting attachment:", error);
    return NextResponse.json({ error: "Failed to delete attachment" }, { status: 500 });
  }
}

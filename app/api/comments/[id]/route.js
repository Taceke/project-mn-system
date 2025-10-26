import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

// ✅ PATCH (Update comment)
export async function PATCH(req, context) {
  const { params } = await context;
  const { id } = params;

  try {
    const { content, userId, projectId, taskId } = await req.json();

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content,
        userId,
        projectId: projectId || null,
        taskId: taskId || null,
      },
      include: {
        user: true,
        project: true,
        task: true,
        attachments: true, // still include attachments for display
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

// ✅ DELETE comment
export async function DELETE(req, context) {
  try {
    const { params } = await context;
    const { id } = params;

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}

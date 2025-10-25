import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import { writeFile } from "fs/promises";

// ✅ GET all comments
export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: true,
        project: true,
        task: true,
        attachments: true, // 👈 include attachments
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const content = formData.get("content");
    const userId = formData.get("userId");
    const projectId = formData.get("projectId");
    const taskId = formData.get("taskId");
    const file = formData.get("file");

    if (!content || !userId) {
      return NextResponse.json(
        { error: "Content and User ID are required" },
        { status: 400 }
      );
    }

    // 💾 Create the comment first
    const newComment = await prisma.comment.create({
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
        attachments: true, // include attachments
      },
    });

    // 📁 Handle file upload if provided
    if (file && typeof file === "object" && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(process.cwd(), "public/uploads", file.name);
      await writeFile(filePath, buffer);

      // Save attachment and connect to comment
      const attachment = await prisma.attachment.create({
        data: {
          fileName: file.name,
          filePath: `/uploads/${file.name}`,
          uploadedById: userId,
          commentId: newComment.id, // link attachment to comment
          projectId: projectId || null,
          taskId: taskId || null,
        },
      });

      // Return the comment including this new attachment
      newComment.attachments = [attachment];
    }

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

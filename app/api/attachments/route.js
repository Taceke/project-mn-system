import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

// ✅ GET all attachments
export async function GET() {
  try {
    const attachments = await prisma.attachment.findMany({
      include: {
        project: true,
        task: true,
        uploadedBy: true,
        attachments: true, // <-- include attachments here
      },
      orderBy: { uploadedAt: "desc" },
    });
    return NextResponse.json(attachments);
  } catch (error) {
    console.error("Error fetching attachments:", error);
    return NextResponse.json(
      { error: "Failed to fetch attachments" },
      { status: 500 }
    );
  }
}

// ✅ POST (upload new file)
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const projectId = formData.get("projectId");
    const taskId = formData.get("taskId");
    const uploadedById = formData.get("uploadedById");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
    if (!uploadedById) {
      return NextResponse.json(
        { error: "Uploader is required" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, buffer);

    const saved = await prisma.attachment.create({
      data: {
        fileName: file.name,
        filePath: `/uploads/${file.name}`,
        projectId: projectId || null,
        taskId: taskId || null,
        uploadedById,
      },
      include: {
        uploadedBy: true,
        project: true,
        task: true,
      },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Error uploading attachment:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

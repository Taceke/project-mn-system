import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ GET all attachments
export async function GET() {
  try {
    const attachments = await prisma.attachment.findMany({
      include: {
        project: true,
        task: true,
        uploadedBy: true,
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

// ✅ POST (upload new file to Cloudinary)
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

    // ✅ Convert file to buffer (needed for Cloudinary)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "attachments", // Optional: create folder in Cloudinary
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    // ✅ Save file info in database
    const saved = await prisma.attachment.create({
      data: {
        fileName: file.name,
        filePath: uploadResult.secure_url, // Cloudinary URL instead of local path
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

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import fs from "fs";
// import path from "path";
// export const runtime = "nodejs";

// // ✅ GET all attachments
// export async function GET() {
//   try {
//     const attachments = await prisma.attachment.findMany({
//       include: {
//         project: true,
//         task: true,
//         uploadedBy: true,
//         attachments: true, // <-- include attachments here
//       },
//       orderBy: { uploadedAt: "desc" },
//     });
//     return NextResponse.json(attachments);
//   } catch (error) {
//     console.error("Error fetching attachments:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch attachments" },
//       { status: 500 }
//     );
//   }
// }

// // ✅ POST (upload new file)
// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file");
//     const projectId = formData.get("projectId");
//     const taskId = formData.get("taskId");
//     const uploadedById = formData.get("uploadedById");

//     if (!file || typeof file === "string") {
//       return NextResponse.json({ error: "File is required" }, { status: 400 });
//     }
//     if (!uploadedById) {
//       return NextResponse.json(
//         { error: "Uploader is required" },
//         { status: 400 }
//       );
//     }

//     const uploadDir = path.join(process.cwd(), "public", "uploads");
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//     const buffer = Buffer.from(await file.arrayBuffer());
//     const filePath = path.join(uploadDir, file.name);
//     fs.writeFileSync(filePath, buffer);

//     const saved = await prisma.attachment.create({
//       data: {
//         fileName: file.name,
//         filePath: `/uploads/${file.name}`,
//         projectId: projectId || null,
//         taskId: taskId || null,
//         uploadedById,
//       },
//       include: {
//         uploadedBy: true,
//         project: true,
//         task: true,
//       },
//     });

//     return NextResponse.json(saved, { status: 201 });
//   } catch (error) {
//     console.error("Error uploading attachment:", error);
//     return NextResponse.json(
//       { error: "Failed to upload file" },
//       { status: 500 }
//     );
//   }
// }

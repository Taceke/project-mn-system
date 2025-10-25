import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Get all resources
export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        project: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

// ✅ Create a new resource
export async function POST(req) {
  try {
    const { projectId, userId, allocationPercent } = await req.json();

    if (!projectId || !userId) {
      return NextResponse.json(
        { error: "Project ID and User ID are required" },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.create({
      data: {
        projectId,
        userId,
        allocationPercent: allocationPercent || 100,
      },
      include: {
        project: true,
        user: true,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

// GET dependencies of a task
export async function GET(req, { params }) {
  try {
    const dependencies = await prisma.taskDependency.findMany({
      where: { taskId: params.id },
      include: { depends: true }, // include the parent task info
    });
    return NextResponse.json(dependencies);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch dependencies" }, { status: 500 });
  }
}

// POST create a dependency
export async function POST(req, { params }) {
  try {
    const { dependsOn } = await req.json();
    if (!dependsOn) {
      return NextResponse.json({ error: "dependsOn is required" }, { status: 400 });
    }

    const dependency = await prisma.taskDependency.create({
      data: {
        taskId: params.id,
        dependsOn,
      },
      include: { depends: true },
    });

    return NextResponse.json(dependency);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create dependency" }, { status: 500 });
  }
}

// DELETE a dependency
export async function DELETE(req, { params }) {
  try {
    const { id } = await req.json(); // the dependency id
    if (!id) return NextResponse.json({ error: "Dependency id required" }, { status: 400 });

    await prisma.taskDependency.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete dependency" }, { status: 500 });
  }
}

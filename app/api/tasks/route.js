import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

// ✅ GET all tasks
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        project: true,
        assignee: true,
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// ✅ POST create task
export async function POST(req) {
  try {
    const body = await req.json();

    const newTask = await prisma.task.create({
      data: {
        projectId: body.projectId,
        title: body.title,
        description: body.description || null,
        status: body.status || "TO_DO",
        priority: body.priority || "MEDIUM",
        startDate: body.startDate ? new Date(body.startDate) : null,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        estimatedHours: body.estimatedHours || 0,
        spentHours: body.spentHours || 0,
        deliverableName: body.deliverableName || null,
        assigneeId: body.assigneeId || null,
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

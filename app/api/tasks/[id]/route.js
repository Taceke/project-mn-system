import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

// ✅ GET task by id
export async function GET(req, { params }) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: { project: true, assignee: true },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

// ✅ UPDATE task
export async function PUT(req, { params }) {
  try {
    const body = await req.json();

    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        startDate: body.startDate ? new Date(body.startDate) : null,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        estimatedHours: body.estimatedHours,
        spentHours: body.spentHours,
        deliverableName: body.deliverableName,
        assigneeId: body.assigneeId || null,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// ✅ DELETE task
export async function DELETE(req, { params }) {
  try {
    await prisma.task.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}

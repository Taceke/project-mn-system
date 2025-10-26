import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

// GET all timesheets or by taskId
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    const timesheets = await prisma.timesheet.findMany({
      where: taskId ? { taskId } : {},
      include: { task: true, user: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(timesheets);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch timesheets" },
      { status: 500 }
    );
  }
}

// POST create a new timesheet
export async function POST(req) {
  try {
    const { taskId, userId, minutes, description, isBillable, date } =
      await req.json();

    // Corrected validation
 if (!taskId || !userId || minutes === undefined || minutes === null || isNaN(minutes)) {
  return NextResponse.json(
    { error: "taskId, userId, and valid minutes are required" },
    { status: 400 }
  );
}

      

    const timesheet = await prisma.timesheet.create({
      data: {
        taskId,
        userId,
        minutes,
        description,
        isBillable: isBillable ?? true,
        date: date ? new Date(date) : new Date(),
      },
      include: { task: true, user: true },
    });

    return NextResponse.json(timesheet);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create timesheet" },
      { status: 500 }
    );
  }
}

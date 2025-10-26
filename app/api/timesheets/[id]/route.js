import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

export async function GET(req, { params }) {
  try {
    const timesheet = await prisma.timesheet.findUnique({
      where: { id: params.id },
      include: { task: true, user: true },
    });
    if (!timesheet)
      return NextResponse.json({ error: "Timesheet not found" }, { status: 404 });
    return NextResponse.json(timesheet);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch timesheet" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const data = await req.json();
    const updated = await prisma.timesheet.update({
      where: { id: params.id },
      data: {
        minutes: data.minutes,
        description: data.description,
        isBillable: data.isBillable,
        date: data.date ? new Date(data.date) : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update timesheet" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await prisma.timesheet.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete timesheet" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next"; // Must import from next-auth/next
import { authOptions } from "@/lib/auth";
export const runtime = "nodejs";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ include: { owner: true } });
    return NextResponse.json(projects);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // ⚠ App Router compatible usage: just call getServerSession(authOptions)
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { name, description, startDate, dueDate, budgetedCost } = data;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: session.user.id,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        budgetedCost: Number(budgetedCost) || 0,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

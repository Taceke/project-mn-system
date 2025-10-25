import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// ✅ Utility to check Admin role
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

// -----------------------------
// GET single project by id
// -----------------------------
export async function GET(req, { params }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { owner: true, milestones: true, tasks: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(`❌ Error fetching project [${params.id}]:`, error.message);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

// -----------------------------
// UPDATE project
// -----------------------------
export async function PUT(req, { params }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        startDate: body.startDate ? new Date(body.startDate) : null,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        budgetedCost: body.budgetedCost ? Number(body.budgetedCost) : 0,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error(`❌ Error updating project [${params.id}]:`, error.message);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// -----------------------------
// DELETE project
// -----------------------------
export async function DELETE(req, { params }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(`❌ Error deleting project [${params.id}]:`, error.message);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}

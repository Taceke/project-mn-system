import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

export async function GET() {
  const risks = await prisma.risk.findMany({
    include: {
      project: true,
      reportedBy: true,
    },
  });
  return NextResponse.json(risks);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      projectId,
      title,
      description,
      severity,
      mitigationPlan,
      reportedById,
    } = body;

    if (!projectId || !title || !severity || !reportedById) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newRisk = await prisma.risk.create({
      data: {
        projectId,
        title,
        description,
        severity,
        mitigationPlan,
        reportedById,
      },
    });

    return NextResponse.json(newRisk, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import {prisma} from "@/lib/prisma"; // make sure your prisma client is exported from lib/prisma.js
export const runtime = "nodejs";


export async function GET(req, { params }) {
  const { id } = params;

  try {
    const risk = await prisma.risk.findUnique({
      where: { id },
      include: { project: true, reportedBy: true },
    });

    if (!risk)
      return new Response(JSON.stringify({ error: "Risk not found" }), {
        status: 404,
      });

    return new Response(JSON.stringify(risk), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch risk" }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await prisma.risk.delete({ where: { id } });
    return new Response(
      JSON.stringify({ message: "Risk deleted successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to delete risk" }), {
      status: 500,
    });
  }
}
export async function PATCH(req, { params }) {
    const { id } = params;
  
    try {
      const body = await req.json();
      const { title, description, severity, mitigationPlan, status } = body;
  
      const updatedRisk = await prisma.risk.update({
        where: { id },
        data: { title, description, severity, mitigationPlan, status },
      });
  
      return new Response(JSON.stringify(updatedRisk), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error(err);
      return new Response(
        JSON.stringify({ error: "Failed to update risk" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  
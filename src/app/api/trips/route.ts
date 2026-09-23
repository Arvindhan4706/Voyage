import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const trip = await prisma.trip.create({
      data: {
        source: data.source || "Unknown",
        destination: data.destination || "Unknown",
        budget: parseFloat(data.estimated_budget?.toString().replace(/\D/g, "") || "0"),
        days: data.days?.length || 1,
        itineraryData: JSON.stringify(data)
      }
    });

    return NextResponse.json({ id: trip.id, success: true });
  } catch (error) {
    console.error("Failed to save trip:", error);
    return NextResponse.json({ error: "Failed to save trip" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = (session.user as any).id;
    
    let profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      // Return a default profile structure if it doesn't exist
      return NextResponse.json({
        userId,
        budgetPreference: 25000,
        travelStyle: "adventure",
        favoriteDestinations: ["Goa", "Manali"],
        searchHistory: [],
      });
    }

    return NextResponse.json({
      ...profile,
      favoriteDestinations: JSON.parse(profile.favoriteDestinations || "[]"),
      searchHistory: JSON.parse(profile.searchHistory || "[]"),
    });
  } catch (error) {
    console.error("Profile GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = (session.user as any).id;

    const body = await req.json();

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        budgetPreference: body.budgetPreference,
        travelStyle: body.travelStyle,
        favoriteDestinations: JSON.stringify(body.favoriteDestinations || []),
        searchHistory: JSON.stringify(body.searchHistory || []),
      },
      create: {
        userId,
        budgetPreference: body.budgetPreference || 25000,
        travelStyle: body.travelStyle || "adventure",
        favoriteDestinations: JSON.stringify(body.favoriteDestinations || []),
        searchHistory: JSON.stringify(body.searchHistory || []),
      },
    });

    return NextResponse.json({
      ...profile,
      favoriteDestinations: JSON.parse(profile.favoriteDestinations),
      searchHistory: JSON.parse(profile.searchHistory),
    });
  } catch (error) {
    console.error("Profile PUT Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destinationId = searchParams.get('destinationId');
    const hotelId = searchParams.get('hotelId');
    
    // Fetch reviews from the database
    const reviews = await prisma.review.findMany({
      where: {
        ...(destinationId ? { destinationId } : {}),
        ...(hotelId ? { hotelId } : {}),
      },
      include: {
        user: {
          select: {
            name: true,
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Reviews GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please log in to leave a review." }, { status: 401 });
    }
    
    const userId = (session.user as any).id;
    const body = await req.json();

    if (!body.reviewText || typeof body.rating !== 'number') {
      return NextResponse.json({ error: "Review text and rating are required." }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        destinationId: body.destinationId || null,
        hotelId: body.hotelId || null,
        reviewText: body.reviewText,
        rating: body.rating,
      },
      include: {
        user: {
          select: {
            name: true,
            id: true
          }
        }
      }
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Reviews POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

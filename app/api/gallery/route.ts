import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error("GET /api/gallery:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, category } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required" },
        { status: 400 }
      );
    }

    const image = await prisma.galleryImage.create({
      data: {
        imageUrl: imageUrl.trim(),
        category: category?.trim() || null,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("POST /api/gallery:", error);
    return NextResponse.json(
      { error: "Failed to add image" },
      { status: 500 }
    );
  }
}

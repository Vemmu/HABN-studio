import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");

    const where: { isActive: boolean; branchId?: string } = { isActive: true };
    if (branchId) where.branchId = branchId;

    const services = await prisma.service.findMany({
      where,
      orderBy: { name: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("GET /api/services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, duration, branchId } = body;

    if (!name || price === undefined || duration === undefined || !branchId) {
      return NextResponse.json(
        { error: "Name, price, duration, and branch are required" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        price: Number(price),
        duration: Number(duration),
        branchId,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("POST /api/services:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

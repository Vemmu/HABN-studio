import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        branch: true,
        appointmentServices: {
          include: { service: true },
        },
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("PATCH /api/appointments/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

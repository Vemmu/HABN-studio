import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        user: true,
        branch: true,
        appointmentServices: {
          include: { service: true },
        },
      },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("GET /api/appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, serviceIds, branchId, date } = body;

    const ids = Array.isArray(serviceIds) ? serviceIds : serviceIds ? [serviceIds] : [];

    if (!name || !phone || !date || !branchId || ids.length === 0) {
      return NextResponse.json(
        { error: "Name, phone, branch, at least one service, and date are required" },
        { status: 400 }
      );
    }

    const branch = await prisma.branch.findUnique({
      where: { id: branchId, isActive: true },
    });
    if (!branch) {
      return NextResponse.json(
        { error: "Invalid or inactive branch" },
        { status: 400 }
      );
    }

    const services = await prisma.service.findMany({
      where: { id: { in: ids }, branchId, isActive: true },
    });

    if (services.length !== ids.length) {
      return NextResponse.json(
        { error: "One or more services are invalid or inactive" },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { phone: phone.trim() },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name.trim(),
          phone: phone.trim(),
        },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: name.trim() },
      });
    }

    const appointmentDate = new Date(date);

    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        branchId,
        date: appointmentDate,
        status: "PENDING",
        appointmentServices: {
          create: ids.map((serviceId: string) => ({ serviceId })),
        },
      },
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
    console.error("POST /api/appointments:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

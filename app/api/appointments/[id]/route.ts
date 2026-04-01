import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatAppointmentDate, normalizeWhatsAppPhone, sendWhatsAppMessage } from "@/lib/whatsapp";
import { formatDuration, formatPrice } from "@/lib/utils";

function intervalsOverlap(
  firstStart: Date,
  firstDurationMinutes: number,
  secondStart: Date,
  secondDurationMinutes: number
) {
  const firstEnd = firstStart.getTime() + firstDurationMinutes * 60_000;
  const secondEnd = secondStart.getTime() + secondDurationMinutes * 60_000;

  return firstStart.getTime() < secondEnd && secondStart.getTime() < firstEnd;
}

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

    const currentAppointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        user: true,
        branch: true,
        appointmentServices: {
          include: { service: true },
        },
      },
    });

    if (!currentAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    const totalPrice = currentAppointment.appointmentServices.reduce(
      (sum, item) => sum + item.service.price,
      0
    );
    const totalDuration = currentAppointment.appointmentServices.reduce(
      (sum, item) => sum + item.service.duration,
      0
    );

    if (status === "CONFIRMED") {
      const dayStart = new Date(currentAppointment.date);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(currentAppointment.date);
      dayEnd.setHours(23, 59, 59, 999);

      const confirmedAppointments = await prisma.appointment.findMany({
        where: {
          id: { not: currentAppointment.id },
          branchId: currentAppointment.branchId,
          status: "CONFIRMED",
          date: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
        include: {
          appointmentServices: {
            include: { service: true },
          },
        },
      });

      const hasConflict = confirmedAppointments.some((appointment) => {
        const existingDuration = appointment.appointmentServices.reduce(
          (sum, item) => sum + item.service.duration,
          0
        );

        return intervalsOverlap(
          new Date(currentAppointment.date),
          totalDuration,
          new Date(appointment.date),
          existingDuration
        );
      });

      if (hasConflict) {
        return NextResponse.json(
          {
            error:
              "This appointment overlaps with another confirmed appointment for the same branch.",
          },
          { status: 409 }
        );
      }
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

    if (appointment.user?.phone) {
      const to = normalizeWhatsAppPhone(appointment.user.phone);
      const serviceNames = appointment.appointmentServices
        .map(({ service }) => service.name)
        .join(", ");

      if (status === "CONFIRMED") {
        await sendWhatsAppMessage({
          to,
          body: `Your appointment is confirmed.\n\nBranch: ${appointment.branch.name}\nServices: ${serviceNames}\nTotal: ${formatPrice(totalPrice)} | ${formatDuration(totalDuration)}\nDate: ${formatAppointmentDate(new Date(appointment.date))}\n\nPlease come to the studio on time. We look forward to seeing you.`,
        });
      }

      if (status === "CANCELLED") {
        await sendWhatsAppMessage({
          to,
          body: `Your appointment could not be confirmed and is now cancelled.\n\nBranch: ${appointment.branch.name}\nServices: ${serviceNames}\nTotal: ${formatPrice(totalPrice)} | ${formatDuration(totalDuration)}\nRequested time: ${formatAppointmentDate(new Date(appointment.date))}\n\nPlease send HI if you want to book another slot.`,
        });
      }
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("PATCH /api/appointments/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

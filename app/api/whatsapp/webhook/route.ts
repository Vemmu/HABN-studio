import { NextRequest, NextResponse } from "next/server";
import { WhatsAppFlowState } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  extractIncomingMessage,
  formatAppointmentDate,
  getIncomingSelectionValue,
  normalizeWhatsAppPhone,
  sendWhatsAppButtons,
  sendWhatsAppList,
  sendWhatsAppMessage,
} from "@/lib/whatsapp";
import { formatDuration, formatPrice, TIME_SLOTS } from "@/lib/utils";

export const runtime = "nodejs";

const DATE_TIMEZONE = "Asia/Kolkata";
function parseSelectedServiceIds(serialized: string) {
  return serialized
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function serializeSelectedServiceIds(serviceIds: string[]) {
  return Array.from(new Set(serviceIds)).join(",");
}

function getUpcomingDates() {
  const dates: { id: string; title: string; description: string }[] = [];
  const now = new Date();

  for (let offset = 1; offset <= 7; offset += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + offset);
    const isoDate = date.toISOString().slice(0, 10);
    const title = new Intl.DateTimeFormat("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      timeZone: DATE_TIMEZONE,
    }).format(date);

    dates.push({
      id: `date:${isoDate}`,
      title,
      description: `Select ${isoDate}`,
    });
  }

  return dates;
}

function getTimeSlots(dateId: string, page: number) {
  const pageSize = 9;
  const start = page * pageSize;
  const rows = TIME_SLOTS.slice(start, start + pageSize).map((time) => ({
    id: `time:${dateId}:${time}`,
    title: time,
    description: "Select this time slot",
  }));

  if (start + pageSize < TIME_SLOTS.length) {
    rows.push({
      id: `timepage:${dateId}:${page + 1}`,
      title: "More timings",
      description: "Show more time slots",
    });
  }

  return rows;
}

function buildAppointmentDate(dateId: string, time: string) {
  const appointmentDate = new Date(`${dateId}T${time}:00+05:30`);
  return Number.isNaN(appointmentDate.getTime()) ? null : appointmentDate;
}

function getDayRange(dateId: string) {
  return {
    start: new Date(`${dateId}T00:00:00+05:30`),
    end: new Date(`${dateId}T23:59:59.999+05:30`),
  };
}

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

async function getSelectedServices(branchId: string, selectedServiceIds: string[]) {
  return prisma.service.findMany({
    where: {
      id: { in: selectedServiceIds },
      branchId,
      isActive: true,
    },
    orderBy: { name: "asc" },
  });
}

function getServiceTotals(
  services: Array<{ price: number; duration: number; name: string }>
) {
  return {
    totalPrice: services.reduce((sum, service) => sum + service.price, 0),
    totalDuration: services.reduce((sum, service) => sum + service.duration, 0),
    serviceNames: services.map((service) => service.name).join(", "),
  };
}

async function getAvailableTimeRows(
  branchId: string,
  dateId: string,
  totalDuration: number,
  page: number
) {
  const { start, end } = getDayRange(dateId);
  const confirmedAppointments = await prisma.appointment.findMany({
    where: {
      branchId,
      status: "CONFIRMED",
      date: {
        gte: start,
        lte: end,
      },
    },
    include: {
      appointmentServices: {
        include: { service: true },
      },
    },
    orderBy: { date: "asc" },
  });

  const availableSlots = TIME_SLOTS.filter((time) => {
    const slotDate = buildAppointmentDate(dateId, time);

    if (!slotDate) {
      return false;
    }

    const slotEnd = slotDate.getTime() + totalDuration * 60_000;
    if (slotEnd > end.getTime() + 1) {
      return false;
    }

    return confirmedAppointments.every((appointment) => {
      const existingDuration = appointment.appointmentServices.reduce(
        (sum, item) => sum + item.service.duration,
        0
      );

      return !intervalsOverlap(slotDate, totalDuration, new Date(appointment.date), existingDuration);
    });
  }).map((time) => ({
    id: `time:${dateId}:${time}`,
    title: time,
    description: `Available for ${formatDuration(totalDuration)}`,
  }));

  const pageSize = 9;
  const startIndex = page * pageSize;
  const rows = availableSlots.slice(startIndex, startIndex + pageSize);

  if (startIndex + pageSize < availableSlots.length) {
    rows.push({
      id: `timepage:${dateId}:${page + 1}`,
      title: "More timings",
      description: "Show more available slots",
    });
  }

  return { rows, totalAvailable: availableSlots.length };
}

async function isSlotAvailable(
  branchId: string,
  dateId: string,
  time: string,
  totalDuration: number
) {
  const { start, end } = getDayRange(dateId);
  const slotDate = buildAppointmentDate(dateId, time);

  if (!slotDate) {
    return false;
  }

  const slotEnd = slotDate.getTime() + totalDuration * 60_000;
  if (slotEnd > end.getTime() + 1) {
    return false;
  }

  const confirmedAppointments = await prisma.appointment.findMany({
    where: {
      branchId,
      status: "CONFIRMED",
      date: {
        gte: start,
        lte: end,
      },
    },
    include: {
      appointmentServices: {
        include: { service: true },
      },
    },
  });

  return confirmedAppointments.every((appointment) => {
    const existingDuration = appointment.appointmentServices.reduce(
      (sum, item) => sum + item.service.duration,
      0
    );

    return !intervalsOverlap(slotDate, totalDuration, new Date(appointment.date), existingDuration);
  });
}

async function resetToBranchSelection(sessionId: string, to: string) {
  await prisma.whatsAppSession.update({
    where: { id: sessionId },
    data: {
      state: WhatsAppFlowState.AWAITING_BRANCH,
      selectedBranchId: null,
      selectedServiceIds: "",
      pendingCustomerName: null,
      pendingDate: null,
    },
  });

  await sendBranchMenu(to);
}

async function sendBranchMenu(to: string) {
  const branches = await prisma.branch.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  if (branches.length === 0) {
    await sendWhatsAppMessage({
      to,
      body: "No branches are available right now. Please try again later.",
    });
    return;
  }

  await sendWhatsAppList(
    to,
    "Welcome to HABN Studio. Select your branch to start booking.",
    "Choose branch",
    branches.map((branch) => ({
      id: `branch:${branch.id}`,
      title: branch.name.slice(0, 24),
      description: branch.address.slice(0, 72),
    })),
    "HABN Studio",
    "Send MENU anytime to restart."
  );
}

async function sendServiceMenu(to: string, branchId: string, selectedCount = 0) {
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  const services = await prisma.service.findMany({
    where: { branchId, isActive: true },
    orderBy: { name: "asc" },
  });

  if (!branch || services.length === 0) {
    await sendWhatsAppMessage({
      to,
      body: "No active services are available for that branch. Send MENU to choose again.",
    });
    return;
  }

  await sendWhatsAppList(
    to,
    `Select a service for ${branch.name}. You can add multiple services one by one.`,
    "Choose service",
    services.map((service) => ({
      id: `service:${service.id}`,
      title: service.name.slice(0, 24),
      description: `Rs.${service.price} | ${service.duration} mins`.slice(0, 72),
    })),
    "Services",
    selectedCount > 0 ? `${selectedCount} service(s) selected` : "Pick your services"
  );
}

async function sendDateMenu(to: string) {
  await sendWhatsAppList(
    to,
    "Select your appointment date.",
    "Choose date",
    getUpcomingDates(),
    "Appointment date",
    "Next 7 days"
  );
}

async function sendTimeMenu(
  to: string,
  branchId: string,
  dateId: string,
  totalDuration: number,
  page = 0
) {
  const { rows, totalAvailable } = await getAvailableTimeRows(
    branchId,
    dateId,
    totalDuration,
    page
  );

  if (totalAvailable === 0) {
    await sendWhatsAppButtons(
      to,
      `No time slots are currently available on ${dateId} for ${formatDuration(totalDuration)}. Please choose another date.`,
      [{ id: "date:change", title: "Choose Date" }]
    );
    return;
  }

  await sendWhatsAppList(
    to,
    `Select your appointment time for ${dateId}. Duration needed: ${formatDuration(totalDuration)}.`,
    "Choose time",
    rows,
    "Appointment time",
    `${totalAvailable} available slot(s)`
  );
}

async function handleIncomingText(from: string, incomingValue: string) {
  const normalizedPhone = normalizeWhatsAppPhone(from);
  const text = incomingValue.trim();
  const lowerText = text.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { phone: normalizedPhone },
  });

  const session = await prisma.whatsAppSession.upsert({
    where: { phone: normalizedPhone },
    update: existingUser ? { userId: existingUser.id } : {},
    create: {
      phone: normalizedPhone,
      userId: existingUser?.id,
    },
  });

  if (["menu", "restart", "hi", "hello", "start"].includes(lowerText)) {
    await resetToBranchSelection(session.id, from);
    return;
  }

  if (session.state === WhatsAppFlowState.IDLE) {
    await resetToBranchSelection(session.id, from);
    return;
  }

  if (session.state === WhatsAppFlowState.AWAITING_BRANCH) {
    if (!text.startsWith("branch:")) {
      await sendBranchMenu(from);
      return;
    }

    const branchId = text.replace("branch:", "");
    const selectedBranch = await prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!selectedBranch || !selectedBranch.isActive) {
      await sendBranchMenu(from);
      return;
    }

    await prisma.whatsAppSession.update({
      where: { id: session.id },
      data: {
        state: WhatsAppFlowState.AWAITING_SERVICE,
        selectedBranchId: selectedBranch.id,
        selectedServiceIds: "",
        pendingCustomerName: null,
        pendingDate: null,
      },
    });

    await sendServiceMenu(from, selectedBranch.id, 0);
    return;
  }

  if (session.state === WhatsAppFlowState.AWAITING_SERVICE) {
    const selectedServiceIds = parseSelectedServiceIds(session.selectedServiceIds);

    if (text === "services:add_more") {
      if (!session.selectedBranchId) {
        await resetToBranchSelection(session.id, from);
        return;
      }

      await sendServiceMenu(from, session.selectedBranchId, selectedServiceIds.length);
      return;
    }

    if (text === "services:restart") {
      await resetToBranchSelection(session.id, from);
      return;
    }

    if (text === "services:done") {
      if (selectedServiceIds.length === 0) {
        if (session.selectedBranchId) {
          await sendServiceMenu(from, session.selectedBranchId, 0);
        }
        return;
      }

      const selectedServices = await prisma.service.findMany({
        where: { id: { in: selectedServiceIds } },
        orderBy: { name: "asc" },
      });
      const { totalPrice, totalDuration } = getServiceTotals(selectedServices);

      await prisma.whatsAppSession.update({
        where: { id: session.id },
        data: { state: WhatsAppFlowState.AWAITING_NAME },
      });

      await sendWhatsAppMessage({
        to: from,
        body: `Selected services:\n${selectedServices
          .map((service, index) => `${index + 1}. ${service.name}`)
          .join("\n")}\n\nTotal: ${formatPrice(totalPrice)} | ${formatDuration(totalDuration)}\n\nPlease reply with your full name.`,
      });
      return;
    }

    if (!session.selectedBranchId || !text.startsWith("service:")) {
      if (session.selectedBranchId) {
        await sendServiceMenu(from, session.selectedBranchId, selectedServiceIds.length);
      } else {
        await resetToBranchSelection(session.id, from);
      }
      return;
    }

    const selectedServiceId = text.replace("service:", "");
    const selectedService = await prisma.service.findFirst({
      where: {
        id: selectedServiceId,
        branchId: session.selectedBranchId,
        isActive: true,
      },
    });

    if (!selectedService) {
      await sendServiceMenu(from, session.selectedBranchId, selectedServiceIds.length);
      return;
    }

    const updatedIds = serializeSelectedServiceIds([
      ...selectedServiceIds,
      selectedService.id,
    ]);

    await prisma.whatsAppSession.update({
      where: { id: session.id },
      data: {
        selectedServiceIds: updatedIds,
        pendingDate: null,
      },
    });

    await sendWhatsAppButtons(from, `Added: ${selectedService.name}`, [
      { id: "services:add_more", title: "Add More" },
      { id: "services:done", title: "Continue" },
      { id: "services:restart", title: "Restart" },
    ]);
    return;
  }

  if (session.state === WhatsAppFlowState.AWAITING_NAME) {
    const customerName = text.replace(/\s+/g, " ").trim();

    if (customerName.length < 2) {
      await sendWhatsAppMessage({
        to: from,
        body: "Please enter a valid full name.",
      });
      return;
    }

    await prisma.whatsAppSession.update({
      where: { id: session.id },
      data: {
        state: WhatsAppFlowState.AWAITING_DATE,
        pendingCustomerName: customerName,
      },
    });

    await sendDateMenu(from);
    return;
  }

  if (session.state === WhatsAppFlowState.AWAITING_DATE) {
    if (text === "date:change") {
      await sendDateMenu(from);
      return;
    }

    if (!text.startsWith("date:")) {
      await sendDateMenu(from);
      return;
    }

    const dateId = text.replace("date:", "");
    const selectedDate = getUpcomingDates().find((date) => date.id === text);

    if (!selectedDate) {
      await sendDateMenu(from);
      return;
    }

    await prisma.whatsAppSession.update({
      where: { id: session.id },
      data: {
        state: WhatsAppFlowState.AWAITING_TIME,
        pendingDate: dateId,
      },
    });

    if (!session.selectedBranchId) {
      await resetToBranchSelection(session.id, from);
      return;
    }

    const selectedServiceIds = parseSelectedServiceIds(session.selectedServiceIds);
    const selectedServices = await getSelectedServices(
      session.selectedBranchId,
      selectedServiceIds
    );

    if (selectedServices.length !== selectedServiceIds.length || selectedServices.length === 0) {
      await sendWhatsAppMessage({
        to: from,
        body: "One of the selected services is no longer available. Please select services again.",
      });
      await prisma.whatsAppSession.update({
        where: { id: session.id },
        data: {
          state: WhatsAppFlowState.AWAITING_SERVICE,
          selectedServiceIds: "",
          pendingDate: null,
        },
      });
      await sendServiceMenu(from, session.selectedBranchId, 0);
      return;
    }

    const { totalDuration } = getServiceTotals(selectedServices);
    await sendTimeMenu(from, session.selectedBranchId, dateId, totalDuration, 0);
    return;
  }

  if (session.state === WhatsAppFlowState.AWAITING_TIME) {
    if (text === "date:change") {
      await prisma.whatsAppSession.update({
        where: { id: session.id },
        data: {
          state: WhatsAppFlowState.AWAITING_DATE,
          pendingDate: null,
        },
      });
      await sendDateMenu(from);
      return;
    }

    if (!session.selectedBranchId) {
      await resetToBranchSelection(session.id, from);
      return;
    }

    const selectedServiceIds = parseSelectedServiceIds(session.selectedServiceIds);
    const selectedServices = await getSelectedServices(
      session.selectedBranchId,
      selectedServiceIds
    );

    if (selectedServices.length !== selectedServiceIds.length || selectedServices.length === 0) {
      await sendWhatsAppMessage({
        to: from,
        body: "One of the selected services is no longer available. Please select services again.",
      });
      await prisma.whatsAppSession.update({
        where: { id: session.id },
        data: {
          state: WhatsAppFlowState.AWAITING_SERVICE,
          selectedServiceIds: "",
          pendingDate: null,
        },
      });
      await sendServiceMenu(from, session.selectedBranchId, 0);
      return;
    }

    const { totalPrice, totalDuration, serviceNames } = getServiceTotals(selectedServices);

    if (text.startsWith("timepage:")) {
      const pageMatch = text.match(/^timepage:(\d{4}-\d{2}-\d{2}):(\d+)$/);

      if (pageMatch) {
        await sendTimeMenu(
          from,
          session.selectedBranchId,
          pageMatch[1],
          totalDuration,
          Number(pageMatch[2])
        );
        return;
      }
    }

    if (!text.startsWith("time:")) {
      if (session.pendingDate) {
        await sendTimeMenu(
          from,
          session.selectedBranchId,
          session.pendingDate,
          totalDuration,
          0
        );
      } else {
        await sendDateMenu(from);
      }
      return;
    }

    const timeMatch = text.match(/^time:(\d{4}-\d{2}-\d{2}):(\d{2}:\d{2})$/);
    const appointmentDate = timeMatch
      ? buildAppointmentDate(timeMatch[1], timeMatch[2])
      : null;

    if (!appointmentDate || appointmentDate.getTime() < Date.now()) {
      if (session.pendingDate) {
        await sendTimeMenu(
          from,
          session.selectedBranchId,
          session.pendingDate,
          totalDuration,
          0
        );
      } else {
        await sendDateMenu(from);
      }
      return;
    }

    if (!session.selectedBranchId || selectedServiceIds.length === 0 || !session.pendingCustomerName) {
      await resetToBranchSelection(session.id, from);
      return;
    }

    const [branch, availableRows, slotStillAvailable] = await Promise.all([
      prisma.branch.findUnique({
        where: { id: session.selectedBranchId },
      }),
      getAvailableTimeRows(session.selectedBranchId, timeMatch![1], totalDuration, 0),
      isSlotAvailable(
        session.selectedBranchId,
        timeMatch![1],
        timeMatch![2],
        totalDuration
      ),
    ]);

    if (!branch || !branch.isActive) {
      await sendWhatsAppMessage({
        to: from,
        body: "That branch or one of the selected services is no longer available. Let's start again.",
      });
      await resetToBranchSelection(session.id, from);
      return;
    }

    if (!slotStillAvailable && availableRows.totalAvailable > 0) {
      await sendWhatsAppMessage({
        to: from,
        body: "That time slot is no longer available. Please choose another available time.",
      });
      await sendTimeMenu(from, session.selectedBranchId, timeMatch![1], totalDuration, 0);
      return;
    }

    if (!slotStillAvailable && availableRows.totalAvailable === 0) {
      await sendWhatsAppButtons(
        from,
        "No slots are available now for that date. Please choose another date.",
        [{ id: "date:change", title: "Choose Date" }]
      );
      return;
    }

    let user = existingUser;

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: session.pendingCustomerName,
          phone: normalizedPhone,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name: session.pendingCustomerName },
      });
    }

    await prisma.appointment.create({
      data: {
        userId: user.id,
        branchId: branch.id,
        date: appointmentDate,
        status: "PENDING",
        appointmentServices: {
          create: selectedServices.map((service) => ({ serviceId: service.id })),
        },
      },
    });

    await prisma.whatsAppSession.update({
      where: { id: session.id },
      data: {
        userId: user.id,
        state: WhatsAppFlowState.IDLE,
        selectedBranchId: null,
        selectedServiceIds: "",
        pendingCustomerName: null,
        pendingDate: null,
      },
    });

    await sendWhatsAppMessage({
      to: from,
      body: `Your appointment request has been sent.\n\nName: ${user.name}\nBranch: ${branch.name}\nServices: ${serviceNames}\nTotal: ${formatPrice(totalPrice)} | ${formatDuration(totalDuration)}\nRequested time: ${formatAppointmentDate(appointmentDate)}\nStatus: Pending admin confirmation\n\nPlease wait for admin confirmation. We will message you again once it is confirmed.`,
    });
  }
}

export async function GET(request: NextRequest) {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (!verifyToken) {
    console.error("Missing WHATSAPP_VERIFY_TOKEN");
    return NextResponse.json(
      { error: "Server is missing WHATSAPP_VERIFY_TOKEN" },
      { status: 500 }
    );
  }

  if (mode === "subscribe" && token === verifyToken && challenge) {
    console.log("WhatsApp webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    console.log("Incoming WhatsApp payload:", JSON.stringify(payload, null, 2));

    const message = extractIncomingMessage(payload);

    if (!message?.from) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const incomingText = getIncomingSelectionValue(message);

    if (!incomingText) {
      await sendWhatsAppMessage({
        to: message.from,
        body: "Please use the WhatsApp options shown in chat. Send HI to start booking.",
      });
      return NextResponse.json({ received: true }, { status: 200 });
    }

    await handleIncomingText(message.from, incomingText);

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("POST /api/whatsapp/webhook:", error);
    return NextResponse.json(
      { error: "Failed to process WhatsApp webhook" },
      { status: 500 }
    );
  }
}

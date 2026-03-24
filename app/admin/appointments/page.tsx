import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppointmentsManager from "@/components/admin/AppointmentsManager";
import { redirect } from "next/navigation";

export default async function AdminAppointmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const branchId = (session.user as any).branchId as string | null;
  const isSuperAdmin = (session.user as any).role === "SUPER_ADMIN";

  const appointments = await prisma.appointment.findMany({
    where: branchId ? { branchId } : {},
    include: {
      user: true,
      branch: true,
      appointmentServices: {
        include: { service: true },
      },
    },
    orderBy: { date: "desc" },
  });

  const serialized = appointments.map((a) => ({
    ...a,
    date: a.date.toISOString(),
    user: a.user,
    branch: a.branch,
    appointmentServices: a.appointmentServices.map((as) => ({
      service: as.service,
    })),
  }));

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-8">
        Appointments Management
      </h1>
      <AppointmentsManager
        initialAppointments={serialized}
        showBranch={isSuperAdmin}
      />
    </div>
  );
}

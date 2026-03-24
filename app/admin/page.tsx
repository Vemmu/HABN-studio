import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Scissors, Calendar, Image, Star, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const isSuperAdmin = (session.user as any).role === "SUPER_ADMIN";
  const branchId = (session.user as any).branchId as string | null;

  const whereAppointments = branchId ? { branchId } : {};
  const whereServices = branchId ? { branchId } : {};

  const [branches, appointments, services, pendingAppointments, revenueData] = await Promise.all([
    isSuperAdmin ? prisma.branch.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }) : [],
    prisma.appointment.findMany({
      where: whereAppointments,
      include: {
        user: true,
        branch: true,
        appointmentServices: { include: { service: true } },
      },
      orderBy: { date: "desc" },
      take: 100,
    }),
    prisma.service.count({ where: whereServices }),
    prisma.appointment.count({ where: { ...whereAppointments, status: "PENDING" } }),
    prisma.appointment.findMany({
      where: { ...whereAppointments, status: "CONFIRMED" },
      include: { appointmentServices: { include: { service: true } } },
    }),
  ]);

  const totalRevenue = revenueData.reduce((sum, a) => {
    const appointmentTotal = a.appointmentServices.reduce((s, as) => s + as.service.price, 0);
    return sum + appointmentTotal;
  }, 0);

  const revenueByBranch = isSuperAdmin
    ? await prisma.appointment.groupBy({
        by: ["branchId"],
        where: { status: "CONFIRMED" },
        _count: true,
      })
    : [];

  const branchRevenue =
    isSuperAdmin && revenueByBranch.length > 0
      ? await Promise.all(
          revenueByBranch.map(async (r) => {
            const branch = await prisma.branch.findUnique({ where: { id: r.branchId } });
            const appointments = await prisma.appointment.findMany({
              where: { branchId: r.branchId, status: "CONFIRMED" },
              include: { appointmentServices: { include: { service: true } } },
            });
            const rev = appointments.reduce(
              (s, a) => s + a.appointmentServices.reduce((ss, as) => ss + as.service.price, 0),
              0
            );
            return { name: branch?.name || "Unknown", revenue: rev, count: r._count };
          })
        )
      : [];

  const [galleryCount, reviewsCount] = isSuperAdmin
    ? await Promise.all([prisma.galleryImage.count(), prisma.review.count()])
    : [0, 0];

  const stats = [
    { label: "Services", count: services, href: "/admin/services", icon: Scissors, color: "bg-primary-100 text-primary-600" },
    { label: "Appointments", count: appointments.length, href: "/admin/appointments", icon: Calendar, color: "bg-blue-100 text-blue-600" },
    ...(isSuperAdmin
      ? [
          { label: "Gallery Images", count: galleryCount, href: "/admin/gallery", icon: Image, color: "bg-green-100 text-green-600" },
          { label: "Reviews", count: reviewsCount, href: "/admin/reviews", icon: Star, color: "bg-amber-100 text-amber-600" },
        ]
      : []),
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">
        Dashboard
      </h1>
      <p className="text-stone-500 mb-8">
        {isSuperAdmin ? "Super Admin" : (session.user as any).branchName}
      </p>

      <div className="mb-8 p-4 bg-primary-50 border border-primary-200 rounded-xl">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-primary-600" size={28} />
          <div>
            <p className="text-2xl font-bold text-stone-800">{formatPrice(totalRevenue)}</p>
            <p className="text-sm text-stone-600">
              Total revenue {isSuperAdmin ? "(all branches)" : "(this branch)"}
            </p>
          </div>
        </div>
      </div>

      {isSuperAdmin && branchRevenue.length > 0 && (
        <div className="mb-8 p-4 bg-stone-50 rounded-xl border border-stone-200">
          <h3 className="font-semibold text-stone-800 mb-4">Revenue by branch</h3>
          <div className="space-y-3">
            {branchRevenue.map((b) => (
              <div key={b.name} className="flex justify-between items-center">
                <span className="text-stone-700">{b.name}</span>
                <span className="font-semibold text-primary-600">
                  {formatPrice(b.revenue)} ({b.count} bookings)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingAppointments > 0 && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800">
            <strong>{pendingAppointments}</strong> appointment(s) pending confirmation.{" "}
            <Link href="/admin/appointments" className="underline font-medium">
              View appointments →
            </Link>
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="bg-white rounded-xl border border-stone-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex p-3 rounded-lg ${stat.color} mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-2xl font-bold text-stone-800">{stat.count}</p>
            <p className="text-stone-600">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

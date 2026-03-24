import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReviewsManager from "@/components/admin/ReviewsManager";
import { redirect } from "next/navigation";

export default async function AdminReviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = reviews.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-8">
        Reviews Management
      </h1>
      <ReviewsManager initialReviews={serialized} />
    </div>
  );
}

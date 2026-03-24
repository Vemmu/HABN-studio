import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GalleryManager from "@/components/admin/GalleryManager";
import { redirect } from "next/navigation";

export default async function AdminGalleryPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-8">
        Gallery Management
      </h1>
      <GalleryManager initialImages={images} />
    </div>
  );
}

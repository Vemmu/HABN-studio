import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProductsManager from "@/components/admin/ProductsManager";
import { redirect } from "next/navigation";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-8">
        Products Management
      </h1>
      <p className="text-stone-600 mb-6">
        Manage products shown on the public site. Customers can see these at branches.
      </p>
      <ProductsManager initialProducts={products} />
    </div>
  );
}

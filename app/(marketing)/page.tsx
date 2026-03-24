import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/sections/HeroSection";
import OurVision from "@/components/sections/OurVision";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import GallerySection from "@/components/sections/GallerySection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import BookingSection from "@/components/sections/BookingSection";
import ContactSection from "@/components/sections/ContactSection";
import ProductsSection from "@/components/sections/ProductsSection";

export const dynamic = "force-dynamic";

async function getPageData() {
  const branches = await prisma.branch.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
  const firstBranchId = branches[0]?.id;

  const [services, reviews, galleryImages, products] = await Promise.all([
    firstBranchId
      ? prisma.service.findMany({
          where: { isActive: true, branchId: firstBranchId },
          orderBy: { name: "asc" },
        })
      : Promise.resolve([]),
    prisma.review.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, description: true, imageUrl: true },
    }),
  ]);
  return { branches, services: services || [], reviews, galleryImages, products };
}

export default async function HomePage() {
  const { branches, services, reviews, galleryImages, products } = await getPageData();

  return (
    <>
      <HeroSection />
      <OurVision />
      <AboutSection />
      <ServicesSection services={services} />
      <GallerySection images={galleryImages} />
      <ProductsSection products={products} />
      <ReviewsSection reviews={reviews} />
      <BookingSection branches={branches} />
      <ContactSection branches={branches} />
    </>
  );
}

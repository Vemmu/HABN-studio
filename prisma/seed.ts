import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hashedAdmin = () => bcrypt.hash("admin123", 10);
const hashedBranch = () => bcrypt.hash("branch123", 10);

async function main() {
  const adminPass = await hashedAdmin();
  const branchPass = await hashedBranch();

  // Ensure 3 branches exist
  const defaultBranchId = "00000000-0000-0000-0000-000000000001";
  const branches = [
    {
      id: defaultBranchId,
      name: "HABN Studio - Maddilapalem",
      address: "Maddilapalem, Visakhapatnam, Andhra Pradesh",
      lat: 17.739118369896975,
      lng: 83.3229493633054,
      phone: "+91 98765 43210",
      email: "maddilapalem@habnstudio.com",
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      name: "HABN Studio - Dwarakanagar",
      address: "Dwarakanagar, Visakhapatnam, Andhra Pradesh",
      lat: 17.7312,
      lng: 83.3089,
      phone: "+91 98765 43211",
      email: "dwarakanagar@habnstudio.com",
    },
    {
      id: "00000000-0000-0000-0000-000000000003",
      name: "HABN Studio - MVP Colony",
      address: "MVP Colony, Visakhapatnam, Andhra Pradesh",
      lat: 17.7425,
      lng: 83.3356,
      phone: "+91 98765 43212",
      email: "mvpcolony@habnstudio.com",
    },
  ];

  for (const b of branches) {
    await prisma.branch.upsert({
      where: { id: b.id },
      update: { name: b.name, address: b.address, lat: b.lat, lng: b.lng, phone: b.phone, email: b.email },
      create: b,
    });
  }

  // Super Admin
  await prisma.admin.upsert({
    where: { email: "admin@habnstudio.com" },
    update: { password: adminPass, role: "SUPER_ADMIN", branchId: null },
    create: {
      email: "admin@habnstudio.com",
      password: adminPass,
      role: "SUPER_ADMIN",
      branchId: null,
    },
  });

  // Branch Admins (one per branch)
  const branchAdmins = [
    { email: "maddilapalem@habnstudio.com", branchId: defaultBranchId },
    { email: "dwarakanagar@habnstudio.com", branchId: "00000000-0000-0000-0000-000000000002" },
    { email: "mvpcolony@habnstudio.com", branchId: "00000000-0000-0000-0000-000000000003" },
  ];
  for (const ba of branchAdmins) {
    await prisma.admin.upsert({
      where: { email: ba.email },
      update: { password: branchPass, role: "BRANCH_ADMIN", branchId: ba.branchId },
      create: {
        email: ba.email,
        password: branchPass,
        role: "BRANCH_ADMIN",
        branchId: ba.branchId,
      },
    });
  }

  // Services (per branch - create for each branch if none exist)
  const services = [
    { name: "Hair Cut", description: "Professional haircut", price: 200, duration: 30 },
    { name: "Hair Colour", description: "Full hair colouring", price: 800, duration: 60 },
    { name: "Facial", description: "Complete facial treatment", price: 1200, duration: 90 },
    { name: "Eyebrows", description: "Eyebrow shaping", price: 50, duration: 10 },
    { name: "Face Cleanup", description: "Deep face cleanup", price: 500, duration: 40 },
    { name: "Grooming", description: "Beard trim and styling", price: 300, duration: 45 },
    { name: "Hair Spa", description: "Relaxing hair spa", price: 1500, duration: 90 },
    { name: "Bleach", description: "Face bleach", price: 600, duration: 45 },
  ];

  for (const branch of branches) {
    const count = await prisma.service.count({ where: { branchId: branch.id } });
    if (count === 0) {
      await prisma.service.createMany({
        data: services.map((s) => ({ ...s, branchId: branch.id })),
      });
    }
  }

  // Reviews (Google-style)
  const reviews = [
    { name: "Priya S.", rating: 5, comment: "Best salon in Maddilapalem! Always satisfied with my haircut." },
    { name: "Rahul K.", rating: 5, comment: "Great service and friendly staff. Highly recommend." },
    { name: "Anitha M.", rating: 4, comment: "Good facial treatment. Will visit again." },
    { name: "Suresh P.", rating: 5, comment: "Professional grooming. Worth every rupee." },
    { name: "Lakshmi R.", rating: 5, comment: "Love the hair colour results. Amazing work!" },
  ];

  const existingReviews = await prisma.review.count();
  if (existingReviews === 0) {
    await prisma.review.createMany({ data: reviews });
  }

  // Gallery placeholder images
  const galleryImages = [
    { imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400", category: "Haircuts" },
    { imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400", category: "Makeup" },
    { imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400", category: "Facials" },
    { imageUrl: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400", category: "Salon Interior" },
    { imageUrl: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400", category: "Haircuts" },
    { imageUrl: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400", category: "Salon Interior" },
    { imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a3816a63b8?w=400", category: "Styling" },
    { imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400", category: "Beauty" },
  ];

  const existingGallery = await prisma.galleryImage.count();
  if (existingGallery === 0) {
    await prisma.galleryImage.createMany({ data: galleryImages });
  }

  // Products (available at branches)
  const products = [
    { name: "Argan Hair Oil", description: "Nourishing argan oil for healthy, glossy hair. Reduces frizz and adds shine. Apply to damp or dry hair.", imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c600ae6?w=400" },
    { name: "Keratin Shampoo", description: "Professional-grade keratin shampoo. Strengthens hair and restores protein balance. For damaged or over-processed hair.", imageUrl: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=400" },
    { name: "Hydrating Face Cream", description: "Lightweight daily moisturiser with hyaluronic acid. Keeps skin soft and hydrated without feeling oily.", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400" },
    { name: "Smoothing Hair Serum", description: "Heat-protectant serum that tames flyaways and adds silkiness. Ideal before blow-drying or straightening.", imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400" },
    { name: "Clay Face Mask", description: "Deep-cleansing clay mask for oily and combination skin. Draws out impurities and minimises pores.", imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400" },
    { name: "Beard Oil", description: "Conditioning beard oil with natural oils. Softens beard hair and nourishes the skin underneath.", imageUrl: "https://images.unsplash.com/photo-1631730486602-281ba37e0fbb?w=400" },
    { name: "Colour-Safe Conditioner", description: "Sulphate-free conditioner for colour-treated hair. Extends colour life and prevents fading.", imageUrl: "https://images.unsplash.com/photo-1571875257727-25656652af6b?w=400" },
    { name: "Sunscreen SPF 50", description: "Broad-spectrum sunscreen with non-greasy formula. Protects against UVA/UVB. Suitable for all skin types.", imageUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400" },
  ];

  const existingProducts = await prisma.product.count();
  if (existingProducts === 0) {
    await prisma.product.createMany({ data: products });
  }

  console.log("Seed completed successfully!");
  console.log("Super Admin: admin@habnstudio.com / admin123");
  console.log("Branch Admins: maddilapalem@habnstudio.com, dwarakanagar@habnstudio.com, mvpcolony@habnstudio.com / branch123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

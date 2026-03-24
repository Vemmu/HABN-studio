import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HABN Studio Salon | Best Salon in Maddilapalem, Visakhapatnam",
  description:
    "HABN Studio - Premium hair salon in Maddilapalem, Visakhapatnam. Haircuts, facials, grooming, hair colour & more. Book your appointment online. Rated 4.9/5.",
  keywords:
    "haircut visakhapatnam, best salon maddilapalem, beauty salon vizag, HABN Studio, salon visakhapatnam",
  openGraph: {
    title: "HABN Studio Salon Visakhapatnam",
    description: "Premium salon in Maddilapalem, Visakhapatnam. Book your appointment today.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

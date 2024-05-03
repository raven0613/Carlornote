import type { Metadata, ResolvingMetadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./imageLoading.css";
import Providers from "@/components/Providers";
import Auth from "@/components/Auth";
import SharedComponents from "@/components/SharedComponents";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
}

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Providers>
          <Header />
          <Auth>
            <SharedComponents>
              {children}
            </SharedComponents>
            <Footer />
          </Auth>
        </Providers>
      </body>
    </html >
  );
}
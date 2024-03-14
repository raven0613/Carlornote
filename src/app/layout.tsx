import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./imageLoading.css";
import Providers from "@/components/Providers";
import Auth from "@/components/Auth";
import SharedComponents from "@/components/SharedComponents";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cardoo",
  description: "Create your decks, Cardoo your cards",
  verification: { google: "T698cdzTe6isNHm_JUoM2fQDaN-RvxIU2SIMG5J4M8g" }
};
export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <Auth>
            <SharedComponents>
              {children}
            </SharedComponents>
          </Auth>
        </Providers>
      </body>
    </html >
  );
}
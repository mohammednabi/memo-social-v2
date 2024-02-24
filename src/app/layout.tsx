import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import RootLayoutProvider from "./components/RootLayoutProvider";
import StoreContextProvider from "@/providers/StoreContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MEMO SOCIAL",
  description: "social media web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" id="proot">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <RootLayoutProvider>
            <StoreContextProvider>{children}</StoreContextProvider>
          </RootLayoutProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

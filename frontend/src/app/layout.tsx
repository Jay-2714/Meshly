import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/components/ReduxProvider";
import { PropsWithChildren } from "react";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`}>
        <ReduxProvider>
          <main className="flex flex-col min-h-screen h-screen">
            {children}
          </main>
        </ReduxProvider>
        <Toaster position="bottom-right" toastOptions={{ duration: 2500 }} />
      </body>
    </html>
  );
}

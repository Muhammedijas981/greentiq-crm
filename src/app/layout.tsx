import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import QueryProvider from "@/providers/query-provider";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Advanced CRM Dashboard",
  description: "Customer management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", "dark", inter.className, "font-sans", geist.variable)}>
      <body className="h-full bg-[#0a0f1c] text-slate-200 flex overflow-hidden">
        <QueryProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-auto bg-[#0a0f1c]">
              {children}
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}

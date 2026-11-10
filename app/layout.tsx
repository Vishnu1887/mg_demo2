import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QuantumWarpCanvas } from "@/components/QuantumWarpCanvas";

export const metadata: Metadata = {
  title: "MGSolutions | Enterprise Multi-Division Platform",
  description: "Unified enterprise ecosystem integrating OrginTech (Cloud & AI), MGSolutions EdTech (Learning & Bootcamps), and BBS (Business Services & Advisory).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#040711] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-white relative">
        {/* Global Living Animated Cybernetic Background */}
        <QuantumWarpCanvas />
        <AuthProvider>
          <Navbar />
          <main className="flex-1 relative z-10">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

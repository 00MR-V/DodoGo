// src/app/dashboard/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/sections/navbar";

export const metadata = {
  title: "Dashboard | VoyAIge",
  description: "Your personalized travel planner",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen flex flex-col">
        {/* Navbar across all dashboard pages */}
        <Navbar />

        {/* Dashboard content */}
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}

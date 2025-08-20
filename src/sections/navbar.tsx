"use client";

import { ModeToggle } from "@/components/theme-switcher";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";

export default function Navbar() {
  // 👇 put it here, inside your component
  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    // Redirect after logout
    window.location.href = "/";
  };

  return (
    <header className="py-4 border-b">
      <nav className="container mx-auto flex items-center justify-between">
        {/* left side */}
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg">
            VoyAIge
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="#" className="text-sm font-medium text-muted-foreground">
              Features
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground">
              Pricing
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground">
              About
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground">
              Contact
            </Link>
          </div>
        </div>

        {/* right side */}
        <div className="flex items-center gap-2">
          <ModeToggle />

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-9 w-9 cursor-pointer">

                <AvatarFallback>VS</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Edit Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/settings/preferences" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" /> Manage Preferences
                </Link>

              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}

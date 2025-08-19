import { ModeToggle } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="py-4 border-b">
      <nav className="container mx-auto flex items-center justify-between">
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
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost">Sign In</Button>
          <Button>Sign Up</Button>
        </div>
      </nav>
    </header>
  );
}

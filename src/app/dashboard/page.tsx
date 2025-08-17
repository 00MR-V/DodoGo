// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { userNeedsPreferences } from "@/server/preferences";
import { Logout } from "@/components/logout";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
    const needsPrefs = await userNeedsPreferences();
    if (needsPrefs) {
        redirect("/preferences-setup");
    }

    return (
        <main className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Dashboard</h1>

            <div className="flex gap-3">
                <Link href="/settings/preferences">
                    <Button variant="outline">Manage preferences</Button>
                </Link>
                <Logout />
            </div>
        </main>
    );
}

// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { userNeedsPreferences } from "@/server/preferences";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Clock } from "lucide-react";

export default async function Dashboard() {
    const needsPrefs = await userNeedsPreferences();
    if (needsPrefs) {
        redirect("/preferences-setup");
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-b from-muted/50 to-background">
            {/* Welcome / Call-to-action */}
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">Welcome Vishan </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Ready to plan your next trip? Start below or check your recent activity.
                </p>

                <Link href="/another-page">
                    <Button
                        size="lg"
                        className="px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl"
                    >
                        Start Planning
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>

            {/* Recent Activity Section */}
            <div className="mt-12 w-full max-w-xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm text-center py-6">
                            No activity yet — start planning your first trip!
                        </p>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
